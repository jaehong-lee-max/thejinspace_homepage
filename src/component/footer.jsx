import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Link,
} from "react-router-dom";

function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <footer>
        <div className="footer_inner">
          © 2026 THEJIN SPACE. All Rights Reserved.
          <span>
            대표 : 박덕진 <em>|</em>
            주소 : 인천 부평구 주부토로 236 (갈산동, 인천테크노밸리U1센터)
            C동2117호 <em>|</em>
            사업자등록번호 : 000-00-00000
            <Link to="/contact" className="right">
              사업 제휴 문의
            </Link>
          </span>
        </div>
      </footer>
    </>
  );
}

export default Footer;
