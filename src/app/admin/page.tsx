"use client";

import { useEffect, useMemo, useState } from "react";
import { Store } from "@/lib/stores";
import { SAMPLE_STORES } from "@/lib/stores";
import { loadStores, saveStores } from "@/lib/db";
import { geocodeAddress } from "@/lib/geocode";


const CATEGORIES = ["카페", "음식", "미용", "헬스", "기타"] as const;

function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function makeId() {
  return `s${Math.random().toString(16).slice(2, 10)}`;
}

export default function AdminPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [form, setForm] = useState({
    name: "",
    category: "카페",
    address: "",
    shortDesc: "",
    openedAt: todayISO(),
    lat: "37.5665",
    lng: "126.9780",
    isSoftOpen: false,
    eventTitle: "",
    eventEndsAt: "",
  });

  const [geoStatus, setGeoStatus] = useState<string>("");
  const [geoLoading, setGeoLoading] = useState(false);

  useEffect(() => {
    const loaded = loadStores(SAMPLE_STORES);
    setStores(loaded);
  }, []);

  const total = stores.length;

  const canSubmit = useMemo(() => {
    return (
      form.name.trim().length >= 2 &&
      form.address.trim().length >= 2 &&
      form.shortDesc.trim().length >= 2 &&
      /^\d{4}-\d{2}-\d{2}$/.test(form.openedAt) &&
      !Number.isNaN(Number(form.lat)) &&
      !Number.isNaN(Number(form.lng))
    );
  }, [form]);

  function resetForm() {
    setForm((f) => ({
      ...f,
      name: "",
      address: "",
      shortDesc: "",
      openedAt: todayISO(),
      lat: "37.5665",
      lng: "126.9780",
      isSoftOpen: false,
      eventTitle: "",
      eventEndsAt: "",
    }));
  }
  async function onGeocode() {
    const addr = form.address.trim();
    if (addr.length < 2) {
      alert("주소를 먼저 입력해주세요.");
      return;
    }
  
    try {
      setGeoLoading(true);
      setGeoStatus("주소 검색 중...");
  
      const result = await geocodeAddress(addr);
  
      if (!result) {
        setGeoStatus("좌표를 찾지 못했어요. 주소를 더 자세히 써주세요. (예: 서울 마포구 양화로 12)");
        return;
      }
  
      setForm((f) => ({
        ...f,
        lat: String(result.lat),
        lng: String(result.lng),
      }));
  
      setGeoStatus(`좌표 자동 입력 완료: ${result.displayName}`);
    } finally {
      setGeoLoading(false);
    }
  }
  
  function onAdd() {
    if (!canSubmit) return;

    const newStore: Store = {
      id: makeId(),
      name: form.name.trim(),
      category: form.category as any,
      address: form.address.trim(),
      shortDesc: form.shortDesc.trim(),
      openedAt: form.openedAt,
      lat: Number(form.lat),
      lng: Number(form.lng),
      isSoftOpen: form.isSoftOpen,
      event:
        form.eventTitle.trim().length >= 2 && form.eventEndsAt.trim().length >= 8
          ? { title: form.eventTitle.trim(), endsAt: form.eventEndsAt.trim() }
          : undefined,
    };

    const next = [newStore, ...stores];
    setStores(next);
    saveStores(next);
    resetForm();
    alert("추가 완료 홈/지도에서 확인해보세요.");
  }

  function onResetToSample() {
    if (!confirm("샘플 데이터로 초기화할까요? (내가 추가한 매장 데이터가 삭제돼요)")) return;
    setStores(SAMPLE_STORES);
    saveStores(SAMPLE_STORES);
    alert("초기화 완료했습니다.");
  }

  return (
    <div className="grid">
      <section className="card">
        <h2>관리자(가짜) - 신규 매장 등록</h2>

        <div style={{ color: "var(--muted)", marginBottom: 12 }}>
          현재 저장된 매장: <b>{total}</b>개 (브라우저 LocalStorage에 저장)
        </div>

        <div className="card" style={{ marginBottom: 12 }}>
          <div className="row" style={{ gap: 10, flexWrap: "wrap" }}>
            <input
              className="input"
              placeholder="매장명"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
            <select
              className="select"
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="row" style={{ gap: 10, marginTop: 10, flexWrap: "wrap" }}>
            <input
              className="input"
              placeholder="주소 (예: 서울 마포구 …)"
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
            />
            <input
              className="input"
              placeholder="한줄소개 (예: 가오픈 1+1 이벤트)"
              value={form.shortDesc}
              onChange={(e) => setForm((f) => ({ ...f, shortDesc: e.target.value }))}
            />
          </div>
          {/* ✅ 주소 -> 좌표 자동 입력 버튼 (여기에 추가) */}
<div className="controls" style={{ marginTop: 10 }}>
  <button className="button" onClick={onGeocode} disabled={geoLoading}>
    {geoLoading ? "주소 찾는 중..." : "주소로 좌표 자동 입력"}
  </button>
  <span style={{ color: "var(--muted)" }}>{geoStatus}</span>
</div>




          <div className="row" style={{ gap: 10, marginTop: 10, flexWrap: "wrap" }}>
            <input
              className="input"
              placeholder="오픈일 (YYYY-MM-DD)"
              value={form.openedAt}
              onChange={(e) => setForm((f) => ({ ...f, openedAt: e.target.value }))}
              style={{ maxWidth: 180 }}
            />
            <input
              className="input"
              placeholder="위도(lat)"
              value={form.lat}
              onChange={(e) => setForm((f) => ({ ...f, lat: e.target.value }))}
              style={{ maxWidth: 160 }}
            />
            <input
              className="input"
              placeholder="경도(lng)"
              value={form.lng}
              onChange={(e) => setForm((f) => ({ ...f, lng: e.target.value }))}
              style={{ maxWidth: 160 }}
            />

            <label className="row" style={{ gap: 8, alignItems: "center" }}>
              <input
                type="checkbox"
                checked={form.isSoftOpen}
                onChange={(e) => setForm((f) => ({ ...f, isSoftOpen: e.target.checked }))}
              />
              가오픈
            </label>
          </div>

          <div className="row" style={{ gap: 10, marginTop: 10, flexWrap: "wrap" }}>
            <input
              className="input"
              placeholder="이벤트 제목 (선택)"
              value={form.eventTitle}
              onChange={(e) => setForm((f) => ({ ...f, eventTitle: e.target.value }))}
            />
            <input
              className="input"
              placeholder="이벤트 종료일 (예: 2026-02-10)"
              value={form.eventEndsAt}
              onChange={(e) => setForm((f) => ({ ...f, eventEndsAt: e.target.value }))}
            />
          </div>

          <div className="controls" style={{ marginTop: 12 }}>
            <button className="button" disabled={!canSubmit} onClick={onAdd}>
              신규 매장 추가
            </button>
            <button className="button" onClick={resetForm}>
              입력 초기화
            </button>
            <button className="button" onClick={onResetToSample}>
              샘플로 되돌리기
            </button>
          </div>
        </div>

        <div className="controls">
          <a className="button" href="/">홈</a>
          <a className="button" href="/map">지도</a>
          <a className="button" href="/bookmarks">북마크</a>
        </div>
      </section>

      <aside className="card">
        <h2>다음 단계</h2>
        <div style={{ color: "var(--muted)", lineHeight: 1.7 }}>
          지금은 “가짜 관리자” 페이지로 로컬 저장만 합니다.
          <ul>
          <li>그 다음: 지도에서 주소 검색 → lat/lng 자동 입력</li>
            <li>마지막: Supabase/Firebase로 DB 전환</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}