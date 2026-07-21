import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Image,
  ScrollView,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { AppColors } from "../../constants/colors";
import { useTheme } from "../../constants/ThemeContext";

const bannerImages = [
  require("../../assets/banners/banner1.webp"),
  require("../../assets/banners/banner2.webp"),
  require("../../assets/banners/banner3.webp"),
  require("../../assets/banners/banner4.webp"),
  require("../../assets/banners/banner5.webp"),
  require("../../assets/banners/banner6.webp"),
  require("../../assets/banners/banner7.webp"),
];

export const BannerSlider = () => {
  const { colors } = useTheme();
  const scrollRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentIndexRef = useRef(0);

  const windowWidth = Dimensions.get("window").width;
  const bannerWidth = windowWidth - 40;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / bannerWidth);
    if (index !== currentIndexRef.current) {
      currentIndexRef.current = index;
      setCurrentIndex(index);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const next = (currentIndexRef.current + 1) % bannerImages.length;
      scrollRef.current?.scrollTo({ x: next * bannerWidth, animated: true });
    }, 12000); // Swap every 12 seconds

    return () => clearInterval(interval);
  }, [bannerWidth]);

  return (
    <View style={{ width: windowWidth, alignItems: "center", marginTop: 16 }}>
      <View style={{ width: bannerWidth }}>
        <View style={{ height: 160, borderRadius: 12, overflow: "hidden" }}>
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {bannerImages.map((banner, index) => (
              <Image
                key={index}
                source={banner}
                style={{ width: bannerWidth, height: 160 }}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 12,
            gap: 6,
          }}
        >
          {bannerImages.map((_, index) => (
            <View
              key={index}
              style={{
                width: currentIndex === index ? 24 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor:
                  currentIndex === index
                    ? colors.primary
                    : "rgba(150, 150, 150, 0.4)",
              }}
            />
          ))}
        </View>
      </View>
    </View>
  );
};
