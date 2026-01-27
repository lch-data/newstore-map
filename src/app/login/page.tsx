"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthUser, getAuthUser, saveAuthUser, isAdmin } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const u = getAuthUser();
    if (u) {
      router.push("/");
    }
  }, [router]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }

    let user: AuthUser | null = null;
    if (username === "admin" && password === "admin") {
      user = { username, name: "관리자", role: "admin" };
    } else if (username === "user" && password === "user") { // 임시 일반 사용자 계정
      user = { username, name: username, role: "user" };
    } else if (username === "store" && password === "store") { // 임시 점주 계정
      user = { username, name: "점주(테스트)", role: "store", storeId: "test-store-id" };
    }

    if (user) {
      saveAuthUser(user);
      if (isAdmin(user)) {
        router.push("/admin");
      } else if (user.role === "store" && user.storeId) {
        router.push(`/stores/${user.storeId}/edit`);
      } else {
        router.push("/");
      }
    } else {
      setError("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  }

  return (
    <div className="grid">
      <section className="card" style={{ maxWidth: 520 }}>
        <h2>로그인</h2>
        <form onSubmit={onSubmit} className="controls" style={{ flexDirection: "column", gap: 12 }}>
          <input
            className="input"
            placeholder="아이디"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="input"
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <div className="muted" style={{ color: "#ffb3b3" }}>{error}</div>}
          <button className="button" type="submit">
            로그인
          </button>
        </form>

        <div className="row" style={{ marginTop: 12, justifyContent: "space-between" }}>
          <span className="muted">아이디가 없으신가요?</span>
          <button className="button" onClick={() => router.push("/register")}>
            회원가입
          </button>
        </div>
      </section>
    </div>
  );
}

