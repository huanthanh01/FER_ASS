import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import ReportChat from '../components/report/ReportChat';
import { 
  HiOutlineChatAlt2, 
  HiOutlineLogin, 
  HiOutlineUserAdd, 
  HiOutlineQuestionMarkCircle,
  HiOutlineShieldCheck
} from 'react-icons/hi';
import '../styles/ReportPage.css';

export default function ReportPage() {
  const navigate = useNavigate();
  const { currentUser: user } = useAppContext();

  if (!user) {
    return (
      <div className="report-unauth-container">
        <div className="report-unauth-card">
          <div className="report-icon-glow">
            <HiOutlineChatAlt2 size={40} />
          </div>

          <h1 className="report-unauth-title">Báo Cáo Sự Cố & Live Chat</h1>
          <p className="report-unauth-desc">
            Vui lòng đăng nhập tài khoản của bạn để gửi báo cáo sự cố hoặc trò chuyện trực tiếp 1-1 với Chăm sóc khách hàng BadmintonShop.
          </p>

          <div className="report-unauth-features">
            <div className="feature-pill">
              <HiOutlineShieldCheck className="text-[var(--color-primary)]" />
              <span>Theo dõi lịch sử báo cáo</span>
            </div>
            <div className="feature-pill">
              <HiOutlineShieldCheck className="text-[var(--color-primary)]" />
              <span>Hỗ trợ sự cố đơn hàng nhanh chóng</span>
            </div>
          </div>

          <div className="report-unauth-actions">
            <button 
              className="cta-btn-primary w-full"
              onClick={() => navigate('/login')}
            >
              <HiOutlineLogin size={20} />
              Đăng Nhập Ngay
            </button>
            <button 
              className="cta-btn-secondary w-full"
              onClick={() => navigate('/register')}
            >
              <HiOutlineUserAdd size={20} />
              Tạo Tài Khoản Mới
            </button>
          </div>

          <div className="report-unauth-footer">
            <span>Bạn muốn tra cứu thông tin nhanh?</span>
            <button 
              className="support-link-btn"
              onClick={() => navigate('/support')}
            >
              <HiOutlineQuestionMarkCircle /> Xem Trung Tâm Hỗ Trợ (FAQ)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <ReportChat user={user} />;
}
