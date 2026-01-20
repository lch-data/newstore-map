"use client";

import { Store, daysSince } from "@/lib/stores";
import { isBookmarked, toggleBookmark } from "@/lib/bookmarks";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function StoreList({ stores }: { stores: Store[] }) {
  const router = useRouter();
  const [tick, setTick] = useState(0);

  return (
    <div>
      {stores.map((s) => {
        const d = daysSince(s.openedAt);
        const bookmarked = isBookmarked(s.id);

        return (
          <div
            key={s.id}
            className="card"
            style={{ marginBottom: 12, cursor: "pointer" }}
            onClick={() => router.push(`/stores/${s.id}`)}
          >
            <div className="row" style={{ justifyContent: "space-between" }}>
              <div style={{ fontWeight: 800, fontSize: 18 }}>{s.name}</div>

              <button
                className="button"
                onClick={(e) => {
                  e.stopPropagation(); // 카드 클릭(상세이동) 막기
                  toggleBookmark(s.id);
                  setTick((v) => v + 1);
                }}
              >
                {bookmarked ? "★" : "☆"}
              </button>
            </div>

            <div style={{ color: "var(--muted)", marginTop: 6 }}>
              {s.category} · 오픈 {d}일차 · {s.address}
            </div>

            <div style={{ marginTop: 8 }}>{s.shortDesc}</div>

            {s.event && (
              <div style={{ marginTop: 8 }}>
                <span className="badge">이벤트</span>{" "}
                <span style={{ marginLeft: 6 }}>
                  {s.event.title} (~{s.event.endsAt})
                </span>
              </div>
            )}
          </div>
        );
      })}

      {stores.length === 0 && (
        <div style={{ color: "var(--muted)", padding: 10 }}>
          조건에 맞는 신규 매장이 없어요.
        </div>
      )}

      <span style={{ display: "none" }}>{tick}</span>
    </div>
  );
}
