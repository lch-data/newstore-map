"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

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

export default function SidebarShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  useEffect(() => {
    // 라우트 이동 시 모바일 사이드바 닫기
    setSidebarOpen(false);
  }, [pathname]);

  const menu = useMemo(() => {
    return [
      { href: "/", label: "홈" },
      { href: "/map", label: "지도 보기" },
      { href: "/bookmarks", label: "내 즐겨찾기 리스트" },
      { href: "/admin", label: "admin" },
    ];
  }, []);

  function onLogin() {
    // 컨셉용 임시 로그인
    const next = { name: "게스트" };
    setStoredUser(next);
    setUser(next);
  }

  function onLogout() {
    setStoredUser(null);
    setUser(null);
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
            <button className="button full" onClick={onLogin}>
              로그인
            </button>
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

