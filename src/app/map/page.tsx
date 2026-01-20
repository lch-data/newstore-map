"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { SAMPLE_STORES, sortNewest, withinDays } from "@/lib/stores";
import { loadStores } from "@/lib/db";

// ✅ 핵심: Leaflet 지도는 브라우저에서만 렌더링 (SSR 끔)
const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="card" style={{ padding: 16 }}>
      지도 로딩 중...
    </div>
  ),
});

export default function MapPage() {
  const [days, setDays] = useState<"7" | "30" | "90">("90");

  const stores = useMemo(() => {
    const maxDays = Number(days);
    const all = loadStores(SAMPLE_STORES);
    return sortNewest(all.filter((s) => withinDays(s, maxDays)));
  }, [days]);

  return (
    <div className="grid">
      <section className="card">
        <h2>신규 매장 지도</h2>

        <div className="controls" style={{ marginBottom: 12 }}>
          <select className="select" value={days} onChange={(e) => setDays(e.target.value as any)}>
            <option value="7">7일 이내</option>
            <option value="30">30일 이내</option>
            <option value="90">90일 이내</option>
          </select>

          <a className="button" href="/">홈으로</a>
          <a className="button" href="/admin">관리자</a>

          <span style={{ color: "var(--muted)", marginLeft: 8 }}>
            📍현재 위치 기준 지도(컨셉) — 지금은 브라우저에서만 지도 렌더링
          </span>
        </div>

        {/* ✅ 여기에서 MapView가 반드시 선언돼 있어야 함 */}
        <MapView stores={stores} />
      </section>

      <aside className="card">
        <h2>설명</h2>
        <div style={{ color: "var(--muted)", lineHeight: 1.6 }}>
          지도는 현재 <b>Leaflet(OpenStreetMap)</b> MVP 버전이야.
          <br />
          추후 네이버/카카오 지도 API로 교체 가능(컨셉 유지).
        </div>
      </aside>
    </div>
  );
}
