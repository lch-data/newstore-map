"use client";

import StoreList from "../components/StoreList";
import { SAMPLE_STORES, byCategory, sortNewest, withinDays } from "@/lib/stores";
import { loadStores } from "@/lib/db";
import Link from "next/link";
import { useMemo, useState } from "react";

const CATEGORIES = ["전체", "카페", "음식", "미용", "헬스", "기타"] as const;
type Category = (typeof CATEGORIES)[number];

const REGIONS = ["전체", "서울", "경기", "인천", "부산", "대구", "광주", "대전", "울산"] as const;
type Region = (typeof REGIONS)[number];

export default function HomePage() {
  const [days, setDays] = useState<"7" | "30" | "90">("90");
  const [category, setCategory] = useState<Category>("전체");
  const [region, setRegion] = useState<Region>("전체");
  const [q, setQ] = useState("");

  // ✅ 로컬 저장 데이터 불러오기 (없으면 샘플)
  const storesFromDb = useMemo(() => loadStores(SAMPLE_STORES), []);

  const stores = useMemo(() => {
    const maxDays = Number(days);
    const base = sortNewest(storesFromDb.filter((s) => withinDays(s, maxDays)));

    const catFiltered = byCategory(base, category);

    const regionFiltered =
      region === "전체"
        ? catFiltered
        : catFiltered.filter((s) => s.address.includes(region));

    const query = q.trim().toLowerCase();
    if (!query) return regionFiltered;

    return regionFiltered.filter((s) => {
      return (
        s.name.toLowerCase().includes(query) ||
        s.address.toLowerCase().includes(query) ||
        (s.shortDesc ?? "").toLowerCase().includes(query)
      );
    });
  }, [days, category, region, q, storesFromDb]);

  return (
    <div className="grid">
      <section className="card">
        <h2>신규 오픈 매장</h2>

        <div className="homeHero" style={{ marginBottom: 12 }}>
          <div className="searchBar">
            <input
              className="input"
              placeholder="매장명 / 지역 / 키워드로 검색"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <Link className="button" href="/map">
              지도 보기
            </Link>
          </div>

          <div className="filtersRow">
            <select
              className="select"
              value={region}
              onChange={(e) => setRegion(e.target.value as any)}
            >
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            <select
              className="select"
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="controls">
            <select
              className="select"
              value={days}
              onChange={(e) => setDays(e.target.value as any)}
              title="신규 오픈 기간"
            >
              <option value="7">7일 이내</option>
              <option value="30">30일 이내</option>
              <option value="90">90일 이내</option>
            </select>

            <Link className="button" href="/bookmarks">
              북마크
            </Link>
          </div>
        </div>

        <StoreList stores={stores} />
      </section>

      <aside className="card">
        <h2>추천 / 이벤트 배너 (임시)</h2>

        <div className="bannerStrip" style={{ marginBottom: 12 }}>
          <div className="adBanner">
            <div style={{ fontWeight: 900, marginBottom: 6 }}>
              내 관심사 + 내 위치 기반 추천 (컨셉)
            </div>
            <div className="muted" style={{ lineHeight: 1.55 }}>
              아직 지도/로그인 데이터를 붙이기 전이라, 여기엔 “추천 광고 배너 영역”만
              임시로 잡아놨어요.
            </div>
          </div>

          <div className="adBanner">
            <div style={{ fontWeight: 900, marginBottom: 6 }}>
              신규 오픈 이벤트 모아보기
            </div>
            <div className="muted" style={{ lineHeight: 1.55 }}>
              예: “오픈 30% 할인”, “사은품 증정” 같은 배너가 슬라이드로 들어갈 자리.
            </div>
          </div>
        </div>

        <h2>컨셉 메모</h2>
        <div className="muted" style={{ lineHeight: 1.7 }}>
          - 홈: 검색 → 지역/업종 선택 → 지도보기
          <br />- 지도: 추후 네이버/카카오 API로 교체 예정
          <br />- 추천 배너: 로그인/관심사/위치 붙이면 개인화
        </div>
      </aside>
    </div>
  );
}
