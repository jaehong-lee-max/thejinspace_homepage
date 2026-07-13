import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import Footer from "../component/footer";
import api from "../api/api";

function Login() {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        document.querySelector("#button_for_login").click();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const login = () => {
    let data = {
      admin_id: id,
      password: password,
    };
    api
      .post("/api/users/login", data)
      .then((response) => {
        const { accessToken, refreshToken, user } = response.data;

        sessionStorage.setItem("accessToken", accessToken);
        sessionStorage.setItem("refreshToken", refreshToken);
        sessionStorage.setItem("adminName", user.adming_name);
        console.log(user);
        navigate("/write_news");
      })
      .catch((err) => {
        alert("로그인 실패: " + err.response?.data?.message || "서버 오류");
      });
  };

  return (
    <>
      <div className="login_wrap">
        <h3>관리자 로그인</h3>
        <div className="login_pannel">
          <input
            type="text"
            value={id}
            autoComplete="new-password"
            onChange={(e) => {
              setId(e.target.value);
            }}
            placeholder="ID"
          />
          <input
            type="password"
            value={password}
            autoComplete="new-password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="Password"
          />
          <button id="button_for_login" onClick={login}>
            로그인
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Login;
