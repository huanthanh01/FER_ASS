import React, { useState } from "react";
import {
  HiOutlineChatAlt2,
  HiOutlineQuestionMarkCircle,
  HiOutlinePhone,
  HiOutlineMail,
  HiChevronDown,
  HiSearch,
  HiOutlineLocationMarker,
} from "react-icons/hi";
import "../../styles/SupportPage.css";

const FAQ_DATA = [
  {
    id: 1,
    category: "orders",
    question: "Tôi có thể theo dõi tiến độ đơn hàng của mình bằng cách nào?",
    answer:
      'Sau khi đăng nhập, bạn có thể vào trang "Đơn hàng" để kiểm tra vị trí và trạng thái đơn hàng theo thời gian thực hoặc tra cứu theo mã vận đơn.',
  },
  {
    id: 2,
    category: "returns",
    question: "Chính sách bảo hành và đổi trả sản phẩm tại BadmintonShop?",
    answer:
      "Vợt và giày cầu lông chính hãng được bảo hành 60 - 90 ngày theo nhà sản xuất. Hỗ trợ đổi mới 1-1 trong vòng 7 ngày nếu lỗi do nhà sản xuất hoặc chọn nhầm size.",
  },
  {
    id: 3,
    category: "rackets",
    question: "Làm thế nào để chọn số kg căng dây vợt phù hợp với tay?",
    answer:
      "• Người mới bắt đầu / Nữ: 9.0kg - 10.5kg (Nhiều trợ lực, đánh nhẹ tay)\n• Người chơi phong trào: 10.5kg - 11.5kg (Cân bằng giữa lực và kiểm soát)\n• Chuyên nghiệp / Tay khỏe: 11.5kg - 13.0kg (Kiểm soát cầu chuẩn xác)",
  },
  {
    id: 4,
    category: "payment",
    question: "BadmintonShop hỗ trợ những phương thức thanh toán nào?",
    answer:
      "Chúng tôi hỗ trợ COD (thanh toán khi nhận hàng), chuyển khoản ngân hàng nhanh qua mã QR, ví điện tử (ZaloPay/MoMo) và trả góp qua thẻ tín dụng.",
  },
  {
    id: 5,
    category: "orders",
    question: "Thời gian giao hàng tiêu chuẩn mất bao lâu?",
    answer:
      "Giao hàng hỏa tốc nội thành trong 2-4 giờ. Các khu vực tỉnh thành khác từ 1 - 3 ngày làm việc kể từ lúc xác nhận đơn.",
  },
  {
    id: 6,
    category: "rackets",
    question:
      "Tôi có thể yêu cầu căng dây vợt theo thông số riêng khi đặt hàng không?",
    answer:
      "Có! Khi đặt vợt trên BadmintonShop, bạn có thể ghi chú loại dây (Kizuna, Yonex BG65, BG80...) và số kg mong muốn. Shop sẽ căng máy điện tử chuẩn xác trước khi giao.",
  },
];

export default function SupportHub() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [openFaqId, setOpenFaqId] = useState(1);

  const filteredFaqs = FAQ_DATA.filter((faq) => {
    const matchesCategory =
      selectedCategory === "all" || faq.category === selectedCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="support-page-container">
      {/* Hero Section Header */}
      <header className="support-hero-header">
        <div className="support-badge-glow">
          <span className="pulse-dot"></span>
          <span>TRUNG TÂM TRỢ GIÚP</span>
        </div>
        <h1 className="support-hero-title">
          Hỗ Trợ & <span className="text-gradient">Giải Đáp Thắc Mắc</span>
        </h1>
        <p className="support-hero-desc">
          Tra cứu nhanh các thông tin và câu hỏi thường gặp về sản phẩm, chính
          sách bảo hành hoặc các cổng liên hệ chăm sóc khách hàng.
        </p>
      </header>

      {/* FAQ Knowledge Base Section */}
      <section className="faq-section">
        <div className="faq-header">
          <div className="faq-header-top">
            <h2 className="faq-title">Câu Hỏi Thường Gặp (FAQ)</h2>
            <div className="faq-search-box">
              <HiSearch className="faq-search-icon" />
              <input
                type="text"
                className="faq-search-input"
                placeholder="Tìm kiếm câu hỏi, chính sách..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="faq-categories">
            <button
              className={`category-tab ${selectedCategory === "all" ? "active" : ""}`}
              onClick={() => setSelectedCategory("all")}
            >
              Tất cả câu hỏi
            </button>
            <button
              className={`category-tab ${selectedCategory === "orders" ? "active" : ""}`}
              onClick={() => setSelectedCategory("orders")}
            >
              🚚 Đơn hàng & Vận chuyển
            </button>
            <button
              className={`category-tab ${selectedCategory === "rackets" ? "active" : ""}`}
              onClick={() => setSelectedCategory("rackets")}
            >
              🏸 Vợt & Kỹ thuật căng dây
            </button>
            <button
              className={`category-tab ${selectedCategory === "returns" ? "active" : ""}`}
              onClick={() => setSelectedCategory("returns")}
            >
              🔄 Đổi trả & Bảo hành
            </button>
            <button
              className={`category-tab ${selectedCategory === "payment" ? "active" : ""}`}
              onClick={() => setSelectedCategory("payment")}
            >
              💳 Thanh toán
            </button>
          </div>
        </div>

        {/* Accordion Items List */}
        <div className="faq-accordion-list">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`faq-item ${isOpen ? "open" : ""}`}
                >
                  <button
                    className="faq-question-btn"
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                  >
                    <span className="faq-question-text">
                      <HiOutlineQuestionMarkCircle className="faq-icon-tag" />
                      {faq.question}
                    </span>
                    <HiChevronDown className="faq-chevron" />
                  </button>
                  {isOpen && (
                    <div className="faq-answer-panel">
                      <p style={{ margin: 0, whiteSpace: "pre-line" }}>
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="no-faq-results">
              <p>
                Không tìm thấy câu hỏi nào phù hợp với từ khóa "{searchQuery}".
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Direct Contact Channels Section */}
      <section className="contact-channels-section">
        <div className="contact-channels-header">
          <h3>Kênh Liên Hệ Trực Tiếp</h3>
        </div>
        <div className="contact-channels-grid">
          <div 
            className="channel-card" 
            onClick={() => window.open('tel:0916412769')}
            style={{ cursor: 'pointer' }}
          >
            <div className="channel-icon-wrapper">
              <HiOutlinePhone />
            </div>
            <h4>Hotline Hỗ Trợ</h4>
            <p>0916412769 (6:00 - 23:00)</p>
            <span className="channel-action-text">Gọi ngay</span>
          </div>

          <div 
            className="channel-card" 
            onClick={() => window.open('mailto:flamex9365@gmail.com')}
            style={{ cursor: 'pointer' }}
          >
            <div className="channel-icon-wrapper">
              <HiOutlineMail />
            </div>
            <h4>Email Hỗ Trợ</h4>
            <p>flamex9365@gmail.com</p>
            <span className="channel-action-text">Gửi email</span>
          </div>

          <div 
            className="channel-card" 
            onClick={() => window.open('https://zalo.me/0916412769', '_blank')}
            style={{ cursor: 'pointer' }}
          >
            <div className="channel-icon-wrapper">
              <HiOutlineChatAlt2 />
            </div>
            <h4>Liên Hệ Zalo</h4>
            <p>Nhấn để chat: 0916412769</p>
            <span className="channel-action-text">Nhắn Zalo</span>
          </div>

          <div className="channel-card">
            <div className="channel-icon-wrapper">
              <HiOutlineLocationMarker />
            </div>
            <h4>Hệ Thống Shop</h4>
            <p>Trải nghiệm sản phẩm trực tiếp</p>
            <span className="channel-action-text">Xem bản đồ</span>
          </div>
        </div>
      </section>
    </div>
  );
}
