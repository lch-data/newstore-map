"use client";

import { useEffect, useState } from "react";

type User = { name: string };

function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem("mvp:user");
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

function setStoredUser(user: User | null) {
  if (typeof window === "undefined") return;
  if (!user) window.localStorage.removeItem("mvp:user");
  else window.localStorage.setItem("mvp:user", JSON.stringify(user));
}

export default function MePage() {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");

  useEffect(() => {
    const u = getStoredUser();
    setUser(u);
    setName(u?.name ?? "");
  }, []);

  function onSave() {
    if (name.trim().length < 2) {
      alert("이름은 2글자 이상으로 입력해주세요.");
      return;
    }
    const next = { name: name.trim() };
    setStoredUser(next);
    setUser(next);
    alert("저장완료 (컨셉용 로컬 저장)");
  }

  return (
    <div className="grid">
      <section className="card">
        <h2>내정보수정 (임시)</h2>
        {!user && (
          <div className="muted" style={{ lineHeight: 1.7 }}>
            아직 로그인 전이야. 왼쪽 사이드바에서 로그인 버튼을 눌러줘!
          </div>
        )}

        <div className="controls" style={{ marginTop: 12 }}>
          <input
            className="input"
            placeholder="표시 이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button className="button" onClick={onSave} disabled={!user}>
            저장
          </button>
        </div>
      </section>

      <aside className="card">
        <h2>다음 단계</h2>
        <div className="muted" style={{ lineHeight: 1.7 }}>
          - 실제 로그인/회원정보 API 연결
          <br />- 관심 업종/선호 지역 설정
          <br />- 추천 배너 개인화
        </div>
      </aside>
    </div>
  );
}

