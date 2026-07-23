import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image, Dimensions, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../constants/ThemeContext';
import { AppColors } from '../constants/colors';
import { getProducts } from '../utils/database';
import { useAppContext } from '../controllers/useAppController';
import { Product } from '../models/types';
import { styles } from '../components/styles/shop/RacketFinder.styles';

export default function RacketFinderScreen() {
  const { colors, isDark } = useTheme();
  const { addToCart, favoriteIds, toggleFavorite } = useAppContext();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [rackets, setRackets] = useState<Product[]>([]);
  const [results, setResults] = useState<Product[]>([]);
  const [isFallback, setIsFallback] = useState(false);

  // User selections state
  const [selections, setSelections] = useState({
    style: '',      // attacking, defensive, allround
    strength: '',   // weak, medium, strong
    budget: '',     // low, medium, high
    brand: 'All'     // All, Yonex, Victor, Lining
  });

  const windowWidth = Dimensions.get('window').width;

  useEffect(() => {
    const fetchAllRackets = async () => {
      try {
        const res = await getProducts(false, 1, 100, 'RACKET');
        if (res.success && res.products) {
          setRackets(res.products);
        }
      } catch (error) {
        console.error("Failed to load rackets for finder on mobile", error);
      }
    };
    fetchAllRackets();
  }, []);

  const handleSelect = (field: string, value: string) => {
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
      let filtered = rackets;

      // Filter by Brand
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

      // Filter by Style (Balance Point)
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

      if (filtered.length === 0) {
        setIsFallback(true);
        // Fallback style matches
        let styleMatches = rackets.filter(r => {
          const balance = (r.balance || '').toLowerCase();
          if (selections.style === 'attacking') return balance === 'head heavy';
          if (selections.style === 'defensive') return balance === 'head light';
          return balance === 'even balance';
        });

        // Try style and budget
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
          setResults(rackets.slice(0, 3));
        }
      } else {
        setIsFallback(false);
        setResults(filtered);
      }
      setLoading(false);
    }, 1200);
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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      
      {/* Header Bar */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Tìm Vợt Phù Hợp</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Progress Track */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
          <View 
            style={[
              styles.progressBarFill, 
              { 
                backgroundColor: colors.primary, 
                width: `${getProgressPercentage()}%` 
              }
            ]} 
          />
        </View>
        <Text style={[styles.progressText, { color: colors.textSecondary }]}>
          {step === 5 ? 'Hoàn thành' : `Bước ${step} / 4`}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {step === 1 && (
          <View style={styles.stepContainer}>
            <Text style={[styles.questionText, { color: colors.text }]}>Lối chơi sở trường của bạn là gì?</Text>
            
            <TouchableOpacity 
              style={[
                styles.cardOption, 
                { backgroundColor: colors.card, borderColor: selections.style === 'attacking' ? colors.primary : colors.border }
              ]}
              onPress={() => handleSelect('style', 'attacking')}
            >
              <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
                <Text style={styles.emojiIcon}>⚡</Text>
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={[styles.optionLabel, { color: colors.text }]}>Thiên Công (Attacking)</Text>
                <Text style={[styles.optionDesc, { color: colors.textSecondary }]}>Ưa thích đập cầu tấn công mạnh mẽ, áp đảo đối phương từ cuối sân.</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.cardOption, 
                { backgroundColor: colors.card, borderColor: selections.style === 'defensive' ? colors.primary : colors.border }
              ]}
              onPress={() => handleSelect('style', 'defensive')}
            >
              <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
                <Text style={styles.emojiIcon}>🛡️</Text>
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={[styles.optionLabel, { color: colors.text }]}>Phòng Thủ Phản Tạt (Defensive)</Text>
                <Text style={[styles.optionDesc, { color: colors.textSecondary }]}>Thích phản tạt nhanh nhạy, thủ cầu bền bỉ và chớp thời cơ lưới.</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.cardOption, 
                { backgroundColor: colors.card, borderColor: selections.style === 'allround' ? colors.primary : colors.border }
              ]}
              onPress={() => handleSelect('style', 'allround')}
            >
              <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
                <Text style={styles.emojiIcon}>🎯</Text>
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={[styles.optionLabel, { color: colors.text }]}>Công Thủ Toàn Diện (All-Round)</Text>
                <Text style={[styles.optionDesc, { color: colors.textSecondary }]}>Muốn cân bằng mọi yếu tố, linh hoạt đổi trạng thái tấn công - phòng thủ.</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {step === 2 && (
          <View style={styles.stepContainer}>
            <Text style={[styles.questionText, { color: colors.text }]}>Lực cổ tay / Trình độ chơi cầu của bạn?</Text>
            
            <TouchableOpacity 
              style={[
                styles.cardOption, 
                { backgroundColor: colors.card, borderColor: selections.strength === 'weak' ? colors.primary : colors.border }
              ]}
              onPress={() => handleSelect('strength', 'weak')}
            >
              <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
                <Text style={styles.emojiIcon}>🌱</Text>
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={[styles.optionLabel, { color: colors.text }]}>Mới chơi / Cổ tay yếu</Text>
                <Text style={[styles.optionDesc, { color: colors.textSecondary }]}>Phù hợp vợt đũa dẻo (Flexible) trợ lực tốt, đỡ mỏi tay khi phông cầu.</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.cardOption, 
                { backgroundColor: colors.card, borderColor: selections.strength === 'medium' ? colors.primary : colors.border }
              ]}
              onPress={() => handleSelect('strength', 'medium')}
            >
              <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
                <Text style={styles.emojiIcon}>📈</Text>
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={[styles.optionLabel, { color: colors.text }]}>Đã chơi trung bình / Khá</Text>
                <Text style={[styles.optionDesc, { color: colors.textSecondary }]}>Phù hợp đũa cứng vừa (Medium), dung hòa giữa trợ lực lực và độ chuẩn cầu.</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.cardOption, 
                { backgroundColor: colors.card, borderColor: selections.strength === 'strong' ? colors.primary : colors.border }
              ]}
              onPress={() => handleSelect('strength', 'strong')}
            >
              <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
                <Text style={styles.emojiIcon}>🔥</Text>
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={[styles.optionLabel, { color: colors.text }]}>Chơi lâu năm / Cổ tay khỏe</Text>
                <Text style={[styles.optionDesc, { color: colors.textSecondary }]}>Thích đũa vợt cứng/rất cứng (Stiff) để cầu bay chính xác tuyệt đối.</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {step === 3 && (
          <View style={styles.stepContainer}>
            <Text style={[styles.questionText, { color: colors.text }]}>Mức ngân sách bạn dự định đầu tư?</Text>
            
            <TouchableOpacity 
              style={[
                styles.cardOption, 
                { backgroundColor: colors.card, borderColor: selections.budget === 'low' ? colors.primary : colors.border }
              ]}
              onPress={() => handleSelect('budget', 'low')}
            >
              <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
                <Text style={styles.emojiIcon}>💵</Text>
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={[styles.optionLabel, { color: colors.text }]}>Tiết kiệm (Dưới $120)</Text>
                <Text style={[styles.optionDesc, { color: colors.textSecondary }]}>Các dòng vợt nhập môn, cực bền bỉ và dễ thuần.</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.cardOption, 
                { backgroundColor: colors.card, borderColor: selections.budget === 'medium' ? colors.primary : colors.border }
              ]}
              onPress={() => handleSelect('budget', 'medium')}
            >
              <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
                <Text style={styles.emojiIcon}>💳</Text>
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={[styles.optionLabel, { color: colors.text }]}>Tầm trung ($120 - $200)</Text>
                <Text style={[styles.optionDesc, { color: colors.textSecondary }]}>Nhiều công nghệ cao cấp, chuyên sâu cho người chơi phong trào.</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.cardOption, 
                { backgroundColor: colors.card, borderColor: selections.budget === 'high' ? colors.primary : colors.border }
              ]}
              onPress={() => handleSelect('budget', 'high')}
            >
              <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
                <Text style={styles.emojiIcon}>🏆</Text>
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={[styles.optionLabel, { color: colors.text }]}>Cao cấp (Trên $200)</Text>
                <Text style={[styles.optionDesc, { color: colors.textSecondary }]}>Các dòng vợt flagship chuyên nghiệp cao cấp nhất (Pro / ZZ).</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {step === 4 && (
          <View style={styles.stepContainer}>
            <Text style={[styles.questionText, { color: colors.text }]}>Bạn ưa thích hãng sản xuất nào?</Text>
            
            <TouchableOpacity 
              style={[
                styles.cardOption, 
                { backgroundColor: colors.card, borderColor: selections.brand === 'All' ? colors.primary : colors.border }
              ]}
              onPress={() => handleSelect('brand', 'All')}
            >
              <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
                <Text style={styles.emojiIcon}>🏸</Text>
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={[styles.optionLabel, { color: colors.text }]}>Tất cả các thương hiệu</Text>
                <Text style={[styles.optionDesc, { color: colors.textSecondary }]}>So sánh tối ưu nhất trên toàn bộ danh mục của cửa hàng.</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.cardOption, 
                { backgroundColor: colors.card, borderColor: selections.brand === 'Yonex' ? colors.primary : colors.border }
              ]}
              onPress={() => handleSelect('brand', 'Yonex')}
            >
              <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
                <Text style={styles.emojiIcon}>🇯🇵</Text>
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={[styles.optionLabel, { color: colors.text }]}>YONEX</Text>
                <Text style={[styles.optionDesc, { color: colors.textSecondary }]}>Hãng vợt Nhật Bản lâu đời, công nghệ vượt trội, số 1 thế giới.</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.cardOption, 
                { backgroundColor: colors.card, borderColor: selections.brand === 'Victor' ? colors.primary : colors.border }
              ]}
              onPress={() => handleSelect('brand', 'Victor')}
            >
              <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
                <Text style={styles.emojiIcon}>🇹🇼</Text>
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={[styles.optionLabel, { color: colors.text }]}>VICTOR</Text>
                <Text style={[styles.optionDesc, { color: colors.textSecondary }]}>Thương hiệu Đài Loan, thiên về tốc độ và linh hoạt đè lưới.</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.cardOption, 
                { backgroundColor: colors.card, borderColor: selections.brand === 'Li-Ning' ? colors.primary : colors.border }
              ]}
              onPress={() => handleSelect('brand', 'Li-Ning')}
            >
              <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
                <Text style={styles.emojiIcon}>🇨🇳</Text>
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={[styles.optionLabel, { color: colors.text }]}>LI-NING</Text>
                <Text style={[styles.optionDesc, { color: colors.textSecondary }]}>Đại gia Trung Quốc, khung vợt cực kỳ bền bỉ và thiết kế bắt mắt.</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {step === 5 && (
          <View style={styles.resultsContainer}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                  Đang tính toán các chỉ số và tìm kiếm cây vợt phù hợp nhất...
                </Text>
              </View>
            ) : (
              <View style={{ width: '100%' }}>
                <Text style={[styles.resultsTitle, { color: colors.text }]}>Gợi Ý Vợt Dành Cho Bạn</Text>
                <Text style={[styles.resultsDesc, { color: colors.textSecondary }]}>
                  {isFallback 
                    ? "Không tìm thấy sản phẩm khớp 100%, nhưng đây là những gợi ý tối ưu nhất cho lối chơi của bạn:"
                    : "Danh sách vợt cầu lông phù hợp nhất với các lựa chọn của bạn:"}
                </Text>

                {results.length === 0 ? (
                  <View style={[styles.emptyContainer, { borderColor: colors.border }]}>
                    <Text style={{ fontSize: 40, marginBottom: 12 }}>😔</Text>
                    <Text style={[styles.emptyTitle, { color: colors.text }]}>Chưa có mẫu vợt phù hợp</Text>
                    <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                      Bạn có thể thử làm lại trắc nghiệm hoặc ghé qua danh mục cửa hàng.
                    </Text>
                  </View>
                ) : (
                  <View style={styles.productsList}>
                    {results.map((product) => (
                      <TouchableOpacity 
                        key={product._id} 
                        style={[styles.productCard, { backgroundColor: colors.card }]}
                        activeOpacity={0.9}
                        onPress={() => router.push({ pathname: '/product/[id]', params: { id: product._id } })}
                      >
                        <Image source={{ uri: product.images?.[0] }} style={styles.productImage} resizeMode="cover" />
                        <View style={styles.productDetails}>
                          <Text style={[styles.productBrand, { color: colors.primary }]}>{product.brand}</Text>
                          <Text style={[styles.productNameText, { color: colors.text }]} numberOfLines={1}>{product.name}</Text>
                          
                          <View style={styles.specPillsRow}>
                            <View style={[styles.specPill, { backgroundColor: colors.border }]}>
                              <Text style={[styles.specPillText, { color: colors.textSecondary }]}>⚖️ {product.weight || '4U'}</Text>
                            </View>
                            <View style={[styles.specPill, { backgroundColor: colors.border }]}>
                              <Text style={[styles.specPillText, { color: colors.textSecondary }]}>🧱 {product.stiffness || 'Medium'}</Text>
                            </View>
                            <View style={[styles.specPill, { backgroundColor: colors.border }]}>
                              <Text style={[styles.specPillText, { color: colors.textSecondary }]}>📍 {product.balance || 'Even'}</Text>
                            </View>
                          </View>
                          
                          <View style={styles.priceRow}>
                            <Text style={[styles.productPrice, { color: colors.text }]}>${product.price.toFixed(2)}</Text>
                            <TouchableOpacity 
                              style={[styles.addToCartBtn, { backgroundColor: colors.primary }]}
                              onPress={() => addToCart(product._id, 1)}
                            >
                              <Ionicons name="cart-outline" size={18} color="#ffffff" />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                <View style={styles.resultsActions}>
                  <TouchableOpacity style={[styles.btnSecondary, { borderColor: colors.border }]} onPress={handleReset}>
                    <Ionicons name="refresh" size={18} color={colors.text} style={{ marginRight: 6 }} />
                    <Text style={{ color: colors.text, fontWeight: '600' }}>Làm Lại</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.btnPrimary, { backgroundColor: colors.primary }]} onPress={() => router.replace('/(tabs)/shop')}>
                    <Text style={{ color: '#ffffff', fontWeight: '600' }}>Vào Cửa Hàng</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Nav Controls Footer */}
      {step < 5 && (
        <View style={[styles.navFooter, { borderTopColor: colors.border, backgroundColor: colors.background }]}>
          <TouchableOpacity 
            style={[styles.btnBack, { borderColor: colors.border }]} 
            onPress={handlePrev}
            disabled={step === 1}
          >
            <Ionicons name="chevron-back" size={16} color={step === 1 ? colors.border : colors.text} style={{ marginRight: 4 }} />
            <Text style={{ color: step === 1 ? colors.border : colors.text, fontWeight: '600' }}>Quay lại</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.btnNext, { backgroundColor: isNextDisabled() ? colors.border : colors.primary }]} 
            onPress={handleNext}
            disabled={isNextDisabled()}
          >
            <Text style={{ color: '#ffffff', fontWeight: '600' }}>
              {step === 4 ? 'Xem kết quả' : 'Tiếp theo'}
            </Text>
            <Ionicons name="chevron-forward" size={16} color="#ffffff" style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
