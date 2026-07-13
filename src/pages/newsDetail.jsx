import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import Footer from "../component/footer";
import api from "../api/api";

function NewsDetail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const id = searchParams.get("id");

  const [news, setNews] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  const [title, setTitle] = useState("");
  const [contents, setContents] = useState("");

  const [image, setImage] = useState(null);
  const [previewImageUrl, setPreviewImageUrl] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /**
   * 관리자 로그인 여부 확인
   *
   * 비로그인 사용자도 뉴스 상세는 볼 수 있으므로
   * 토큰이 없거나 만료된 경우 로그인 페이지로 이동시키지 않는다.
   */
  useEffect(() => {
    const checkToken = async () => {
      const accessToken = sessionStorage.getItem("accessToken");
      const refreshToken = sessionStorage.getItem("refreshToken");

      if (!accessToken || !refreshToken) {
        setIsAdmin(false);
        setIsAuthChecking(false);
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
          setIsAdmin(true);
          return;
        }

        if (needReissue && refreshTokenValid) {
          const reissueRes = await api.post("/api/users/token/reissue", {
            refreshToken,
          });

          if (!reissueRes.data?.accessToken) {
            throw new Error("Access Token 재발급 실패");
          }

          sessionStorage.setItem("accessToken", reissueRes.data.accessToken);

          setIsAdmin(true);
          return;
        }

        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("refreshToken");

        setIsAdmin(false);
      } catch (error) {
        console.error("뉴스 상세 로그인 확인 오류:", error);

        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("refreshToken");

        setIsAdmin(false);
      } finally {
        setIsAuthChecking(false);
      }
    };

    checkToken();
  }, []);

  /**
   * 뉴스 상세 조회
   */
  useEffect(() => {
    const getNewsDetail = async () => {
      if (!id) {
        alert("잘못된 접근입니다.");
        navigate("/news");
        return;
      }

      try {
        setIsLoading(true);

        const res = await api.get("/api/news/detail", {
          params: {
            id,
          },
        });

        if (!res.data?.ok || !res.data?.data) {
          alert(res.data?.message || "게시물을 찾을 수 없습니다.");

          navigate("/news");
          return;
        }

        const newsData = res.data.data;

        setNews(newsData);
        setTitle(newsData.title || "");
        setContents(newsData.contents || "");
      } catch (error) {
        console.error("뉴스 상세 조회 오류:", error);

        alert(
          error.response?.data?.message ||
            "뉴스 상세 정보를 불러오지 못했습니다.",
        );

        navigate("/news");
      } finally {
        setIsLoading(false);
      }
    };

    getNewsDetail();
  }, [id, navigate]);

  /**
   * 이미지 파일 미리보기 URL 정리
   */
  useEffect(() => {
    return () => {
      if (previewImageUrl) {
        URL.revokeObjectURL(previewImageUrl);
      }
    };
  }, [previewImageUrl]);

  const getImageUrl = (imgUrl) => {
    if (!imgUrl) {
      return null;
    }

    if (imgUrl.startsWith("http")) {
      return imgUrl;
    }

    return `${api.defaults.baseURL}${imgUrl}`;
  };

  const handleImageChange = (event) => {
    const selectedFile = event.target.files?.[0] || null;

    if (!selectedFile) {
      setImage(null);

      if (previewImageUrl) {
        URL.revokeObjectURL(previewImageUrl);
      }

      setPreviewImageUrl("");
      return;
    }

    if (!selectedFile.type.startsWith("image/")) {
      alert("이미지 파일만 선택할 수 있습니다.");
      event.target.value = "";
      return;
    }

    if (previewImageUrl) {
      URL.revokeObjectURL(previewImageUrl);
    }

    const objectUrl = URL.createObjectURL(selectedFile);

    setImage(selectedFile);
    setPreviewImageUrl(objectUrl);
  };

  const handleUpdate = async () => {
    if (!isAdmin) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (!contents.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    const isConfirmed = window.confirm("뉴스 내용을 수정하시겠습니까?");

    if (!isConfirmed) {
      return;
    }

    try {
      setIsSubmitting(true);

      const accessToken = sessionStorage.getItem("accessToken");

      if (!accessToken) {
        setIsAdmin(false);
        alert("로그인이 만료되었습니다.");
        return;
      }

      const formData = new FormData();

      formData.append("title", title.trim());
      formData.append("contents", contents.trim());

      if (image) {
        formData.append("image", image);
      }

      const res = await api.put(`/api/news/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (!res.data?.ok) {
        alert(res.data?.message || "뉴스 수정에 실패했습니다.");

        return;
      }

      const updatedNews = res.data.data;

      setNews(updatedNews);
      setTitle(updatedNews.title || "");
      setContents(updatedNews.contents || "");
      setImage(null);

      if (previewImageUrl) {
        URL.revokeObjectURL(previewImageUrl);
        setPreviewImageUrl("");
      }

      alert(res.data.message || "뉴스가 수정되었습니다.");
    } catch (error) {
      console.error("뉴스 수정 오류:", error);

      if (error.response?.status === 401 || error.response?.status === 403) {
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("refreshToken");

        setIsAdmin(false);

        alert("로그인이 만료되었습니다. 다시 로그인해주세요.");

        return;
      }

      alert(
        error.response?.data?.message || "뉴스 수정 중 오류가 발생했습니다.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || isAuthChecking) {
    return null;
  }

  if (!news) {
    return null;
  }

  const savedImageUrl = getImageUrl(news.img_url);
  const displayedImageUrl = previewImageUrl || savedImageUrl;

  return (
    <>
      <main>
        <div className="news_wrap">
          <h4>- NEWS -</h4>

          <div className="news_wrap_detail_inner">
            <table>
              <tbody>
                <tr>
                  <td>
                    {isAdmin ? (
                      <input
                        type="text"
                        value={title}
                        placeholder="뉴스 제목"
                        onChange={(event) => setTitle(event.target.value)}
                        style={{
                          width: "100%",
                          boxSizing: "border-box",
                        }}
                      />
                    ) : (
                      <h3>{news.title}</h3>
                    )}
                  </td>
                </tr>

                <tr>
                  <td>{news.created_at}</td>
                </tr>

                <tr>
                  <td>
                    {displayedImageUrl && (
                      <img
                        src={displayedImageUrl}
                        alt={news.title || "뉴스 이미지"}
                        style={{
                          width: "100%",
                          height: "auto",
                          marginBottom: isAdmin ? "20px" : "70px",
                        }}
                      />
                    )}

                    {isAdmin && (
                      <div
                        style={{
                          marginBottom: "30px",
                        }}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                        />

                        <div
                          style={{
                            marginTop: "8px",
                            fontSize: "13px",
                          }}
                        >
                          새 이미지를 선택하지 않으면 기존 이미지가 유지됩니다.
                        </div>
                      </div>
                    )}

                    {isAdmin ? (
                      <textarea
                        value={contents}
                        placeholder="뉴스 내용을 입력해주세요."
                        onChange={(event) => setContents(event.target.value)}
                        style={{
                          width: "100%",
                          minHeight: "400px",
                          boxSizing: "border-box",
                          whiteSpace: "pre-wrap",
                          resize: "vertical",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          whiteSpace: "pre-line",
                        }}
                      >
                        {news.contents}
                      </div>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="news_wrap_detail_inner_btn_area">
              <Link to="/news">목록</Link>

              {isAdmin && (
                <button
                  type="button"
                  onClick={handleUpdate}
                  disabled={isSubmitting}
                  style={{
                    marginLeft: "10px",
                  }}
                >
                  {isSubmitting ? "수정 중..." : "수정"}
                </button>
              )}
            </div>
          </div>
        </div>

        <Footer />
      </main>
    </>
  );
}

export default NewsDetail;
