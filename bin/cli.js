#!/usr/bin/env node
import { scan } from "../lib/scanner.js";

const args = process.argv.slice(2);
if (args.length === 0) {
  console.log("사용법: node ./bin/cli.js <URL>");
  process.exit(1);
}

const url = args[0];

(async () => {
  const res = await scan(url);
  if (!res.ok) {
    console.error("스캔 실패:", res.message || res);
    process.exit(2);
  }

  // 콘솔에 간단 리포트 출력
  const rpt = res.report;
  console.log("===== 스캔 요약 =====");
  console.log(`타겟: ${rpt.target}`);
  console.log(`스캔 시간: ${rpt.scannedAt}`);
  console.log(`총 테스트 수: ${rpt.totalTests}`);
  console.log(`취약 의심 발견 수: ${rpt.vulnerableCount}`);
  console.log("----------------------");

  if (rpt.vulnerableCount > 0) {
    rpt.vulnerable.forEach((f, i) => {
      console.log(`[${i+1}] param=${f.param}, payload=${f.payload}`);
      console.log(`   reason: ${f.result.reasons.join(" | ")}`);
      console.log(`   testUrl: ${f.testUrl}`);
    });
  } else {
    console.log("취약 의심 없음 (간단 검사 기준).");
  }
})();