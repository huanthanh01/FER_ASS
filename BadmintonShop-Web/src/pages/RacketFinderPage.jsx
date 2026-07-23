import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../api/productApi';
import { HiOutlineSparkles, HiOutlineChevronLeft, HiOutlineChevronRight, HiOutlineRefresh } from 'react-icons/hi';
import '../styles/RacketFinderPage.css';
import ProductCard from '../components/ProductCard';

export default function RacketFinderPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [rackets, setRackets] = useState([]);
  const [results, setResults] = useState([]);
  const [isFallback, setIsFallback] = useState(false);

  // User Selections State
  const [selections, setSelections] = useState({
    style: '',      // attacking, defensive, allround
    strength: '',   // weak, medium, strong
    budget: '',     // low, medium, high
    brand: 'All'     // All, Yonex, Victor, Lining
  });

  // Fetch all rackets initially (or on component mount) to process recommendations
  useEffect(() => {
    const fetchRackets = async () => {
      try {
        const res = await getProducts(false, 1, 100, 'RACKET');
        if (res.success && res.products) {
          setRackets(res.products);
        }
      } catch (error) {
        console.error("Failed to load rackets for finder", error);
      }
    };
    fetchRackets();
  }, []);

  const handleSelect = (field, value) => {
    setSelections(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(prev => prev + 1);
    } else {
      calculateRecommendations();
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setSelections({
      style: '',
      strength: '',
      budget: '',
      brand: 'All'
    });
    setStep(1);
    setResults([]);
    setIsFallback(false);
  };

  const calculateRecommendations = () => {
    setLoading(true);
    setStep(5); // Results step

    setTimeout(() => {
      // 1. Map selection criteria to product specs
      let filtered = rackets;

      // Filter by Brand if not 'All'
      if (selections.brand !== 'All') {
        filtered = filtered.filter(r => (r.brand || '').toLowerCase() === selections.brand.toLowerCase());
      }

      // Filter by Budget
      filtered = filtered.filter(r => {
        const price = r.price;
        if (selections.budget === 'low') return price <= 120;
        if (selections.budget === 'medium') return price > 120 && price <= 200;
        if (selections.budget === 'high') return price > 200;
        return true;
      });

      // Filter by Playing Style (Balance)
      filtered = filtered.filter(r => {
        const balance = (r.balance || '').toLowerCase();
        if (selections.style === 'attacking') return balance === 'head heavy';
        if (selections.style === 'defensive') return balance === 'head light';
        if (selections.style === 'allround') return balance === 'even balance';
        return true;
      });

      // Filter by Wrist Strength (Stiffness)
      filtered = filtered.filter(r => {
        const stiffness = (r.stiffness || '').toLowerCase();
        if (selections.strength === 'weak') {
          return stiffness === 'flexible' || stiffness === 'medium';
        }
        if (selections.strength === 'medium') {
          return stiffness === 'medium' || stiffness === 'stiff';
        }
        if (selections.strength === 'strong') {
          return stiffness === 'stiff' || stiffness === 'extra stiff';
        }
        return true;
      });

      // 2. If no exact matches, relax the rules and find approximate recommendations
      if (filtered.length === 0) {
        setIsFallback(true);
        // Fallback: match style first, then show top budget recommendations
        let styleMatches = rackets.filter(r => {
          const balance = (r.balance || '').toLowerCase();
          if (selections.style === 'attacking') return balance === 'head heavy';
          if (selections.style === 'defensive') return balance === 'head light';
          return balance === 'even balance';
        });

        // Try to match budget on the style matches
        let styleAndBudgetMatches = styleMatches.filter(r => {
          const price = r.price;
          if (selections.budget === 'low') return price <= 150;
          if (selections.budget === 'medium') return price <= 220;
          return true;
        });

        if (styleAndBudgetMatches.length > 0) {
          setResults(styleAndBudgetMatches.slice(0, 3));
        } else if (styleMatches.length > 0) {
          setResults(styleMatches.slice(0, 3));
        } else {
          // Absolute fallback: just show featured/top 3 rackets
          setResults(rackets.slice(0, 3));
        }
      } else {
        setIsFallback(false);
        setResults(filtered);
      }
      setLoading(false);
    }, 1000); // Simulate analytical brain scanning
  };

  const getProgressPercentage = () => {
    if (step === 5) return 100;
    return ((step - 1) / 4) * 100;
  };

  const isNextDisabled = () => {
    if (step === 1 && !selections.style) return true;
    if (step === 2 && !selections.strength) return true;
    if (step === 3 && !selections.budget) return true;
    return false;
  };

  return (
    <div className="racket-finder-page page-container">
      <div className="finder-header">
        <h1 className="finder-title">Badminton Racket Finder</h1>
        <p className="finder-subtitle">Answer a few questions to discover the perfect racket for your game</p>
      </div>

      {/* Progress Section */}
      <div className="progress-container">
        <div className="progress-track">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
        <div className="step-indicators">
          <span className={`step-dot ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>1. Style</span>
          <span className={`step-dot ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>2. Strength</span>
          <span className={`step-dot ${step >= 3 ? 'active' : ''} ${step > 3 ? 'completed' : ''}`}>3. Budget</span>
          <span className={`step-dot ${step >= 4 ? 'active' : ''} ${step > 4 ? 'completed' : ''}`}>4. Brand</span>
          <span className={`step-dot ${step === 5 ? 'active' : ''}`}>5. Recommendation</span>
        </div>
      </div>

      {/* Quiz Steps */}
      {step === 1 && (
        <div className="quiz-card glass">
          <h2 className="question-title">Lối chơi sở trường của bạn là gì?</h2>
          <div className="options-grid">
            <div 
              className={`option-card ${selections.style === 'attacking' ? 'selected' : ''}`}
              onClick={() => handleSelect('style', 'attacking')}
            >
              <div className="option-icon-wrapper">⚡</div>
              <span className="option-label">Tấn công (Attacking)</span>
              <p className="option-desc">Thích smash mạnh mẽ, đập cầu uy lực từ cuối sân và thích kiến tạo lối đánh áp đảo đối thủ.</p>
            </div>
            
            <div 
              className={`option-card ${selections.style === 'defensive' ? 'selected' : ''}`}
              onClick={() => handleSelect('style', 'defensive')}
            >
              <div className="option-icon-wrapper">🛡️</div>
              <span className="option-label">Phòng thủ phản tạt (Defensive)</span>
              <p className="option-desc">Thích những cú thủ cầu sâu, phản tạt nhanh nhạy ngang lưới, bắt lưới chớp nhoáng.</p>
            </div>

            <div 
              className={`option-card ${selections.style === 'allround' ? 'selected' : ''}`}
              onClick={() => handleSelect('style', 'allround')}
            >
              <div className="option-icon-wrapper">🎯</div>
              <span className="option-label">Công thủ toàn diện (All-Round)</span>
              <p className="option-desc">Muốn một lối chơi cân bằng, linh hoạt chuyển đổi công và thủ, kiểm soát tốt nhịp độ trận đấu.</p>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="quiz-card glass">
          <h2 className="question-title">Lực cổ tay / Trình độ chơi cầu của bạn?</h2>
          <div className="options-grid">
            <div 
              className={`option-card ${selections.strength === 'weak' ? 'selected' : ''}`}
              onClick={() => handleSelect('strength', 'weak')}
            >
              <div className="option-icon-wrapper">🌱</div>
              <span className="option-label">Mới chơi / Cổ tay trung bình yếu</span>
              <p className="option-desc">Cần một cây vợt dẻo (Flexible) trợ lực tốt để phông cầu cao sâu và tránh chấn thương.</p>
            </div>
            
            <div 
              className={`option-card ${selections.strength === 'medium' ? 'selected' : ''}`}
              onClick={() => handleSelect('strength', 'medium')}
            >
              <div className="option-icon-wrapper">📈</div>
              <span className="option-label">Đã chơi một thời gian / Cổ tay trung bình</span>
              <p className="option-desc">Muốn cây vợt có đũa cứng trung bình (Medium), dung hòa giữa trợ lực và kiểm soát cầu.</p>
            </div>

            <div 
              className={`option-card ${selections.strength === 'strong' ? 'selected' : ''}`}
              onClick={() => handleSelect('strength', 'strong')}
            >
              <div className="option-icon-wrapper">🔥</div>
              <span className="option-label">Chơi tốt / Cổ tay khỏe</span>
              <p className="option-desc">Thích vợt cứng hoặc rất cứng (Stiff/Extra Stiff) để cảm giác cầu chuẩn xác và lực đập uy lực nhất.</p>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="quiz-card glass">
          <h2 className="question-title">Ngân sách dự kiến bạn muốn chi trả?</h2>
          <div className="options-grid">
            <div 
              className={`option-card ${selections.budget === 'low' ? 'selected' : ''}`}
              onClick={() => handleSelect('budget', 'low')}
            >
              <div className="option-icon-wrapper">💵</div>
              <span className="option-label">Tiết kiệm (Dưới $120)</span>
              <p className="option-desc">Các dòng vợt phổ thông, dễ tiếp cận, cực kỳ bền bỉ và kinh tế.</p>
            </div>
            
            <div 
              className={`option-card ${selections.budget === 'medium' ? 'selected' : ''}`}
              onClick={() => handleSelect('budget', 'medium')}
            >
              <div className="option-icon-wrapper">💳</div>
              <span className="option-label">Tầm trung ($120 - $200)</span>
              <p className="option-desc">Các mẫu vợt bán chuyên nghiệp, sở hữu nhiều công nghệ hiện đại của các hãng.</p>
            </div>

            <div 
              className={`option-card ${selections.budget === 'high' ? 'selected' : ''}`}
              onClick={() => handleSelect('budget', 'high')}
            >
              <div className="option-icon-wrapper">🏆</div>
              <span className="option-label">Cao cấp (Trên $200)</span>
              <p className="option-desc">Dòng vợt cao cấp, chuyên nghiệp (Pro/ZZ), chất liệu carbon cao cấp nhất.</p>
            </div>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="quiz-card glass">
          <h2 className="question-title">Bạn có thương hiệu ưa thích nào không?</h2>
          <div className="options-grid">
            <div 
              className={`option-card ${selections.brand === 'All' ? 'selected' : ''}`}
              onClick={() => handleSelect('brand', 'All')}
            >
              <div className="option-icon-wrapper">🏸</div>
              <span className="option-label">Tất cả thương hiệu</span>
              <p className="option-desc">Tìm kiếm sự lựa chọn tối ưu nhất từ mọi hãng vợt hiện có.</p>
            </div>
            
            <div 
              className={`option-card ${selections.brand === 'Yonex' ? 'selected' : ''}`}
              onClick={() => handleSelect('brand', 'Yonex')}
            >
              <div className="option-icon-wrapper">🇯🇵</div>
              <span className="option-label">YONEX</span>
              <p className="option-desc">Hãng vợt hàng đầu thế giới của Nhật Bản, nổi tiếng với Astrox, Nanoflare...</p>
            </div>

            <div 
              className={`option-card ${selections.brand === 'Victor' ? 'selected' : ''}`}
              onClick={() => handleSelect('brand', 'Victor')}
            >
              <div className="option-icon-wrapper">🇹🇼</div>
              <span className="option-label">VICTOR</span>
              <p className="option-desc">Thương hiệu Đài Loan, linh hoạt, tốc độ vượt trội (dòng Thruster, Auraspeed).</p>
            </div>

            <div 
              className={`option-card ${selections.brand === 'Li-Ning' ? 'selected' : ''}`}
              onClick={() => handleSelect('brand', 'Li-Ning')}
            >
              <div className="option-icon-wrapper">🇨🇳</div>
              <span className="option-label">LI-NING</span>
              <p className="option-desc">Thương hiệu tỷ dân, chất liệu carbon cực bền bỉ và đầm tay (dòng Tectonic, Halbertec).</p>
            </div>
          </div>
        </div>
      )}

      {/* Results Step */}
      {step === 5 && (
        <div className="results-container">
          {loading ? (
            <div className="results-loading glass">
              <div className="results-spinner"></div>
              <h3>Đang phân tích lối chơi và lựa chọn vợt phù hợp...</h3>
            </div>
          ) : (
            <>
              <div className="results-intro">
                <h2>Cây vợt phù hợp nhất với bạn</h2>
                {isFallback ? (
                  <p>Chúng tôi không tìm thấy cây vợt khớp 100% các tiêu chí, nhưng đây là những gợi ý tuyệt vời nhất dựa trên lối chơi của bạn:</p>
                ) : (
                  <p>Dựa trên kết quả trắc nghiệm, đây là những cây vợt sinh ra để dành cho bạn:</p>
                )}
              </div>

              {results.length === 0 ? (
                <div className="results-empty glass">
                  <div className="results-empty-icon">😔</div>
                  <h3>Rất tiếc, hiện tại cửa hàng chưa có mẫu vợt phù hợp</h3>
                  <p>Bạn có thể thử đặt lại bộ trắc nghiệm hoặc ghé thăm cửa hàng của chúng tôi để xem các sản phẩm khác.</p>
                </div>
              ) : (
                <div className="results-grid">
                  {results.map(product => (
                    <div key={product._id || product.id} style={{ display: 'flex', flexDirection: 'column' }}>
                      <ProductCard product={product} />
                      <div className="glass" style={{ marginTop: '-10px', padding: '15px', borderRadius: '0 0 var(--radius-md) var(--radius-md)', borderTop: 'none', border: '1px solid var(--color-glass-border)' }}>
                        <div className="badge-racket-spec">
                          <span className="spec-pill">⚖️ {product.weight || '4U'}</span>
                          <span className="spec-pill">🧱 {product.stiffness || 'Medium'}</span>
                          <span className="spec-pill">📍 {product.balance || 'Even Balance'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="action-buttons-row">
                <button className="btn btn-secondary" onClick={handleReset}>
                  <HiOutlineRefresh style={{ marginRight: '8px', display: 'inline' }} /> Làm lại trắc nghiệm
                </button>
                <Link to="/shop" className="btn btn-primary">
                  Ghé thăm cửa hàng
                </Link>
              </div>
            </>
          )}
        </div>
      )}

      {/* Step Navigation Controls */}
      {step < 5 && (
        <div className="quiz-actions">
          <button 
            className="quiz-btn quiz-btn-prev" 
            onClick={handlePrev}
            disabled={step === 1}
          >
            <HiOutlineChevronLeft style={{ marginRight: '6px', display: 'inline' }} /> Quay lại
          </button>
          
          <button 
            className="quiz-btn quiz-btn-next" 
            onClick={handleNext}
            disabled={isNextDisabled()}
          >
            {step === 4 ? 'Xem kết quả' : 'Tiếp theo'} <HiOutlineChevronRight style={{ marginLeft: '6px', display: 'inline' }} />
          </button>
        </div>
      )}
    </div>
  );
}
