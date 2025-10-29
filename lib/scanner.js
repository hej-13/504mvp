// lib/scanner.js
import { URL } from "url";
import { fetchPage, diffResponses } from "./utils.js";

/**
 * 파라미터 목록 추출
 */
function extractParams(urlStr) {
  const url = new URL(urlStr);
  const params = [];
  for (const [k, v] of url.searchParams.entries()) {
    params.push({ name: k, value: v });
  }
  return params;
}

/**
 * 간단 페이로드 목록 (향후 확장)
 */
const PAYLOADS = [
  {"name":"single_quote","value":"'"},
  {"name":"xss_test","value":"<script>alert(1)</script>"},
  {"name":"boolean_true","value":"1"},
];

/**
 * scan(url): 핵심 함수
 * - URL의 각각 파라미터에 대해 payload 삽입 → 정상 vs 테스트 비교 → 보고서 작성
 */
export async function scan(targetUrl, options = {}) {
  console.log(`스캔 시작: ${targetUrl}`);
  const params = extractParams(targetUrl);

  if (params.length === 0) {
    return { ok: false, message: "URL에 파라미터가 없습니다. 예: http://localhost:8080/?id=1" };
  }

  // 기본 응답(원본)
  const baseResp = await fetchPage(targetUrl);
  const findings = [];

  // 각 파라미터에 대해 페이로드 삽입 테스트
  for (const p of params) {
    for (const payload of PAYLOADS) {
      // 새로운 URL 생성 (단순문자열 대체. 실제로는 더 안전한 빌더 사용 권장)
      const testUrl = new URL(targetUrl);
      testUrl.searchParams.set(p.name, p.value + payload.value);

      const testResp = await fetchPage(testUrl.toString());
      const diff = diffResponses(baseResp, testResp);

      findings.push({
        param: p.name,
        original: p.value,
        payload: payload.value,
        testUrl: testUrl.toString(),
        result: diff
      });
    }
  }

  // 간단 리포트 요약
  const vulnerable = findings.filter(f => f.result.vulnerable);
  const report = {
    target: targetUrl,
    scannedAt: new Date().toISOString(),
    totalTests: findings.length,
    findings,
    vulnerableCount: vulnerable.length,
    vulnerable
  };

  return { ok: true, report };
}