import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Footer from "../component/footer";

gsap.registerPlugin(ScrollTrigger);

function RoadMap() {
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
      gsap.from(".road_kicker, .road_title, .road_lead", {
        y: 42,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
      });

      gsap.utils.toArray(".road_reveal").forEach((el) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 78%",
          },
          y: 60,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
        });
      });

      gsap.utils.toArray(".road_step").forEach((step) => {
        gsap.from(
          step.querySelectorAll(".road_step_year, .road_step_content"),
          {
            scrollTrigger: {
              trigger: step,
              start: "top 72%",
            },
            y: 60,
            opacity: 0,
            duration: 0.9,
            stagger: 0.15,
            ease: "power3.out",
          },
        );
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const steps = [
    {
      year: "01",
      label: "FOUNDATION",
      title: "플랫폼의 기반을 설계합니다.",
      desc: "서비스의 방향성, 사용자 흐름, 운영 구조를 정리하며 장기적으로 확장 가능한 플랫폼의 기초를 만듭니다.",
      items: ["서비스 구조 설계", "비즈니스 모델 정립", "핵심 기능 기획"],
    },
    {
      year: "02",
      label: "PLATFORM",
      title: "사용자가 머무는 플랫폼을 구축합니다.",
      desc: "콕 플랫폼을 중심으로 커뮤니티, 콘텐츠, 광고 참여, 지역 서비스가 하나의 경험으로 연결되는 환경을 구축합니다.",
      items: ["KOK 플랫폼 구축", "사용자 참여 기능", "운영 관리 시스템"],
    },
    {
      year: "03",
      label: "EXPANSION",
      title: "사업과 서비스 영역을 확장합니다.",
      desc: "플랫폼 안에서 더 많은 사용자 활동이 일어나도록 서비스 영역과 수익 모델을 단계적으로 확장합니다.",
      items: ["광고 참여 모델", "지역 기반 서비스", "콘텐츠 생태계 확장"],
    },
    {
      year: "04",
      label: "FUTURE",
      title: "기술 기반 성장으로 나아갑니다.",
      desc: "운영 데이터와 플랫폼 기술을 기반으로 더 정교하고 신뢰도 높은 디지털 서비스 기업으로 성장합니다.",
      items: ["데이터 기반 운영", "AI 기술 연계", "플랫폼 고도화"],
    },
  ];

  return (
    <>
      <div className="about_page_cover">
        <div className="about_page_cover_logo"></div>
      </div>

      <main ref={pageRef} className="road_page">
        <section className="road_intro">
          <div className="road_inner">
            <div className="roadmap_icon"></div>
            <p className="road_kicker">ROADMAP</p>

            <h1 className="road_title">
              플랫폼의 기반에서
              <br />
              미래 성장까지.
            </h1>

            <p className="road_lead">
              더진스페이스는 단기적인 서비스 출시가 아니라, 기반 설계부터 플랫폼
              구축, 사업 확장, 기술 고도화까지 이어지는 단계적 성장 로드맵을
              그립니다.
            </p>
          </div>
        </section>

        <section className="road_summary road_reveal">
          <div className="road_inner">
            <div className="road_summary_line">
              <span>Foundation</span>
              <i></i>
              <span>Platform</span>
              <i></i>
              <span>Expansion</span>
              <i></i>
              <span>Future</span>
            </div>
          </div>
        </section>

        <section className="road_timeline">
          <div className="road_inner">
            {steps.map((step) => (
              <article className="road_step" key={step.label}>
                <div className="road_step_year">
                  <span>{step.year}</span>
                  <strong>{step.label}</strong>
                </div>

                <div className="road_step_content">
                  <p>{step.label}</p>
                  <h2>{step.title}</h2>
                  <em>{step.desc}</em>

                  <ul>
                    {step.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="road_closing road_reveal">
          <div className="road_inner">
            <p className="road_kicker">NEXT STEP</p>
            <h2>
              더진스페이스의 로드맵은
              <br />
              서비스 출시가 아니라 <em>성장 구조</em>를 향합니다.
            </h2>
            <p>
              플랫폼이 사용자 경험을 만들고, 사용자 경험이 데이터와 신뢰를
              만들며, 그 신뢰가 다시 사업 확장의 기반이 되는 선순환 구조를
              만들어갑니다.
            </p>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}

export default RoadMap;
