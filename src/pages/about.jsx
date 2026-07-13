import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Footer from "../component/footer";

gsap.registerPlugin(ScrollTrigger);

function About() {
  const pageRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
      gsap.from(".about_kicker, .about_title, .about_lead", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
      });

      gsap.utils.toArray(".about_reveal").forEach((el) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 78%",
          },
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        });
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <div className="about_page_cover">
        <div className="about_page_cover_logo"></div>
      </div>
      <main ref={pageRef} className="about_page">
        <section className="about_intro">
          <div className="about_inner">
            <div className="about_icon"></div>
            <p className="about_kicker">COMPANY OVERVIEW</p>

            <h1 className="about_title">
              기술과 플랫폼을 기반으로
              <br />
              성장하는 <em>디지털 서비스 기업</em>
            </h1>

            <p className="about_lead">
              더진스페이스는 플랫폼 서비스의 구축과 운영을 중심으로, 사용자와
              사업자가 더 쉽고 자연스럽게 연결될 수 있는 디지털 환경을
              만들어갑니다.
            </p>
          </div>
        </section>

        <section className="about_company about_reveal">
          <div className="about_inner about_company_grid">
            <div className="about_statement">
              <p className="section_kicker">WHAT WE DO</p>
              <h2>
                단순한 서비스 제공을 넘어,
                <br />
                지속 가능한 플랫폼 생태계를 설계합니다.
              </h2>
              <p>
                사용자 경험, 운영 안정성, 서비스 확장성을 함께 고려해 하나의
                서비스가 장기적으로 성장할 수 있는 기반을 만듭니다.
                더진스페이스는 기획, 구축, 운영, 개선의 흐름을 연결하며 플랫폼이
                실제 비즈니스 성과로 이어질 수 있도록 돕습니다.
              </p>
            </div>

            <div className="mission_card">
              <span>MISSION</span>
              <strong>
                사용자와 사업자가
                <br />
                함께 성장할 수 있는
                <br />
                연결 중심 플랫폼.
              </strong>
            </div>
          </div>
        </section>

        <section className="about_value about_reveal">
          <div className="about_inner">
            <p className="section_kicker">CORE VALUE</p>
            <h2 className="section_title">더진스페이스가 중요하게 보는 기준</h2>

            <div className="value_grid">
              <div>
                <span>01</span>
                <strong>사용자 중심</strong>
                <p>
                  쉽게 접근하고 자연스럽게 머무를 수 있는 경험을 설계합니다.
                </p>
              </div>
              <div>
                <span>02</span>
                <strong>연결과 참여</strong>
                <p>
                  사용자, 사업자, 서비스가 하나의 흐름 안에서 이어지게 합니다.
                </p>
              </div>
              <div>
                <span>03</span>
                <strong>운영 안정성</strong>
                <p>
                  서비스가 지속적으로 운영될 수 있는 구조와 정책을 고민합니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="about_portfolio about_reveal">
          <div className="about_inner">
            <p className="section_kicker">BUSINESS PORTFOLIO</p>
            <h2 className="section_title">
              네 개의 <em>사업 축</em>으로 움직입니다
            </h2>

            <div className="portfolio_grid">
              <article>
                <span className="portfolio_icon red">콕</span>
                <small>01</small>
                <h3>콕 플랫폼</h3>
                <p>
                  사용자 참여 기반 멀티 플랫폼입니다. 커뮤니티, 콘텐츠, 광고
                  참여, 지역 서비스를 하나의 흐름 안에서 연결합니다.
                </p>
              </article>

              <article>
                <span className="portfolio_icon blue">KEY</span>
                <small>02</small>
                <h3>키게이트</h3>
                <p>
                  보안과 인증 기술을 기반으로 안정적인 플랫폼 운영 환경을
                  구축하고 서비스 신뢰도를 높입니다.
                </p>
              </article>

              <article>
                <span className="portfolio_icon green">IP</span>
                <small>03</small>
                <h3>특허 · 지식재산 사업</h3>
                <p>
                  플랫폼 운영 경험과 기술 개발을 바탕으로 기술 자산을 확보하고
                  활용 가능성을 확장합니다.
                </p>
              </article>

              <article>
                <span className="portfolio_icon dark">⚙</span>
                <small>04</small>
                <h3>플랫폼 운영 기술</h3>
                <p>
                  사용자 관리, 운영 정책, 광고 운영, 관리자 기능 등 플랫폼
                  운영에 필요한 관리 환경을 구축합니다.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="about_closing about_reveal">
          <div className="about_inner">
            <h2>
              더진스페이스는
              <br />
              플랫폼과 기술이 함께 성장하는 방향을 봅니다.
            </h2>
            <p>
              하나의 서비스가 더 많은 사용자 경험으로 확장되고, 그 경험이
              사업자의 성장과 연결되는 구조를 만들어갑니다.
            </p>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}

export default About;
