import { useEffect, useRef } from "react";
import Header from "./component/header";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Hero from "./pages/hero";
import About from "./pages/about";
import RoadMap from "./pages/roadMap";
import Platform from "./pages/platform";
import News from "./pages/news";
import Contact from "./pages/contact";
import NewsDetail from "./pages/newsDetail";
import Login from "./pages/login";
import Write from "./pages/write";
import WebService from "./pages/webService";

gsap.registerPlugin(ScrollTrigger);

function App() {
  return (
    <div className="wrap">
      <Header />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/about" element={<About />} />
        <Route path="/road_map" element={<RoadMap />} />
        <Route path="/platform" element={<Platform />} />
        <Route path="/web_platform" element={<WebService />} />
        <Route path="/news" element={<News />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/news_detail" element={<NewsDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/write_news" element={<Write />} />
      </Routes>
    </div>
  );
}

export default App;
