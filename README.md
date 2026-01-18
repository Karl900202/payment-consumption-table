## 목표

1.consumptions를 [salesOrder.id]기준으로 그룹핑하고, 그룹별 Sub Total(= 해당 그룹의 orderAmount 합계)을 표시

- consumptions를 salesOrder.id 기준으로 1차 그룹핑
- 동일 스타일 내 자재 단위 결제를 고려하여 supplierItemCode 기준으로 2차 그룹핑
- supplierItemCode 그룹별 Sub Total(orderAmount 합계) 계산

2.컬럼별 검색 토글과 조건 선택으로 목록을 필터링

- 컬럼별 검색을 토글 UI로 제공하여 사용자가 직관적으로 필터 기능을 인지하고 사용할 수 있도록 구성
- 돋보기 아이콘 클릭 시, 4단 헤더 영역에 검색 필터 UI를 노출
- 선택된 검색 조건은 AND 조건으로 적용되어 테이블 데이터를 필터링
- X 버튼 클릭 시 검색 조건 초기화 안내 모달을 표시
  검색 필터가 닫힌 상태에서 데이터가 필터링된 상태로 유지될 경우 사용자가 현재 데이터 상태를 혼동할 수 있다고 판단
  이에 따라 토글이 닫히면 항상 검색 조건이 초기화된 데이터만 노출되도록 설계하여 UI 상태와 데이터 상태의 일관성을 유지

3.payment, paymentBreakdowns와 consumptions 간 매핑을 화면에서 식별 가능하도록 표시

## 요구사항 체크리스트

1. Sub Total
    - consumption을 [salesOrder.id]로 그룹핑  O
    - 각 그룹 하단에 Sub Total 행으로 orderAmount 합계 표시 O
2. 검색(Search)
    - 임의의 Search 토글 버튼 구현  O
    - Toggle ON 시 테이블 최상단에 "검색 행"(tr) 1줄 추가 O
    - 기본값은 All이며, 각 컬럼의 후보는 해당 컬럼의 consumption 고유값 집합 O
    - 선택 시 해당 조건과 일치하는 consumption만 표시 O
    - 다중 컬럼 동시 조건 AND O
3. Mock Data는 다양한 상황을 표현하도록 수정 가능하나 스키마는 유지 O
4. CSS는 정확 일치 불필요. 피그마와 유사한 레이아웃과 상호작용 재현 O

## 실행 방법과 스크립트, 사용 버전(Node, npm 또는 pnpm 또는 yarn)

1. 의존성 설치
-npm install
2. 개발 서버 실행
-npm run dev

사용버전
-Node.js / 패키지 매니저
-Node.js: (package.json에 명시 없음, 일반적으로 18.x 이상)
-패키지 매니저: npm

주요 의존성
-Next.js: 16.1.2
-React: 19.2.3
-React DOM: 19.2.3
-Zustand: ^5.0.10 (상태 관리)
-@headlessui/react: ^2.2.9 (모달 UI)

개발 의존성
-TypeScript
-Tailwind CSS
-ESLint: 

## 폴더 구조 간략 설명

```
payment-consumption-table/
├── app/                         # Next App Router
│   ├── components/              # React 컴포넌트
│   │   ├── tables/              # 테이블 컴포넌트
│   │   │   ├── OrderedTable.tsx
│   │   │   ├── PayableTable.tsx
│   │   │   └── TotalTable.tsx
│   │   ├── forms/               # 입력/필터 컴포넌트
│   │   │   └── FilterDropdown.tsx
│   │   └── ui/                  # 공통 UI 컴포넌트
│   │       ├── Modal.tsx
│   │       └── PriceCell.tsx
│   ├── constants/               # 상수 정의
│   │   └── table.ts
│   ├── data/                    # 데이터 (목업)
│   │   └── mockData.ts
│   ├── lib/                     # 유틸리티 함수
│   │   └── format.ts
│   ├── store/                   # 상태 관리 (Zustand)
│   │   └── orderedTableStore.ts
│   ├── styles/                  # CSS 스타일
│   │   ├── globals.css
│   │   └── payment-table.css
│   ├── types/                   # TypeScript 타입 정의
│   │   ├── domain.ts
│   │   └── table.ts
│   ├── page.tsx                 # 메인 페이지
│   └── layout.tsx               # 레이아웃
├── public/                      
├── package.json
└── tsconfig.json
```

## 주요 설계 의도와 트레이드오프 2~3개

설계의도
-데이터 패칭 및 필터링 로직을 최상위(app/page.tsx)에서 처리해 데이터 흐름 단순화
-복잡한 테이블 구조를 Ordered, Payable, Total 3개의 테이블로 분리해 가독성과 유지보수성 향상
-검색필터 토글 상태를 3개의 테이블에 공유하기 위한 방법으로 전역 상태관리 Zustant 사용
-선택된 필터값을 최상위 컴포넌트에 전파하기 위한 방법으로 전역 상태관리 Zustant 사용
-숫자 데이터 셀은 콘텐츠 생략 없이 셀 너비를 자동 확장하여 전체 값을 표시하도록 구현했습니다
-데이터 타입별로 적절한 포맷팅을 제공하기 위해 lib/format.ts에 각각의 전용 함수를 분리했습니다
  (금액: formatCurrency, 단가: formatUnitPrice, 수량: formatNumber)

트레이드오프
1.Zustand 전역 상태 관리 vs Props Drilling

Zustand로 토글/필터 상태를 전역 관리 Props 전달 없이 여러 컴포넌트가 상태 공유, 코드 단순화
전역 상태 사용 범위가 작으면 오버엔지니어링일 수 있음.
따라서 Props Drilling이 역으로 일어나는 검색 토글 / 필터에만 전역 상태관리 추가 

2. 메모이제이션 최적화 vs 코드 복잡도

memo, useMemo, useCallback 적용 재렌더링 감소하고 성능이 향상할 수 있으나
주어진 과제의 구조로 봤을때 데이터가 작은 경우가 많을것으로 판단 체감 효과가 낮을 수 있고
코드량/의존성 배열 관리 오버헤드가 증가되는 단점이있음