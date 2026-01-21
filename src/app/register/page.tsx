"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthUser, saveAuthUser } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    birth: "",
    phone: "",
    username: "",
    password: "",
    passwordConfirm: "",
  });
  const [error, setError] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password !== form.passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!form.name || !form.birth || !form.phone || !form.username || !form.password) {
      setError("모든 필수를 입력해주세요.");
      return;
    }

    const user: AuthUser = { username: form.username, name: form.name, role: "user" };
    saveAuthUser(user); // 컨셉: 회원가입 후 자동 로그인
    router.push("/");
  }

  return (
    <div className="grid">
      <section className="card" style={{ maxWidth: 520 }}>
        <h2>회원가입</h2>
        <form onSubmit={onSubmit} className="controls" style={{ flexDirection: "column", gap: 10 }}>
          <input
            className="input"
            placeholder="이름"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <input
            className="input"
            placeholder="생년월일 (YYYY-MM-DD)"
            value={form.birth}
            onChange={(e) => setForm((f) => ({ ...f, birth: e.target.value }))}
          />
          <input
            className="input"
            placeholder="연락처"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          />
          <input
            className="input"
            placeholder="아이디"
            value={form.username}
            onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
          />
          <input
            className="input"
            type="password"
            placeholder="비밀번호"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          />
          <input
            className="input"
            type="password"
            placeholder="비밀번호 확인"
            value={form.passwordConfirm}
            onChange={(e) => setForm((f) => ({ ...f, passwordConfirm: e.target.value }))}
          />
          {error && <div className="muted" style={{ color: "#ffb3b3" }}>{error}</div>}
          <button className="button" type="submit">
            가입하기
          </button>
        </form>

        <div className="row" style={{ marginTop: 12, justifyContent: "space-between" }}>
          <span className="muted">이미 계정이 있나요?</span>
          <button className="button" onClick={() => router.push("/login")}>
            로그인
          </button>
        </div>
      </section>
    </div>
  );
}

