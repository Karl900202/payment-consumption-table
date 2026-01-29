import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { mockData } from "@/data/mockData";

/**
 * json-server가 읽을 수 있는 db.json 생성 스크립트
 * - dev 환경에서 mockData.ts를 단일 소스로 유지하고
 * - 실행 시점에 db.json을 생성해 API로 제공
 */
function main() {
  const outPath = resolve(process.cwd(), "db.json");
  const db = {
    consumptions: mockData.consumptions,
    payments: mockData.payments,
    paymentBreakdowns: mockData.paymentBreakdowns,
  };

  writeFileSync(outPath, JSON.stringify(db, null, 2), "utf8");
   
  console.log(`[generate-db] wrote ${outPath}`);
}

main();

