"use client";

import { useEffect, useState } from "react";
import { AuthUser, getAllUsers, isAdmin, getAuthUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authUser = getAuthUser();
    if (!isAdmin(authUser)) {
      router.push("/login"); // 관리자가 아니면 로그인 페이지로 리디렉션
      return;
    }
    setUsers(getAllUsers());
    setLoading(false);
  }, [router]);

  if (loading) {
    return null; // 로딩 중에는 아무것도 렌더링하지 않음
  }

  return (
    <div className="grid">
      <section className="card" style={{ maxWidth: 700 }}>
        <h2>회원 목록</h2>
        {users.length === 0 ? (
          <p>등록된 회원이 없습니다.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>아이디</th>
                <th>이름</th>
                <th>역할</th>
                <th>액션</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.username}>
                  <td>{user.username}</td>
                  <td>{user.name}</td>
                  <td>{user.role === "admin" ? "관리자" : "일반 사용자"}</td>
                  <td>
                    <Link href={`/admin/users/${user.username}/view`} className="button small">
                      정보
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
