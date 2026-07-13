import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import Footer from "../component/footer";
import api from "../api/api";

function News() {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = Number(searchParams.get("page")) || 1;

  const [newsList, setNewsList] = useState([]);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 1,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  const [selectedIds, setSelectedIds] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  /**
   * 로그인 여부 확인
   *
   * 뉴스 페이지는 비로그인 사용자도 볼 수 있기 때문에
   * 토큰이 없거나 만료된 경우 로그인 페이지로 보내지 않고
   * 관리자 기능만 숨긴다.
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
          setIsAuthChecking(false);
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
          setIsAuthChecking(false);
          return;
        }

        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("refreshToken");

        setIsAdmin(false);
      } catch (error) {
        console.error("뉴스 페이지 로그인 확인 오류:", error);

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
   * 뉴스 목록 조회
   */
  useEffect(() => {
    const getNewsList = async () => {
      try {
        setIsLoading(true);

        const res = await api.get("/api/news/list", {
          params: {
            page: currentPage,
            limit: 5,
          },
        });

        if (!res.data?.ok) {
          alert(res.data?.message || "뉴스 목록을 불러오지 못했습니다.");
          return;
        }

        setNewsList(res.data.list || []);

        setPagination(
          res.data.pagination || {
            page: currentPage,
            limit: 5,
            total: 0,
            totalPages: 1,
          },
        );

        // 페이지가 바뀌거나 목록이 새로 조회되면 선택 초기화
        setSelectedIds([]);
      } catch (error) {
        console.error("뉴스 목록 조회 오류:", error);

        alert(
          error.response?.data?.message || "뉴스 목록을 불러오지 못했습니다.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    getNewsList();
  }, [currentPage, refreshKey]);

  const changePage = (page) => {
    if (page < 1 || page > pagination.totalPages) {
      return;
    }

    setSelectedIds([]);
    setSearchParams({ page: String(page) });
  };

  const getImageUrl = (imgUrl) => {
    if (!imgUrl) {
      return null;
    }

    if (imgUrl.startsWith("http")) {
      return imgUrl;
    }

    return `${api.defaults.baseURL}${imgUrl}`;
  };

  const toggleNewsSelection = (id) => {
    const numberId = Number(id);

    setSelectedIds((prev) => {
      if (prev.includes(numberId)) {
        return prev.filter((selectedId) => selectedId !== numberId);
      }

      return [...prev, numberId];
    });
  };

  const toggleAllSelection = () => {
    const currentPageIds = newsList.map((item) => Number(item.id));

    const isAllSelected =
      currentPageIds.length > 0 &&
      currentPageIds.every((id) => selectedIds.includes(id));

    if (isAllSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !currentPageIds.includes(id)),
      );

      return;
    }

    setSelectedIds((prev) => [...new Set([...prev, ...currentPageIds])]);
  };

  const isAllSelected =
    newsList.length > 0 &&
    newsList.every((item) => selectedIds.includes(Number(item.id)));

  const deleteSelectedNews = async () => {
    if (selectedIds.length === 0) {
      alert("삭제할 뉴스를 선택해주세요.");
      return;
    }

    const isConfirmed = window.confirm(
      `선택한 뉴스 ${selectedIds.length}개를 삭제하시겠습니까?`,
    );

    if (!isConfirmed) {
      return;
    }

    try {
      setIsDeleting(true);

      const accessToken = sessionStorage.getItem("accessToken");

      if (!accessToken) {
        alert("로그인이 만료되었습니다.");
        setIsAdmin(false);
        return;
      }

      const res = await api.delete("/api/news", {
        data: {
          ids: selectedIds,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.data?.ok) {
        alert(res.data?.message || "뉴스 삭제에 실패했습니다.");
        return;
      }

      alert(res.data.message || "선택한 뉴스가 삭제되었습니다.");

      const deletedAllCurrentPage = selectedIds.length === newsList.length;

      setSelectedIds([]);

      /**
       * 현재 페이지의 게시물을 모두 삭제했고
       * 현재 페이지가 2페이지 이상이면 이전 페이지로 이동
       */
      if (deletedAllCurrentPage && currentPage > 1) {
        setSearchParams({
          page: String(currentPage - 1),
        });

        return;
      }

      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("뉴스 삭제 오류:", error);

      if (error.response?.status === 401) {
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("refreshToken");

        setIsAdmin(false);

        alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
        return;
      }

      alert(
        error.response?.data?.message || "뉴스 삭제 중 오류가 발생했습니다.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const renderPages = () => {
    const pages = [];
    const totalPages = pagination.totalPages;

    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let page = startPage; page <= endPage; page += 1) {
      pages.push(
        <button
          key={page}
          type="button"
          className={page === currentPage ? "active" : ""}
          onClick={() => changePage(page)}
        >
          {page}
        </button>,
      );
    }

    return pages;
  };

  return (
    <>
      <main>
        <div className="news_wrap">
          <h4>- NEWS -</h4>

          <div className="news_wrap_inner">
            {!isAuthChecking && isAdmin && (
              <div
                className="news_admin_control"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "20px",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleAllSelection}
                    disabled={newsList.length === 0}
                  />
                  현재 페이지 전체 선택
                </label>

                <div>
                  <span
                    style={{
                      marginRight: "12px",
                    }}
                  >
                    {selectedIds.length}개 선택
                  </span>

                  <button
                    type="button"
                    className="news_delete_button"
                    onClick={deleteSelectedNews}
                    disabled={selectedIds.length === 0 || isDeleting}
                  >
                    {isDeleting ? "삭제 중..." : "선택 삭제"}
                  </button>
                </div>
              </div>
            )}

            {isLoading ? (
              <div className="news_empty">불러오는 중...</div>
            ) : newsList.length === 0 ? (
              <div className="news_empty">등록된 뉴스가 없습니다.</div>
            ) : (
              <table>
                <tbody>
                  {newsList.map((item) => {
                    const imageUrl = getImageUrl(item.img_url);
                    const newsId = Number(item.id);
                    const isSelected = selectedIds.includes(newsId);

                    return (
                      <tr
                        key={item.id}
                        className={isSelected ? "news_selected" : ""}
                      >
                        {!isAuthChecking && isAdmin && (
                          <td
                            style={{
                              width: "50px",
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleNewsSelection(newsId)}
                              aria-label={`${item.title} 선택`}
                            />
                          </td>
                        )}

                        <td>
                          {imageUrl ? (
                            <div
                              className="img"
                              style={{
                                backgroundImage: `url(${imageUrl})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center center",
                              }}
                            />
                          ) : (
                            <div className="img no_img" />
                          )}
                        </td>

                        <td>
                          <b>{item.title}</b>

                          <div className="date">{item.created_at}</div>

                          <div className="txt">{item.contents}</div>

                          <Link to={`/news_detail?id=${item.id}`}>VIEW →</Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            {pagination.totalPages > 1 && (
              <div className="pagination">
                <button
                  type="button"
                  className="prev"
                  onClick={() => changePage(currentPage - 1)}
                  disabled={currentPage <= 1}
                >
                  &lt;
                </button>

                {renderPages()}

                <button
                  type="button"
                  className="next"
                  onClick={() => changePage(currentPage + 1)}
                  disabled={currentPage >= pagination.totalPages}
                >
                  &gt;
                </button>
              </div>
            )}
          </div>
        </div>

        <Footer />
      </main>
    </>
  );
}

export default News;
