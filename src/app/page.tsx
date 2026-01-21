"use client";

import StoreList from "../components/StoreList";
import { SAMPLE_STORES, byCategory, sortNewest, withinDays } from "@/lib/stores";
import { loadStores } from "@/lib/db";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const CATEGORIES = ["전체", "카페", "음식", "미용", "헬스", "기타"] as const;
type Category = (typeof CATEGORIES)[number];

const REGIONS = ["전체", "서울", "경기", "인천", "부산", "대구", "광주", "대전", "울산"] as const;
type Region = (typeof REGIONS)[number];

const SORTS = ["최신 오픈순", "거리순", "이벤트 종료 임박순", "북마크 많은 순(준비중)"] as const;
type SortKey = (typeof SORTS)[number];

function parseYmd(ymd: string): number {
  // YYYY-MM-DD -> timestamp (ms)
  const t = new Date(ymd + "T00:00:00").getTime();
  return Number.isNaN(t) ? 0 : t;
}

function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  return R * c;
}

export default function HomePage() {
  const [days, setDays] = useState<"7" | "30" | "90">("90");
  const [category, setCategory] = useState<Category>("전체");
  const [region, setRegion] = useState<Region>("전체");
  const [sortKey, setSortKey] = useState<SortKey>("최신 오픈순");
  const [rawQuery, setRawQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [geo, setGeo] = useState<{ lat: number; lng: number } | null>(null);
  const [geoStatus, setGeoStatus] = useState<string>("");

  // 검색어 디바운스 (300ms)
  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(rawQuery), 300);
    return () => clearTimeout(id);
  }, [rawQuery]);

  // 거리순 선택 시 현재 위치(컨셉) 가져오기
  useEffect(() => {
    if (sortKey !== "거리순") return;
    if (geo) return;
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGeo({ lat: 37.5665, lng: 126.978 }); // 서울시청(기본값)
      setGeoStatus("현재 위치를 사용할 수 없어 기본 위치(서울)로 정렬 중");
      return;
    }

    setGeoStatus("현재 위치 확인 중...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeo({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeoStatus("현재 위치 기준으로 거리순 정렬 중");
      },
      () => {
        setGeo({ lat: 37.5665, lng: 126.978 });
        setGeoStatus("위치 권한이 없어 기본 위치(서울)로 거리순 정렬 중");
      },
      { enableHighAccuracy: false, timeout: 4000 }
    );
  }, [sortKey, geo]);

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

    const query = debouncedQuery.trim().toLowerCase();
    const searched = !query
      ? regionFiltered
      : regionFiltered.filter((s) => {
      return (
        s.name.toLowerCase().includes(query) ||
        s.address.toLowerCase().includes(query) ||
        (s.shortDesc ?? "").toLowerCase().includes(query)
      );
    });

    // 정렬
    if (sortKey === "최신 오픈순") return sortNewest(searched);

    if (sortKey === "이벤트 종료 임박순") {
      const withEvent = searched.filter((s) => s.event?.endsAt);
      const withoutEvent = searched.filter((s) => !s.event?.endsAt);
      withEvent.sort((a, b) => parseYmd(a.event!.endsAt) - parseYmd(b.event!.endsAt));
      return [...withEvent, ...withoutEvent];
    }

    if (sortKey === "거리순") {
      const origin = geo ?? { lat: 37.5665, lng: 126.978 };
      return [...searched].sort((a, b) => {
        const da = haversineKm(origin, { lat: a.lat, lng: a.lng });
        const db = haversineKm(origin, { lat: b.lat, lng: b.lng });
        return da - db;
      });
    }

    // "북마크 많은 순(준비중)"은 아직 서버/집계 데이터가 없으므로 최신순 유지
    return sortNewest(searched);
  }, [days, category, region, debouncedQuery, storesFromDb, sortKey, geo]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      setDebouncedQuery(rawQuery);
    } else if (e.key === "Escape") {
      setRawQuery("");
      setDebouncedQuery("");
    }
  }

  return (
    <div className="grid">
      <section className="card">
        <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
          <h2>신규 오픈 매장</h2>
          <div className="muted">검색 결과 {stores.length}개</div>
        </div>

        <div className="homeHero" style={{ marginBottom: 12 }}>
          <div className="searchBar">
            <input
              className="input"
              placeholder="매장명 / 지역 / 키워드로 검색"
              value={rawQuery}
              onChange={(e) => setRawQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {rawQuery && (
              <button
                className="iconButton"
                style={{ width: 40 }}
                onClick={() => {
                  setRawQuery("");
                  setDebouncedQuery("");
                }}
                aria-label="검색어 초기화"
              >
                ✕
              </button>
            )}
            <Link className="button" href="/map">
              지도 보기
            </Link>
          </div>

          <div className="filtersRow">
            <div style={{ display: "grid", gap: 4 }}>
              <span className="muted" style={{ fontSize: 12 }}>지역</span>
              <select
                className="select"
                aria-label="지역 필터"
                value={region}
                onChange={(e) => setRegion(e.target.value as any)}
              >
                {REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r === "전체" ? "지역 전체" : r}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "grid", gap: 4 }}>
              <span className="muted" style={{ fontSize: 12 }}>업종</span>
              <select
                className="select"
                aria-label="업종 필터"
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c === "전체" ? "업종 전체" : c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="controls">
            <select
              className="select"
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as any)}
              title="정렬"
            >
              {SORTS.map((s) => (
                <option key={s} value={s} disabled={s.includes("준비중")}>
                  {s}
                </option>
              ))}
            </select>

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

          {sortKey === "거리순" && geoStatus && (
            <div className="muted" style={{ fontSize: 12 }}>
              {geoStatus}
            </div>
          )}
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
              임시로 잡아놓음.
            </div>
          </div>

          <div className="adBanner">
            <div style={{ fontWeight: 900, marginBottom: 6 }}>
              광고 배너 영역
            </div>
            <div className="muted" style={{ lineHeight: 1.55 }}>
              예: 광고 배너 영역입니다.
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
