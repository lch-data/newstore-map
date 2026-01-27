"use client";

import { AuthUser, getAllUsers, getAuthUser, isAdmin } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

type UserViewPageProps = {
  params: { username: string };
};

export default function UserViewPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [pageUsername, setPageUsername] = useState<string | null>(null);

  useEffect(() => {
    // router.query에서 username을 가져와서 사용
    if (!router.isReady) return; // router가 준비되지 않았으면 리턴

    const username = router.query.username; // string | string[] | undefined
    if (typeof username !== 'string') { // username이 유효한 문자열이 아니면 오류 처리
      setLoading(false);
      setError("유효하지 않은 사용자 ID입니다.");
      return;
    }
    setPageUsername(username);
    const authUser = getAuthUser();

    // 디버깅을 위해 추가: getAllUsers() 결과 확인
    const users = getAllUsers();
    console.log("All users from localStorage:", users);

    if (!isAdmin(authUser)) {
      router.push("/login"); // 관리자가 아니면 로그인 페이지로 리디렉션
      return;
    }
    const user = users.find((u) => u.username === username);

    if (user) {
      setCurrentUser(user);
    } else {
      setError("사용자를 찾을 수 없습니다.");
    }
    setLoading(false);
  }, [router.isReady, router.query, router]);

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
        <h2>회원 정보: {currentUser.username}</h2>
        <div className="controls" style={{ flexDirection: "column", gap: 12 }}>
          <p>
            <b>아이디:</b> {currentUser.username}
          </p>
          <p>
            <b>이름:</b> {currentUser.name}
          </p>
          <p>
            <b>역할:</b> {currentUser.role === "admin" ? "관리자" : "일반 사용자"}
          </p>
          <Link href={`/admin/users/${currentUser.username}/edit`} className="button">
            수정
          </Link>
          <button className="button outline" onClick={() => router.push("/admin/users")}>
            목록으로 돌아가기
          </button>
        </div>
      </section>
    </div>
  );
}
