"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AuthUser, clearAuthUser, getAuthUser, isAdmin } from "@/lib/auth";

export default function SidebarShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(getAuthUser());
  }, []);

  useEffect(() => {
    // 라우트 이동 시 모바일 사이드바 닫기
    setSidebarOpen(false);
  }, [pathname]);

  const menu = useMemo(() => {
    const base = [
      { href: "/", label: "홈" },
      { href: "/map", label: "지도 보기" },
      { href: "/bookmarks", label: "내 즐겨찾기 리스트" },
    ];
    if (isAdmin(user)) {
      base.push({ href: "/admin", label: "관리자" });
    }
    return base;
  }, [user]);

  function onLogout() {
    clearAuthUser();
    setUser(null);
    router.push("/");
  }

  return (
    <div className="appShell">
      <aside className={`sidebar ${sidebarOpen ? "isOpen" : ""}`}>
        <div className="sidebarHeader">
          <div className="row" style={{ justifyContent: "space-between" }}>
            <div className="brand">
            <div className="brandMark">신규</div>
            <div className="brandText">
              <div className="brandTitle">신규매장 지도</div>
              <div className="brandSub">최근 90일 신규 오픈</div>
            </div>
            </div>

            <button
              className="iconButton"
              onClick={() => setSidebarOpen(false)}
              aria-label="사이드바 닫기"
              title="닫기"
            >
              ←
            </button>
          </div>
        </div>

        <div className="sidebarSection">
          <div className="sidebarSectionTitle">메뉴</div>
          <nav className="sidebarNav">
            {menu.map((m) => {
              const active = m.href === "/" ? pathname === "/" : pathname.startsWith(m.href);
              return (
                <Link key={m.href} href={m.href} className={`navItem ${active ? "active" : ""}`}>
                  {m.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="sidebarSection">
          <div className="sidebarSectionTitle">계정</div>

          {!user ? (
            <div className="accountBox">
              <Link className="button full" href="/login">
                로그인
              </Link>
              <Link className="button full" href="/register">
                회원가입
              </Link>
            </div>
          ) : (
            <div className="accountBox">
              <div className="accountLine">
                <span className="muted">로그인됨</span>
                <b>{user.name}</b>
              </div>
              <div className="row" style={{ gap: 8 }}>
                <Link className="button" href="/me">
                  내정보수정
                </Link>
                <button className="button" onClick={onLogout}>
                  로그아웃
                </button>
              </div>
              <Link className="button full" href="/bookmarks">
                내 즐겨찾기 리스트
              </Link>
              {!isAdmin(user) && (
                <div className="muted" style={{ fontSize: 12 }}>
                  관리자 기능은 admin 계정으로 로그인 시 노출돼요.
                </div>
              )}
            </div>
          )}
        </div>

        <div className="sidebarFooter muted">
          MVP · (지도 API는 추후 네이버/카카오로 교체 가능)
        </div>
      </aside>

      {sidebarOpen && <div className="backdrop" onClick={() => setSidebarOpen(false)} />}

      <div className="contentArea">
        <header className="topbar">
          <button className="iconButton" onClick={() => setSidebarOpen((v) => !v)} aria-label="메뉴 열기">
            ☰
          </button>
          <div className="topbarTitle">{pathname === "/" ? "홈" : ""}</div>
          <div className="topbarRight">
            <Link className="chip" href="/map">
              지도보기
            </Link>
          </div>
        </header>

        <main className="main">{children}</main>
      </div>
    </div>
  );
}

