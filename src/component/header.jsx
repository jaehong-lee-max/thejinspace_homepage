import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import api from "../api/api";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileMenu, setIsMobileMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLogoutProcessing, setIsLogoutProcessing] = useState(false);

  useEffect(() => {
    const header = document.querySelector("header");

    if (!header) {
      return;
    }

    if (location.pathname === "/") {
      header.classList.remove("norm");
    } else {
      header.classList.add("norm");
    }
  }, [location.pathname]);

  useEffect(() => {
    const checkLoginState = () => {
      const accessToken = sessionStorage.getItem("accessToken");
      const refreshToken = sessionStorage.getItem("refreshToken");

      setIsLoggedIn(Boolean(accessToken && refreshToken));
    };

    checkLoginState();

    window.addEventListener("storage", checkLoginState);

    return () => {
      window.removeEventListener("storage", checkLoginState);
    };
  }, [location.pathname]);

  const handleLogout = async () => {
    const accessToken = sessionStorage.getItem("accessToken");

    if (!accessToken) {
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("refreshToken");

      setIsLoggedIn(false);
      setIsMobileMenu(false);

      navigate("/");
      return;
    }

    const isConfirmed = window.confirm("로그아웃하시겠습니까?");

    if (!isConfirmed) {
      return;
    }

    try {
      setIsLogoutProcessing(true);

      const res = await api.post(
        "/api/users/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!res.data?.success) {
        alert(res.data?.message || "로그아웃 처리에 실패했습니다.");
        return;
      }

      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("refreshToken");

      setIsLoggedIn(false);
      setIsMobileMenu(false);

      alert("로그아웃되었습니다.");

      navigate("/");
    } catch (error) {
      console.error("logout error:", error);

      /*
       * 서버 로그아웃 API가 단순 응답 방식이므로,
       * 토큰이 이미 만료되어 401이 발생한 경우에도
       * 클라이언트 토큰은 삭제해서 로그아웃 상태로 만든다.
       */
      if (error.response?.status === 401 || error.response?.status === 403) {
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("refreshToken");

        setIsLoggedIn(false);
        setIsMobileMenu(false);

        alert("로그인이 만료되어 로그아웃되었습니다.");

        navigate("/");
        return;
      }

      alert(
        error.response?.data?.message ||
          "로그아웃 처리 중 오류가 발생했습니다.",
      );
    } finally {
      setIsLogoutProcessing(false);
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenu(false);
  };

  return (
    <>
      <header>
        <div className="header_inner">
          <Link to="/" className="logo" onClick={closeMobileMenu} />

          <ul>
            <li className={location.pathname === "/about" ? "active" : ""}>
              <Link to="/about">ABOUT</Link>
            </li>

            <li className={location.pathname === "/platform" ? "active" : ""}>
              <Link to="/platform">PLATFORM</Link>
            </li>

            <li className={location.pathname === "/road_map" ? "active" : ""}>
              <Link to="/road_map">ROADMAP</Link>
            </li>
            <li
              className={location.pathname === "/web_platform" ? "active" : ""}
            >
              <Link to="/web_platform">WEB SERVICE</Link>
            </li>

            <li className={location.pathname === "/news" ? "active" : ""}>
              <Link to="/news">NEWS</Link>
            </li>

            <li className={location.pathname === "/contact" ? "active" : ""}>
              <Link to="/contact">CONTACT</Link>
            </li>

            {isLoggedIn && (
              <li>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLogoutProcessing}
                  style={{
                    border: 0,
                    background: "none",
                    cursor: isLogoutProcessing ? "default" : "pointer",
                  }}
                >
                  {isLogoutProcessing ? "LOGOUT..." : "LOGOUT"}
                </button>
              </li>
            )}
          </ul>

          <div
            className="mobile_menu"
            onClick={() => {
              setIsMobileMenu(true);
            }}
          >
            <span />
            <span />
            <span />
          </div>

          <div
            className={
              isMobileMenu ? "mobile_menu_wrap active" : "mobile_menu_wrap"
            }
          >
            <div
              className="x"
              onClick={() => {
                setIsMobileMenu(false);
              }}
            />

            <li className={location.pathname === "/about" ? "active" : ""}>
              <Link to="/about" onClick={closeMobileMenu}>
                ABOUT
              </Link>
            </li>

            <li className={location.pathname === "/platform" ? "active" : ""}>
              <Link to="/platform" onClick={closeMobileMenu}>
                PLATFORM
              </Link>
            </li>

            <li className={location.pathname === "/road_map" ? "active" : ""}>
              <Link to="/road_map" onClick={closeMobileMenu}>
                ROADMAP
              </Link>
            </li>
            <li
              className={location.pathname === "/web_platform" ? "active" : ""}
            >
              <Link to="/web_platform">WEB SERVICE</Link>
            </li>
            <li className={location.pathname === "/news" ? "active" : ""}>
              <Link to="/news" onClick={closeMobileMenu}>
                NEWS
              </Link>
            </li>

            <li className={location.pathname === "/contact" ? "active" : ""}>
              <Link to="/contact" onClick={closeMobileMenu}>
                CONTACT
              </Link>
            </li>

            {isLoggedIn && (
              <li>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLogoutProcessing}
                  style={{
                    border: 0,
                    background: "none",
                    cursor: isLogoutProcessing ? "default" : "pointer",
                  }}
                >
                  {isLogoutProcessing ? "LOGOUT..." : "LOGOUT"}
                </button>
              </li>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
