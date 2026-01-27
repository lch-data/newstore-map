"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Store, SAMPLE_STORES } from "@/lib/stores";
import { loadStores } from "@/lib/db";

export default function StoreDetailPage() {
  const router = useRouter();
  const [currentStore, setCurrentStore] = useState<Store | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [pageStoreId, setPageStoreId] = useState<string | null>(null);

  useEffect(() => {
    if (!router.isReady) return;

    const id = router.query.id;
    if (typeof id !== 'string') {
      setLoading(false);
      setError("유효하지 않은 매장 ID입니다.");
      return;
    }
    setPageStoreId(id);

    const allStores = loadStores(SAMPLE_STORES);
    const store = allStores.find((s) => s.id === id);

    if (store) {
      setCurrentStore(store);
    } else {
      setError("매장을 찾을 수 없습니다.");
    }
    setLoading(false);
  }, [router.isReady, router.query.id, router]);

  if (loading) {
    return null;
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
    return null;
  }

  return (
    <div className="grid">
      <section className="card" style={{ maxWidth: 700 }}>
        <h2>{currentStore.name}</h2>
        <p><b>카테고리:</b> {currentStore.category}</p>
        <p><b>오픈일:</b> {currentStore.openedAt}</p>
        <p><b>주소:</b> {currentStore.address}</p>
        <p><b>간략 설명:</b> {currentStore.shortDesc}</p>

        {currentStore.event && (
          <div style={{ marginTop: 20 }}>
            <h3>이벤트</h3>
            <p><b>제목:</b> {currentStore.event.title}</p>
            <p><b>종료일:</b> {currentStore.event.endsAt}</p>
          </div>
        )}

        {currentStore.ownerDescription && (
          <div style={{ marginTop: 20 }}>
            <h3>점주용 안내</h3>
            <p>{currentStore.ownerDescription}</p>
          </div>
        )}

        {currentStore.ownerUploadContent && (
          <div style={{ marginTop: 20 }}>
            <h3>점주님 업로드 존 (컨셉)</h3>
            <p style={{ whiteSpace: "pre-wrap" }}>{currentStore.ownerUploadContent}</p>
          </div>
        )}

        <div style={{ marginTop: 20 }}>
          <button className="button outline" onClick={() => router.push("/")}>
            목록으로 돌아가기
          </button>
        </div>
      </section>
    </div>
  );
}
