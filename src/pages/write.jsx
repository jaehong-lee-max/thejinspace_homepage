import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Footer from "../component/footer";
import api from "../api/api";

function Write() {
  const navigate = useNavigate();

  const [isChecking, setIsChecking] = useState(true);
  const [title, setTitle] = useState("");
  const [contents, setContents] = useState("");
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const accessToken = sessionStorage.getItem("accessToken");
      const refreshToken = sessionStorage.getItem("refreshToken");

      if (!accessToken || !refreshToken) {
        alert("로그인을 해주세요");
        navigate("/login");
        return;
      }

      try {
        const verifyRes = await api.post("/api/users/token/verify", {
          accessToken,
          refreshToken,
        });

        const { ok, accessTokenValid, refreshTokenValid, needReissue } =
          verifyRes.data;

        if (ok && accessTokenValid) {
          setIsChecking(false);
          return;
        }

        if (needReissue && refreshTokenValid) {
          const reissueRes = await api.post("/api/users/token/reissue", {
            refreshToken,
          });

          sessionStorage.setItem("accessToken", reissueRes.data.accessToken);
          setIsChecking(false);
          return;
        }

        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("refreshToken");

        alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
        navigate("/login");
      } catch (error) {
        console.error(error);

        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("refreshToken");

        alert("로그인 확인 중 오류가 발생했습니다.");
        navigate("/login");
      }
    };

    checkToken();
  }, [navigate]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (!contents.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("contents", contents);

      if (image) {
        formData.append("image", image);
      }

      const res = await api.post("/api/news/write", formData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.ok) {
        alert("뉴스가 등록되었습니다.");
        navigate("/");
      } else {
        alert(res.data.message || "등록에 실패했습니다.");
      }
    } catch (error) {
      console.error(error);
      alert("뉴스 등록 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isChecking) {
    return null;
  }

  return (
    <>
      <div className="login_wrap">
        <h3>뉴스 작성</h3>

        <table>
          <tbody>
            <tr>
              <th>제목</th>
              <td>
                <input
                  type="text"
                  placeholder="제목"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </td>
            </tr>

            <tr>
              <th>이미지</th>
              <td>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </td>
            </tr>

            <tr>
              <th>내용</th>
              <td>
                <textarea
                  placeholder="내용을 입력하세요"
                  value={contents}
                  onChange={(e) => setContents(e.target.value)}
                />
              </td>
            </tr>
          </tbody>
        </table>

        <div className="news_write_button_wrap">
          <button
            className="news_write_button"
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "작성 중..." : "작성하기"}
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Write;
