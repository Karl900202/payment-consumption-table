## 목표

1.consumptions를 [salesOrder.id]기준으로 그룹핑하고, 그룹별 Sub Total(= 해당 그룹의 orderAmount 합계)을 표시

- consumptions를 salesOrder.id 기준으로 1차 그룹핑
- 동일 스타일 내 자재 단위 결제를 고려하여 supplierItemCode 기준으로 2차 그룹핑
- supplierItemCode 그룹별 Sub Total(orderAmount 합계) 계산

  2.컬럼별 검색 토글과 조건 선택으로 목록을 필터링
  3.payment, paymentBreakdowns와 consumptions 간 매핑을 화면에서 식별 가능하도록 표시
