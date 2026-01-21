"use client";

import { SAMPLE_STORES, daysSince } from "@/lib/stores";
import { isBookmarked, toggleBookmark } from "@/lib/bookmarks";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";

export default function StoreDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [tick, setTick] = useState(0);
  const [ownerIntro, setOwnerIntro] = useState("");
  const [menuNote, setMenuNote] = useState("");
  const [repPhotos, setRepPhotos] = useState<string[]>([]);
  const [interiorPhotos, setInteriorPhotos] = useState<string[]>([]);
  const [menuPhotos, setMenuPhotos] = useState<string[]>([]);

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

      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h2>점주님 업로드 존 (컨셉)</h2>
        <div className="muted" style={{ marginBottom: 10, lineHeight: 1.6 }}>
          사진/소개/메뉴판을 올리면 상세 하단에 노출돼요. 지금은 로컬 상태만 보이는 컨셉입니다.
        </div>

        <div className="controls" style={{ flexWrap: "wrap", gap: 12, marginBottom: 10 }}>
          <label className="button" style={{ cursor: "pointer" }}>
            대표사진 업로드
            <input
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={(e) => {
                const names = Array.from(e.target.files ?? []).map((f) => f.name);
                setRepPhotos(names);
              }}
            />
          </label>
          <label className="button" style={{ cursor: "pointer" }}>
            인테리어/메뉴 사진
            <input
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={(e) => {
                const names = Array.from(e.target.files ?? []).map((f) => f.name);
                setInteriorPhotos(names);
              }}
            />
          </label>
          <label className="button" style={{ cursor: "pointer" }}>
            메뉴판 업로드
            <input
              type="file"
              accept="image/*,.pdf"
              multiple
              style={{ display: "none" }}
              onChange={(e) => {
                const names = Array.from(e.target.files ?? []).map((f) => f.name);
                setMenuPhotos(names);
              }}
            />
          </label>
        </div>

        <div className="controls" style={{ flexDirection: "column", gap: 10, alignItems: "stretch" }}>
          <textarea
            className="input"
            style={{ height: 80, width: "100%", resize: "vertical" }}
            placeholder="대표 소개글 (예: 시그니처, 운영시간, 주차/포장/배달 안내 등)"
            value={ownerIntro}
            onChange={(e) => setOwnerIntro(e.target.value)}
          />
          <textarea
            className="input"
            style={{ height: 70, width: "100%", resize: "vertical" }}
            placeholder="메뉴판 텍스트 (가격/추천 메뉴)"
            value={menuNote}
            onChange={(e) => setMenuNote(e.target.value)}
          />
        </div>

        <div style={{ marginTop: 12, display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          <div className="card" style={{ background: "rgba(255,255,255,0.04)" }}>
            <div className="muted" style={{ marginBottom: 6 }}>대표사진</div>
            {repPhotos.length === 0 ? (
              <div className="muted">업로드된 대표사진이 없어요.</div>
            ) : (
              <ul className="muted">
                {repPhotos.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="card" style={{ background: "rgba(255,255,255,0.04)" }}>
            <div className="muted" style={{ marginBottom: 6 }}>인테리어/메뉴 사진</div>
            {interiorPhotos.length === 0 ? (
              <div className="muted">업로드된 사진이 없어요.</div>
            ) : (
              <ul className="muted">
                {interiorPhotos.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="card" style={{ background: "rgba(255,255,255,0.04)" }}>
            <div className="muted" style={{ marginBottom: 6 }}>메뉴판 파일</div>
            {menuPhotos.length === 0 ? (
              <div className="muted">업로드된 메뉴판이 없어요.</div>
            ) : (
              <ul className="muted">
                {menuPhotos.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="muted" style={{ marginTop: 12, fontSize: 12 }}>
          현재는 로컬 상태로만 보이며 저장/배포되지 않습니다. (컨셉용)
        </div>
      </section>
    </div>
  );
}
