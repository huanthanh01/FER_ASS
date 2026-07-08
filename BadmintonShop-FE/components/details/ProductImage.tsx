import React, { useRef, useState } from 'react';
import { View, Image, Text, ScrollView, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { AppColors } from '../../constants/colors';
import { styles } from '../styles/details/ProductDetails.styles';
import { Product } from '../../models/types';

interface ProductImageProps {
  product: Product;
}

export const ProductImage = ({ product }: ProductImageProps) => {
  const scrollRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentIndexRef = useRef(0);

  const windowWidth = Dimensions.get("window").width;
  const images = product.images && product.images.length > 0 ? product.images : ["https://via.placeholder.com/600"];

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / windowWidth);
    if (index !== currentIndexRef.current) {
      currentIndexRef.current = index;
      setCurrentIndex(index);
    }
  };

  return (
    <View style={styles.imageContainer}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={{ width: windowWidth, height: 350 }}
      >
        {images.map((img, index) => (
          <Image
            key={index}
            source={{ uri: img }}
            style={{ width: windowWidth, height: 350 }}
            resizeMode="contain"
          />
        ))}
      </ScrollView>

      {product.badge && (
        <View style={[styles.badge, { backgroundColor: product.badgeColor || AppColors.primaryOrange }]}>
          <Text style={[styles.badgeText, { color: product.badgeTextColor || AppColors.white }]}>
            {product.badge}
          </Text>
        </View>
      )}

      {images.length > 1 && (
        <View
          style={{
            flexDirection: "row",
            position: "absolute",
            bottom: 16,
            alignSelf: "center",
            gap: 6,
          }}
        >
          {images.map((_, index) => (
            <View
              key={index}
              style={{
                width: currentIndex === index ? 24 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor:
                  currentIndex === index
                    ? AppColors.primaryOrange
                    : "rgba(150, 150, 150, 0.4)",
              }}
            />
          ))}
        </View>
      )}
    </View>
  );
};
