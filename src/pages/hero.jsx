import { useEffect, useRef } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Footer from "../component/footer";

gsap.registerPlugin(ScrollTrigger);

function Hero() {
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
    let timer = null;
    let autoScroll = null;

    const isMobile = () => window.innerWidth <= 900;

    const startAutoScroll = () => {
      if (isMobile()) return;
      if (autoScroll) return;

      autoScroll = setInterval(() => {
        window.scrollBy(0, 20);
      }, 16);
    };

    const clearAutoScroll = () => {
      clearInterval(autoScroll);
      autoScroll = null;

      clearTimeout(timer);
      timer = null;
    };

    const stopAutoScroll = () => {
      clearAutoScroll();

      if (isMobile()) return;

      timer = setTimeout(() => {
        startAutoScroll();
      }, 3000);
    };

    const handleResize = () => {
      clearAutoScroll();

      if (!isMobile()) {
        startAutoScroll();
      }
    };

    startAutoScroll();

    window.addEventListener("wheel", stopAutoScroll);
    window.addEventListener("touchstart", stopAutoScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      clearAutoScroll();

      window.removeEventListener("wheel", stopAutoScroll);
      window.removeEventListener("touchstart", stopAutoScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const updateOrbitLabels = () => {
      const radius = 310;
      const centerX = 450;
      const centerY = 380;

      const rotation = gsap.getProperty(".orbit_track", "rotation") || 0;

      const points = [
        { label: ".orbit_label_01", angle: -90, gap: 54 },
        { label: ".orbit_label_02", angle: 0, gap: 54 },
        { label: ".orbit_label_03", angle: 90, gap: 54 },
        { label: ".orbit_label_04", angle: 180, gap: 54 },
      ];

      points.forEach((item) => {
        const rad = ((item.angle + rotation) * Math.PI) / 180;

        const x = centerX + Math.cos(rad) * radius;
        const y = centerY + Math.sin(rad) * radius;

        gsap.set(item.label, {
          x,
          y: y - 26 - item.gap,
          xPercent: -50,
        });
      });
    };

    const ctx = gsap.context(() => {
      updateOrbitLabels();

      const heroTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".sticky_hero",
          start: "top top",
          end: "+=3000",
          scrub: 1,
          pin: true,
        },
      });

      heroTl
        .fromTo(
          ".white_logo",
          { y: 30, opacity: 1 },
          { y: 0, opacity: 0, duration: 2.2 },
          "<0.3",
        )
        .from(".hero_badge", {
          y: 30,
          opacity: 0,
          duration: 0.5,
        })
        .fromTo(
          ".hero_card",
          { x: 120, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.3",
        )
        .from(".hero_desc", {
          y: 30,
          opacity: 0,
          duration: 0.5,
        })
        .from(
          ".frame_01",
          {
            y: 80,
            opacity: 0,
            duration: 0.8,
          },
          "<0.3",
        )
        .to(".frame_01", {
          y: -80,
          opacity: 0,
          duration: 0.8,
        })
        .fromTo(
          ".frame_02",
          {
            y: 80,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
          },
          "<0.3",
        )
        .to(".frame_02", {
          y: -80,
          opacity: 0,
          duration: 0.8,
        })
        .fromTo(
          ".frame_03",
          {
            y: 80,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
          },
          "<0.3",
        )
        .to({}, { duration: 0.8 });

      const mainTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".main_section",
          start: "top top",
          end: "+=2600",
          scrub: 1,
          pin: true,
        },
      });

      mainTl
        .fromTo(
          ".kok_orbit",
          {
            scale: 1.4,
            opacity: 0,
            y: 120,
          },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            onUpdate: updateOrbitLabels,
          },
        )
        .fromTo(
          ".main_section .kok",
          {
            scale: 2.2,
            opacity: 1,
          },
          {
            scale: 1,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
          },
          "<",
        )
        .fromTo(
          ".orbit_circle",
          {
            scale: 0.3,
            opacity: 0,
          },
          {
            scale: 1,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
          },
          "<",
        )
        .fromTo(
          ".orbit_dot",
          {
            scale: 0,
            opacity: 0,
          },
          {
            scale: 1,
            opacity: 1,
            stagger: 0.12,
            duration: 0.6,
            ease: "back.out(1.8)",
          },
          "-=0.2",
        )
        .to(
          ".orbit_track",
          {
            rotate: 180,
            duration: 3,
            ease: "none",
            onUpdate: updateOrbitLabels,
          },
          "+=0.2",
        )
        .to(
          ".kok_orbit",
          {
            x: -380,
            scale: 0.78,
            duration: 3,
            ease: "power1.inOut",
          },
          "<",
        )
        .fromTo(
          ".platform_content",
          {
            x: 180,
            opacity: 0,
          },
          {
            x: -190,
            opacity: 1,
            duration: 10.2,
            ease: "power3.out",
          },
          "<",
        );

      const whyTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".why_section",
          start: "top top",
          end: "+=1800",
          scrub: 1,
          pin: true,
        },
      });

      whyTl
        .from(".why_badge", {
          y: 30,
          opacity: 0,
          duration: 0.5,
        })
        .from(
          ".why_title",
          {
            y: 60,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.2",
        )
        .from(
          ".why_problem",
          {
            x: -120,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
          },
          "-=0.1",
        )
        .from(
          ".why_arrow",
          {
            scaleX: 0,
            opacity: 0,
            duration: 0.6,
            transformOrigin: "left center",
            ease: "power3.out",
          },
          "-=0.3",
        )
        .from(
          ".why_answer",
          {
            x: 120,
            opacity: 0,
            scale: 0.92,
            duration: 1,
            ease: "power3.out",
          },
          "-=0.3",
        )
        .to(".why_answer", {
          boxShadow: "0 0 80px rgba(226, 24, 45, 0.35)",
          duration: 0.8,
        })
        .to({}, { duration: 0.8 });

      const visionTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".vision_section",
          start: "top top",
          end: "+=1600",
          scrub: 1,
          pin: true,
        },
      });

      visionTl
        .from(".vision_badge", {
          y: 30,
          opacity: 0,
          duration: 0.5,
        })
        .from(
          ".vision_title",
          {
            y: 70,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
          },
          "-=0.2",
        )
        .from(
          ".vision_desc",
          {
            y: 40,
            opacity: 0,
            duration: 0.7,
            ease: "power3.out",
          },
          "-=0.2",
        )
        .to({}, { duration: 0.8 });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <div className="about_page_cover">
        <div className="about_page_cover_logo"></div>
      </div>
      <main ref={pageRef} className="not_mobile">
        <section className="sticky_hero">
          <div className="sticky_inner">
            <div className="white_logo"></div>

            <div className="hero_text_area">
              <div className="hero_badge">USER PARTICIPATION PLATFORM</div>

              <h1 className="hero_frame frame_01">
                하나의 플랫폼,
                <br />
                <em>다섯 가지 경험.</em>
              </h1>

              <h1 className="hero_frame frame_02">
                한 번의 접속,
                <br />
                <em>다섯 가지 활동.</em>
              </h1>

              <h1 className="hero_frame frame_03">
                사용자와 사업자가
                <br />
                <em>함께 성장합니다.</em>
              </h1>

              <p className="hero_desc">
                커뮤니티 · 콘텐츠 · 광고 · 라이브 · 지역 서비스가 하나의
                흐름으로 연결됩니다.
              </p>
            </div>

            <div className="hero_card">
              <p className="card_label">KOK PLATFORM</p>
              <h2>
                연결 중심
                <br />
                사용자 참여형 플랫폼
              </h2>
              <ul>
                <li>커뮤니티</li>
                <li>콘텐츠</li>
                <li>광고 참여</li>
                <li>라이브</li>
                <li>지역 서비스</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="main_section">
          <div className="kok_orbit">
            <div className="orbit_circle"></div>
            <div className="kok"></div>

            <div className="orbit_track">
              <span className="orbit_dot point_01"></span>
              <span className="orbit_dot point_02"></span>
              <span className="orbit_dot point_03"></span>
              <span className="orbit_dot point_04"></span>
            </div>

            <div className="orbit_label orbit_label_01">
              <strong>하나의 플랫폼</strong>
              <span>ONE PLATFORM</span>
            </div>

            <div className="orbit_label orbit_label_02">
              <strong>다중 활동</strong>
              <span>MULTI ACTIVITY</span>
            </div>

            <div className="orbit_label orbit_label_03">
              <strong>끊김 없는 경험</strong>
              <span>CONTINUOUS EXPERIENCE</span>
            </div>

            <div className="orbit_label orbit_label_04">
              <strong>사용자의 선택</strong>
              <span>USER CHOICE</span>
            </div>
          </div>

          <div className="platform_content">
            <p className="platform_content_badge">KOK PLATFORM</p>
            <h2>
              하나의 플랫폼에서
              <br />
              다섯 가지 경험을 연결합니다.
            </h2>
            <p>
              커뮤니티, 콘텐츠, 광고 참여, 라이브, 지역 서비스가 하나의 흐름으로
              이어지는 사용자 참여형 플랫폼입니다.
            </p>
          </div>
        </section>

        <section className="why_section">
          <div className="why_inner">
            <p className="why_badge">BUSINESS CREED</p>

            <h2 className="why_title">
              MAKE <em>IT</em> SIMPLE
            </h2>

            <div className="why_compare">
              <div className="why_card why_problem">
                <p className="why_card_label">PROBLEM</p>
                <h3>
                  대부분의 플랫폼은
                  <br />
                  하나의 기능만 합니다.
                </h3>
                <p className="why_card_desc">
                  커뮤니티는 커뮤니티, 콘텐츠는 콘텐츠, 거래는 거래처럼 사용자는
                  여러 앱을 오가며 활동해야 합니다.
                </p>
              </div>

              <div className="why_arrow">
                <span></span>
              </div>

              <div className="why_card why_answer">
                <p className="why_card_label">OUR ANSWER</p>
                <h3>
                  다양한 활동이
                  <br />
                  하나의 플랫폼에서
                  <br />
                  자연스럽게 연결되도록.
                </h3>
                <p className="why_card_desc">
                  더진스페이스는 사용자 참여 흐름을 중심으로 콕을 기획했습니다.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="vision_section">
          <div className="vision_inner">
            <p className="vision_badge">FUTURE VISION</p>

            <h2 className="vision_title">
              플랫폼과 기술이
              <br />
              <em>함께 성장하는 기업.</em>
            </h2>

            <p className="vision_desc">
              사용자 경험과 서비스 신뢰성을 지속적으로 향상시키며,
              <br />
              다양한 서비스가 자연스럽게 연결되는 플랫폼을 만들어 나갑니다.
            </p>
          </div>
        </section>
        <Footer />
      </main>
      <main className="on_mobile mobile_hero_page">
        <section className="mobile_hero_intro">
          <div className="mobile_hero_bg_logo"></div>

          <p className="mobile_badge">USER PARTICIPATION PLATFORM</p>

          <h1>
            하나의 플랫폼,
            <br />
            <em>다섯 가지 경험.</em>
          </h1>

          <p>
            커뮤니티 · 콘텐츠 · 광고 · 라이브 · 지역 서비스가 하나의 흐름으로
            연결됩니다.
          </p>

          <div className="mobile_hero_card">
            <span>KOK PLATFORM</span>
            <strong>
              연결 중심
              <br />
              사용자 참여형 플랫폼
            </strong>

            <ul>
              <li>커뮤니티</li>
              <li>콘텐츠</li>
              <li>광고 참여</li>
              <li>라이브</li>
              <li>지역 서비스</li>
            </ul>
          </div>
        </section>

        <section className="mobile_platform_section">
          <p className="mobile_badge">KOK PLATFORM</p>

          <h2>
            하나의 플랫폼에서
            <br />
            다섯 가지 경험을 연결합니다.
          </h2>

          <p>
            커뮤니티, 콘텐츠, 광고 참여, 라이브, 지역 서비스가 하나의 흐름으로
            이어지는 사용자 참여형 플랫폼입니다.
          </p>

          <div className="mobile_keyword_grid">
            <div>
              <strong>하나의 플랫폼</strong>
              <span>ONE PLATFORM</span>
            </div>
            <div>
              <strong>다중 활동</strong>
              <span>MULTI ACTIVITY</span>
            </div>
            <div>
              <strong>끊김 없는 경험</strong>
              <span>CONTINUOUS EXPERIENCE</span>
            </div>
            <div>
              <strong>사용자의 선택</strong>
              <span>USER CHOICE</span>
            </div>
          </div>
        </section>

        <section className="mobile_why_section">
          <p className="mobile_badge">BUSINESS CREED</p>

          <h2>
            MAKE <em>IT</em> SIMPLE
          </h2>

          <article className="mobile_problem_card">
            <span>PROBLEM</span>
            <h3>
              대부분의 플랫폼은
              <br />
              하나의 기능만 합니다.
            </h3>
            <p>
              커뮤니티는 커뮤니티, 콘텐츠는 콘텐츠, 거래는 거래처럼 사용자는
              여러 앱을 오가며 활동해야 합니다.
            </p>
          </article>

          <article className="mobile_answer_card">
            <span>OUR ANSWER</span>
            <h3>
              다양한 활동이
              <br />
              하나의 플랫폼에서
              <br />
              자연스럽게 연결되도록.
            </h3>
            <p>더진스페이스는 사용자 참여 흐름을 중심으로 콕을 기획했습니다.</p>
          </article>
        </section>

        <section className="mobile_vision_section">
          <p className="mobile_badge">FUTURE VISION</p>

          <h2>
            플랫폼과 기술이
            <br />
            <em>함께 성장하는 기업.</em>
          </h2>

          <p>
            사용자 경험과 서비스 신뢰성을 지속적으로 향상시키며, 다양한 서비스가
            자연스럽게 연결되는 플랫폼을 만들어 나갑니다.
          </p>
        </section>

        <Footer />
      </main>
    </>
  );
}

export default Hero;
