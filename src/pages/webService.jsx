import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import Footer from "../component/footer";
import api from "../api/api";

function WebService() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <div className="web_service_wrap">
        <h4>웹 플랫폼</h4>
        <div className="kokkokkok"></div>
        <a href="https://corecork.co.kr/" target="_blank">
          바로가기
        </a>
      </div>
      <Footer />
    </>
  );
}

export default WebService;
