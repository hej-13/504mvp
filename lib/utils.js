// lib/utils.js
import axios from "axios";

/**
 * GET 요청을 보내고 { status, data, length } 반환
 */
export async function fetchPage(url, timeout = 5000) {
  const res = await axios.get(url, { timeout }).catch(err => {
    // axios 오류는 status가 없을 수 있음
    return { error: err };
  });

  if (res && res.error) {
    // 네트워크 오류 등
    return { ok: false, error: res.error.message };
  }

  const status = res.status || 200;
  const data = typeof res.data === "string" ? res.data : JSON.stringify(res.data);
  return { ok: true, status, data, length: data.length };
}

/**
 * 아주 간단한 응답 비교:
 * - status 코드 변화
 * - 응답 길이 차이 (임계값 50자)
 * - 에러 표현(예: "SQL", "error", "Exception") 포함 여부
 */
export function diffResponses(base, test) {
  const reasons = [];

  if (!base.ok || !test.ok) {
    reasons.push("요청 오류 (네트워크/타임아웃)");
    return { vulnerable: true, reasons };
  }

  if (base.status !== test.status) {
    reasons.push(`HTTP 상태코드 변동: ${base.status} -> ${test.status}`);
  }

  const lenDiff = Math.abs(base.length - test.length);
  if (lenDiff > 50) reasons.push(`응답 길이 차이: ${base.length} vs ${test.length}`);

  // 기본적인 에러/SQL 키워드 탐지
  const errorPatterns = ["sql", "SQL", "SQLException", "error", "Exception", "Warning", "syntax"];
  for (const p of errorPatterns) {
    if (test.data.includes(p) && !base.data.includes(p)) {
      reasons.push(`테스트 응답에 에러/키워드 발견: ${p}`);
    }
  }

  return { vulnerable: reasons.length > 0, reasons };
}