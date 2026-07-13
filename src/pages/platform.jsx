import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Footer from "../component/footer";

gsap.registerPlugin(ScrollTrigger);

function Platform() {
  const pageRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const timer = setTimeout(() => {
      document.body.classList.add("about_loaded");
    }, 800);

    return () => {
      clearTimeout(timer);
      document.body.classList.remove("about_loaded");
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(
        ".platform_hero_kicker, .platform_hero_title, .platform_hero_desc",
        {
          y: 70,
          opacity: 0,
          duration: 1,
          stagger: 0.16,
          ease: "power3.out",
        },
      );

      gsap.from(".platform_activity_card", {
        y: 80,
        opacity: 0,
        rotateX: -12,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        delay: 0.35,
      });

      gsap.to(".platform_hero", {
        backgroundPosition: "40% 40%, 60% 30%",
        scrollTrigger: {
          trigger: ".platform_hero",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.utils.toArray(".platform_reveal").forEach((section) => {
        const items = section.querySelectorAll(".reveal_item");

        gsap.from(items, {
          scrollTrigger: {
            trigger: section,
            start: "top 72%",
          },
          y: 70,
          opacity: 0,
          duration: 0.85,
          stagger: 0.12,
          ease: "power3.out",
        });
      });

      gsap.utils.toArray(".platform_effect_card").forEach((card, index) => {
        gsap.to(card, {
          y: index % 2 === 0 ? -18 : 18,
          scrollTrigger: {
            trigger: ".platform_effect",
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        });
      });

      gsap.from(
        ".platform_closing h2, .platform_closing .platform_hero_kicker",
        {
          scrollTrigger: {
            trigger: ".platform_closing",
            start: "top 72%",
          },
          y: 70,
          opacity: 0,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
        },
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const activityList = [
    ["01", "커뮤니티", "관심사 기반 모임·소통"],
    ["02", "콘텐츠", "관심사에 맞는 피드·정보"],
    ["03", "광고 참여", "사용자 직접 선택형 참여"],
    ["04", "라이브", "실시간 콘텐츠·소통 경험"],
    ["05", "지역 서비스", "동네 가게·생활 정보"],
  ];

  const highlightList = [
    ["ONE", "One Platform", "하나의 플랫폼 안에서 다양한 기능을 제공합니다."],
    [
      "MULTI",
      "Multi Activity",
      "사용자 활동 중심으로 서비스 구조를 설계했습니다.",
    ],
    [
      "CONT.",
      "Continuous Experience",
      "기능 간 자연스러운 연결 경험을 제공합니다.",
    ],
    [
      "USER",
      "User Choice",
      "사용자가 직접 이용 방식을 선택할 수 있는 구조입니다.",
    ],
  ];

  const expectedList = [
    [
      "01",
      "지역 기반 정보 접근성 향상",
      "가까운 매장과 서비스를 더 빠르게 찾습니다.",
    ],
    ["02", "사업자 홍보 채널 확대", "작은 가게도 손쉽게 홍보할 수 있습니다."],
    [
      "03",
      "신뢰할 수 있는 연결 강화",
      "사용자와 사업자가 안심하고 만날 수 있습니다.",
    ],
    [
      "04",
      "지역 커뮤니티 활성화",
      "동네에서 일어나는 일을 함께 나누는 공간이 됩니다.",
    ],
    [
      "05",
      "플랫폼 참여 생태계 확대",
      "사용자와 사업자가 함께 성장하는 환경을 만듭니다.",
    ],
  ];

  return (
    <>
      <div className="about_page_cover">
        <div className="about_page_cover_logo"></div>
      </div>

      <main ref={pageRef} className="platform_page">
        <section className="platform_hero">
          <div className="platform_inner">
            <div className="platform_icon"></div>
            <p className="platform_hero_kicker">KOK PLATFORM OVERVIEW</p>

            <h1 className="platform_hero_title">
              한 번의 접속,
              <br />
              <em>다섯 가지 활동.</em>
            </h1>

            <p className="platform_hero_desc">
              콕은 단순한 커뮤니티가 아니라 커뮤니티, 콘텐츠, 광고 참여, 라이브,
              지역 서비스가 하나의 흐름으로 연결된 사용자 참여형 멀티
              플랫폼입니다.
            </p>

            <div className="platform_activity_grid">
              {activityList.map((item) => (
                <article className="platform_activity_card" key={item[0]}>
                  <span>{item[0]}</span>
                  <h3>{item[1]}</h3>
                  <p>{item[2]}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="platform_highlight platform_reveal">
          <div className="platform_inner">
            <p className="section_kicker reveal_item">PLATFORM HIGHLIGHTS</p>

            <h2 className="section_title reveal_item">
              네 가지로 정리되는 <em>콕의 특징</em>
            </h2>

            <div className="platform_highlight_grid">
              {highlightList.map((item) => (
                <article
                  className="platform_highlight_card reveal_item"
                  key={item[0]}
                >
                  <span>{item[0]}</span>
                  <div>
                    <h3>{item[1]}</h3>
                    <p>{item[2]}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="platform_trade platform_reveal">
          <div className="platform_inner">
            <p className="section_kicker reveal_item">
              SAFE CONVERSATION TRADE
            </p>

            <h2 className="section_title reveal_item">
              이야기하다가 바로 거래까지,
              <br />
              <em>그 사이를 콕이 지킵니다.</em>
            </h2>

            <div className="platform_flow_grid">
              <article className="platform_flow_card reveal_item">
                <span>STEP 01</span>
                <h3>채팅으로 이야기</h3>
                <p>관심 있는 물건을 판매자와 가볍게 묻습니다.</p>
              </article>

              <article className="platform_flow_card reveal_item">
                <span>STEP 02</span>
                <h3>대화방에서 결제</h3>
                <p>다른 앱으로 옮기지 않고 채팅 안에서 바로 결제합니다.</p>
              </article>

              <article className="platform_flow_card dark reveal_item">
                <span>STEP 03</span>
                <h3>확인 후 정산</h3>
                <p>문제가 없으면 판매자에게 정산됩니다.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="platform_ad platform_reveal">
          <div className="platform_inner">
            <p className="section_kicker reveal_item">REWARD ADVERTISING</p>

            <h2 className="section_title reveal_item">
              광고를 보면,
              <br />
              <em>돈이 돌아옵니다.</em>
            </h2>

            <p className="platform_section_desc reveal_item">
              광고주가 직접 올리고, 관심사에 맞는 사용자에게 노출되며, 광고를 본
              사용자에게 보상이 지급되는 상생형 광고 구조입니다.
            </p>

            <div className="platform_flow_grid four">
              <article className="platform_flow_card reveal_item">
                <span>01 · 광고주</span>
                <h3>직접 등록</h3>
                <p>대행사 없이 광고주가 광고를 올립니다.</p>
              </article>

              <article className="platform_flow_card reveal_item">
                <span>02 · 콕</span>
                <h3>맞춤 노출</h3>
                <p>관심사에 맞는 사용자에게 연결합니다.</p>
              </article>

              <article className="platform_flow_card reveal_item">
                <span>03 · 사용자</span>
                <h3>광고를 본다</h3>
                <p>관심 있는 광고를 스스로 골라 봅니다.</p>
              </article>

              <article className="platform_flow_card dark reveal_item">
                <span>04 · 리워드</span>
                <h3>보상 지급</h3>
                <p>본 만큼 사용자에게 리워드가 돌아갑니다.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="platform_spot platform_reveal">
          <div className="platform_inner">
            <p className="section_kicker reveal_item">
              SPOT · 지역 사업자 연결
            </p>

            <h2 className="section_title reveal_item">
              동네 사업자와 손님을
              <br />
              <em>연결합니다.</em>
            </h2>

            <div className="platform_two_grid">
              <article className="platform_info_card reveal_item">
                <span>WHAT IS SPOT</span>
                <h3>
                  스팟은 지역 사용자와
                  <br />
                  고객 사업자를 보다 효과적으로 연결하는 서비스입니다.
                </h3>
                <p>
                  사업자는 매장 정보, 서비스, 이벤트, 프로모션을 등록할 수 있고,
                  사용자는 관심 있는 지역 정보를 한곳에서 편리하게 확인합니다.
                </p>
              </article>

              <article className="platform_info_card dark reveal_item">
                <span>FOR LOCAL</span>
                <h3>지역 기반 정보 환경 구축</h3>
                <ul>
                  <li>매장 정보 등록</li>
                  <li>이벤트·프로모션 안내</li>
                  <li>가까운 환경에서 소통</li>
                  <li>사업자 홍보 채널 확장</li>
                </ul>
              </article>
            </div>
          </div>
        </section>

        <section className="platform_effect platform_reveal">
          <div className="platform_inner">
            <p className="section_kicker reveal_item">EXPECTED EFFECTS</p>

            <h2 className="section_title reveal_item">
              다섯 가지 <em>기대 효과</em>
            </h2>

            <div className="platform_effect_grid">
              {expectedList.map((item) => (
                <article
                  className="platform_effect_card reveal_item"
                  key={item[0]}
                >
                  <strong>{item[0]}</strong>
                  <h3>{item[1]}</h3>
                  <p>{item[2]}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="platform_closing">
          <div className="platform_inner">
            <p className="platform_hero_kicker">KOK PLATFORM</p>
            <h2>
              사용자와 사업자가
              <br />
              <em>함께 성장하는 연결 중심 플랫폼.</em>
            </h2>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}

export default Platform;
