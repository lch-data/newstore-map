export type StoreCategory = "카페" | "음식" | "미용" | "헬스" | "기타";

export type Store = {
  id: string;
  name: string;
  category: StoreCategory;
  openedAt: string; // YYYY-MM-DD
  isSoftOpen?: boolean;
  lat: number;
  lng: number;
  address: string;
  shortDesc: string;
  event?: {
    title: string;
    endsAt: string; // YYYY-MM-DD
  };
};

const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export const SAMPLE_STORES: Store[] = [
  {
    id: "s1",
    name: "오로라 커피 바",
    category: "카페",
    openedAt: daysAgo(6),
    isSoftOpen: true,
    lat: 37.5563,
    lng: 126.922,
    address: "서울 마포구 (홍대 인근)",
    shortDesc: "가오픈 중! 시그니처 라떼 1+1",
    event: { title: "가오픈 1+1", endsAt: daysAgo(-4) },
  },
  {
    id: "s2",
    name: "강남 스시하우스",
    category: "음식",
    openedAt: daysAgo(12),
    lat: 37.4979,
    lng: 127.0276,
    address: "서울 강남구 (강남역 인근)",
    shortDesc: "오픈 기념 세트 20% 할인",
    event: { title: "세트 20% 할인", endsAt: daysAgo(-1) },
  },
  {
    id: "s3",
    name: "건대 바버샵 101",
    category: "미용",
    openedAt: daysAgo(28),
    lat: 37.5406,
    lng: 127.0703,
    address: "서울 광진구 (건대입구 인근)",
    shortDesc: "첫 방문 커트 5천원 할인",
    event: { title: "첫 방문 할인", endsAt: daysAgo(7) },
  },
  {
    id: "s4",
    name: "성수 리커버리짐",
    category: "헬스",
    openedAt: daysAgo(71),
    lat: 37.5446,
    lng: 127.0557,
    address: "서울 성동구 (성수역 인근)",
    shortDesc: "체험 PT 1회 무료",
    event: { title: "PT 1회 무료", endsAt: daysAgo(12) },
  },
  {
    id: "s5",
    name: "잠실 분식랩",
    category: "음식",
    openedAt: daysAgo(92), // 90일 밖(테스트용)
    lat: 37.5133,
    lng: 127.1002,
    address: "서울 송파구 (잠실 인근)",
    shortDesc: "오픈 초기 이벤트 종료",
  },
];

export function daysSince(dateStr: string): number {
  const t = new Date(dateStr + "T00:00:00").getTime();
  const now = new Date().getTime();
  const diff = now - t;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function withinDays(store: Store, maxDays: number): boolean {
  return daysSince(store.openedAt) <= maxDays;
}

export function byCategory(stores: Store[], category: string): Store[] {
  if (category === "전체") return stores;
  return stores.filter((s) => s.category === category);
}

export function sortNewest(stores: Store[]): Store[] {
  return [...stores].sort((a, b) => (a.openedAt < b.openedAt ? 1 : -1));
}
