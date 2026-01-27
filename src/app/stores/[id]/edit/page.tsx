"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Store, StoreCategory, SAMPLE_STORES } from "@/lib/stores";
import { loadStores, updateStore } from "@/lib/db";
import { AuthUser, getAuthUser } from "@/lib/auth";

type StoreEditPageProps = {
  params: { id: string };
};

const CATEGORIES: StoreCategory[] = ["카페", "음식", "미용", "헬스", "기타"];

export default function StoreEditPage() {
  const router = useRouter();
  const [currentStore, setCurrentStore] = useState<Store | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<StoreCategory>("카페");
  const [openedAt, setOpenedAt] = useState("");
  const [address, setAddress] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [eventEndsAt, setEventEndsAt] = useState("");
  const [ownerDescription, setOwnerDescription] = useState(""); // 점주용 안내 상태 추가
  const [ownerUploadContent, setOwnerUploadContent] = useState(""); // 점주님 업로드 존 상태 추가
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [pageStoreId, setPageStoreId] = useState<string | null>(null); // null로 초기화

  useEffect(() => {
    // router.query에서 id를 가져와서 사용
    if (!router.isReady) return; // router가 준비되지 않았으면 리턴

    const id = router.query.id;
    if (typeof id !== 'string') {
      setLoading(false);
      setError("유효하지 않은 매장 ID입니다.");
      return;
    }
    setPageStoreId(id); // pageStoreId를 여기서 설정
    const authUser = getAuthUser();
    // 점주 역할이고 해당 storeId를 가지고 있지 않거나, 관리자가 아니면 로그인 페이지로 리디렉션
    if (!authUser || (authUser.role === "user" || (authUser.role === "store" && authUser.storeId !== id)) && authUser.role !== "admin") {
      router.push("/login");
      return;
    }

    const allStores = loadStores(SAMPLE_STORES);
    const store = allStores.find((s) => s.id === id); // id 사용

    if (store) {
      setCurrentStore(store);
      setName(store.name);
      setCategory(store.category);
      setOpenedAt(store.openedAt);
      setAddress(store.address);
      setShortDesc(store.shortDesc);
      setEventTitle(store.event?.title || "");
      setEventEndsAt(store.event?.endsAt || "");
      setOwnerDescription(store.ownerDescription || ""); // 기존 값 불러오기
      setOwnerUploadContent(store.ownerUploadContent || ""); // 기존 값 불러오기
    } else {
      setError("매장을 찾을 수 없습니다.");
    }
    setLoading(false);
  }, [router.isReady, router.query.id, router]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!currentStore) return;

    const updatedStore: Store = {
      ...currentStore,
      name,
      category,
      openedAt,
      address,
      shortDesc,
      ownerDescription,
      ownerUploadContent,
      event: eventTitle && eventEndsAt ? { title: eventTitle, endsAt: eventEndsAt } : undefined,
    };

    const allStores = loadStores(SAMPLE_STORES);
    updateStore(allStores, updatedStore);

    router.push("/"); // 수정 후 홈으로 이동 (필요에 따라 변경 가능)
  }

  if (loading) {
    return null; // 로딩 중에는 아무것도 렌더링하지 않음
  }

  if (error) {
    return (
      <div className="grid">
        <section className="card" style={{ maxWidth: 520 }}>
          <p className="muted" style={{ color: "#ffb3b3" }}>
            {error}
          </p>
        </section>
      </div>
    );
  }

  if (!currentStore) {
    return null; // 에러가 없고 매장도 없으면 아무것도 렌더링하지 않음 (로딩 후)
  }

  return (
    <div className="grid">
      <section className="card" style={{ maxWidth: 700 }}>
        <h2>매장 정보 수정: {currentStore.name} ({currentStore.id})</h2>
        <form onSubmit={onSubmit} className="controls" style={{ flexDirection: "column", gap: 12 }}>
          <label>
            매장명:
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label>
            카테고리:
            <select className="select" value={category} onChange={(e) => setCategory(e.target.value as StoreCategory)}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label>
            오픈일 (YYYY-MM-DD):
            <input className="input" type="date" value={openedAt} onChange={(e) => setOpenedAt(e.target.value)} required />
          </label>
          <label>
            주소:
            <input className="input" value={address} onChange={(e) => setAddress(e.target.value)} required />
          </label>
          <label>
            간략 설명:
            <textarea className="input" value={shortDesc} onChange={(e) => setShortDesc(e.target.value)} required rows={3} />
          </label>
          <label>
            점주용 안내:
            <textarea className="input" value={ownerDescription} onChange={(e) => setOwnerDescription(e.target.value)} rows={3} placeholder="매장 점주가 보여줄 안내 메시지" />
          </label>
          <label>
            점주님 업로드 존 (컨셉):
            <textarea className="input" value={ownerUploadContent} onChange={(e) => setOwnerUploadContent(e.target.value)} rows={5} placeholder="점주님이 자유롭게 업로드할 컨텐츠" />
          </label>
          <label>
            이벤트 제목:
            <input className="input" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} placeholder="이벤트가 없으면 비워두세요" />
          </label>
          <label>
            이벤트 종료일 (YYYY-MM-DD):
            <input className="input" type="date" value={eventEndsAt} onChange={(e) => setEventEndsAt(e.target.value)} disabled={!eventTitle} />
          </label>
          {error && <div className="muted" style={{ color: "#ffb3b3" }}>{error}</div>}
          <button className="button" type="submit">
            정보 수정
          </button>
          <button className="button outline" type="button" onClick={() => router.push("/")}>
            취소
          </button>
        </form>
      </section>
    </div>
  );
}
