"use client";

import { AuthUser, getAllUsers, getAuthUser, isAdmin, saveAllUsers } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type UserDetailPageProps = {
  params: { username: string };
};

export default function UserDetailPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState<"admin" | "user">("user");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [pageUsername, setPageUsername] = useState<string | null>(null);

  useEffect(() => {
    if (!router.isReady) return;

    const username = router.query.username;
    if (typeof username !== 'string') {
      setLoading(false);
      setError("유효하지 않은 사용자 ID입니다.");
      return;
    }
    setPageUsername(username);
    const authUser = getAuthUser();
    if (!isAdmin(authUser)) {
      router.push("/login"); // 관리자가 아니면 로그인 페이지로 리디렉션
      return;
    }

    const users = getAllUsers();
    const user = users.find((u) => u.username === username);

    if (user) {
      setCurrentUser(user);
      setName(user.name);
      setRole(user.role);
    } else {
      setError("사용자를 찾을 수 없습니다.");
    }
    setLoading(false);
  }, [router.isReady, router.query.username, router]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!currentUser) return;

    const updatedUser: AuthUser = { ...currentUser, name, role };
    const users = getAllUsers();
    const updatedUsers = users.map((u) => (u.username === updatedUser.username ? updatedUser : u));
    saveAllUsers(updatedUsers);

    // 현재 로그인된 사용자가 수정된 경우, 세션 정보도 업데이트
    const authUser = getAuthUser();
    if (authUser && authUser.username === updatedUser.username) {
      saveAuthUser(updatedUser);
    }

    router.push("/admin/users"); // 목록 페이지로 돌아가기
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

  if (!currentUser) {
    return null; // 에러가 없고 사용자도 없으면 아무것도 렌더링하지 않음 (로딩 후)
  }

  return (
    <div className="grid">
      <section className="card" style={{ maxWidth: 520 }}>
        <h2>회원 정보 수정: {currentUser.username}</h2>
        <form onSubmit={onSubmit} className="controls" style={{ flexDirection: "column", gap: 12 }}>
          <label>
            이름:
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label>
            역할:
            <select className="input" value={role} onChange={(e) => setRole(e.target.value as "admin" | "user")}>
              <option value="user">일반 사용자</option>
              <option value="admin">관리자</option>
            </select>
          </label>
          {error && <div className="muted" style={{ color: "#ffb3b3" }}>{error}</div>}
          <button className="button" type="submit">
            정보 수정
          </button>
          <button className="button outline" type="button" onClick={() => router.push("/admin/users")}>
            취소
          </button>
        </form>
      </section>
    </div>
  );
}
