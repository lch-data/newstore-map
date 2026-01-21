"use client";

import { SAMPLE_STORES, daysSince } from "@/lib/stores";
import { isBookmarked, toggleBookmark } from "@/lib/bookmarks";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";

export default function StoreDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [tick, setTick] = useState(0);

  const store = useMemo(() => {
    return SAMPLE_STORES.find((s) => s.id === id);
  }, [id]);

  if (!store) {
    return (
      <div className="grid">
        <section className="card">
          <h2>매장을 찾을 수 없어요</h2>
          <div style={{ color: "var(--muted)", marginTop: 8 }}>
            존재하지 않는 매장 ID일 수 있어요.
          </div>
          <div className="controls" style={{ marginTop: 16 }}>
            <a className="button" href="/">홈으로</a>
            <a className="button" href="/map">지도</a>
          </div>
        </section>
      </div>
    );
  }

  const d = daysSince(store.openedAt);
  const bookmarked = isBookmarked(store.id);

  return (
    <div className="grid">
      <section className="card">
        <div
          className="row"
          style={{ alignItems: "center", justifyContent: "space-between" }}
        >
          <h2 style={{ margin: 0 }}>{store.name}</h2>
          <button
            className="button"
            onClick={() => {
              toggleBookmark(store.id);
              setTick((v) => v + 1);
            }}
          >
            {bookmarked ? "★ 북마크됨" : "☆ 북마크"}
          </button>
        </div>

        <div className="row" style={{ marginTop: 10, gap: 8, flexWrap: "wrap" }}>
          <span className="badge gray">{store.category}</span>
          {store.isSoftOpen && <span className="badge">가오픈</span>}
          <span className="badge gray">오픈 {d}일차</span>
        </div>

        <div style={{ marginTop: 14, lineHeight: 1.8 }}>
          <div>
            <b>한줄소개:</b> {store.shortDesc}
          </div>
          <div>
            <b>주소:</b> {store.address}
          </div>
          <div>
            <b>오픈일:</b> {store.openedAt}
          </div>
          {store.event && (
            <div>
              <b>이벤트:</b> {store.event.title} (~{store.event.endsAt})
            </div>
          )}
        </div>

        <div className="controls" style={{ marginTop: 18 }}>
          <a className="button" href="/map">지도에서 보기</a>
          <a className="button" href="/bookmarks">즐겨찾기 리스트</a>
          <a className="button" href="/">홈으로</a>
        </div>

        <span style={{ display: "none" }}>{tick}</span>
      </section>

      <aside className="card">
        <h2>점주용 안내</h2>
        <div style={{ color: "var(--muted)", lineHeight: 1.7 }}>
          여기는 MVP 샘플 데이터 화면이야.
          <ul>
            <li>추후 점주 등록 + 승인 후 실제 데이터로 전환</li>
            <li>메뉴/가격/사진/영업시간/전화번호 추가</li>
            <li>오픈 이벤트 광고(배너/상단 노출)로 수익화 가능</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
