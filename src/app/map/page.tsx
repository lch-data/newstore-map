"use client";

import MapView from "@/components/MapView";
import { SAMPLE_STORES, sortNewest, withinDays } from "@/lib/stores";
import { loadStores } from "@/lib/db";
import { useMemo, useState } from "react";

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
          <select
            className="select"
            value={days}
            onChange={(e) => setDays(e.target.value as any)}
          >
            <option value="7">7일 이내</option>
            <option value="30">30일 이내</option>
            <option value="90">90일 이내</option>
          </select>
          <a className="button" href="/">홈으로</a>
          <a className="button" href="/admin">관리자</a>
        </div>

        <MapView stores={stores} />
      </section>

      <aside className="card">
        <h2>설명</h2>
        <div style={{ color: "var(--muted)", lineHeight: 1.6 }}>
          지도는 지금은 <b>Leaflet(OpenStreetMap)</b>으로 만든 MVP 버전이야.
          <br />
          나중에 네이버 지도 / 카카오 지도 API로 쉽게 교체할 수 있어.
        </div>
      </aside>
    </div>
  );
}
