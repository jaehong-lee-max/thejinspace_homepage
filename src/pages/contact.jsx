import { useEffect, useState } from "react";

import Footer from "../component/footer";
import api from "../api/api";

function Contact() {
  const [form, setForm] = useState({
    subject: "",
    email: "",
    content: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const subject = form.subject.trim();
    const email = form.email.trim();
    const content = form.content.trim();

    if (!subject) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (!email) {
      alert("이메일을 입력해주세요.");
      return;
    }

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (!emailRegex.test(email)) {
      alert("올바른 이메일 형식으로 입력해주세요.");
      return;
    }

    if (!content) {
      alert("본문을 입력해주세요.");
      return;
    }

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      await api.post("/api/contact", {
        subject,
        email,
        content,
      });

      alert("문의가 정상적으로 전송되었습니다.");

      setForm({
        subject: "",
        email: "",
        content: "",
      });
    } catch (error) {
      console.error("문의 전송 실패:", error);

      const message =
        error.response?.data?.message || "문의 전송 중 오류가 발생했습니다.";

      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <main>
        <div className="contact_wrap">
          <h4>- CONTACT -</h4>

          <div className="contact_wrap_inner">
            <form onSubmit={handleSubmit}>
              <table>
                <tbody>
                  <tr>
                    <th>제목</th>
                    <td>
                      <input
                        type="text"
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        placeholder="제목을 입력해주세요"
                        maxLength={200}
                      />
                    </td>
                  </tr>

                  <tr>
                    <th>이메일</th>
                    <td>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="이메일을 입력해 주세요"
                        maxLength={200}
                      />
                    </td>
                  </tr>

                  <tr>
                    <th>본문</th>
                    <td>
                      <textarea
                        name="content"
                        value={form.content}
                        onChange={handleChange}
                        placeholder="본문을 입력해 주세요"
                        maxLength={5000}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="button_area">
                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "전송 중..." : "전송"}
                </button>
              </div>
            </form>
          </div>
        </div>

        <Footer />
      </main>
    </>
  );
}

export default Contact;
