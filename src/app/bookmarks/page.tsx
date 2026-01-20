"use client";

import StoreList from "@/components/StoreList";
import { SAMPLE_STORES, sortNewest } from "@/lib/stores";
import { getBookmarks } from "@/lib/bookmarks";
import { useMemo, useState } from "react";

export default function BookmarksPage() {
  const [tick, setTick] = useState(0);

  const stores = useMemo(() => {
    const ids = new Set(getBookmarks());
    return sortNewest(SAMPLE_STORES.filter((s) => ids.has(s.id)));
  }, [tick]);

  return (
    <div className="grid">
      <section className="card">
        <h2>북마크한 신규 매장</h2>

        <div className="controls" style={{ marginBottom: 12 }}>
          <button className="button" onClick={() => setTick((v) => v + 1)}>
            새로고침
          </button>
          <a className="button" href="/">홈으로</a>
          <a className="button" href="/map">지도</a>
        </div>

        <StoreList stores={stores} />
      </section>

      <aside className="card">
        <h2>팁</h2>
        <div style={{ color: "var(--muted)", lineHeight: 1.7 }}>
          홈/지도/상세에서 ☆(북마크)를 누르면 여기에 모여.
          <br />
          다음 단계에서 “공유 링크”도 만들 수 있어.
        </div>
      </aside>
    </div>
  );
}
