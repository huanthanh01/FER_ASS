import React from "react";
import { Text, View } from "react-native";
import { AppColors } from "../../constants/colors";
import { Product } from "../../models/types";
import { styles } from "../styles/details/ProductDetails.styles";

interface ProductInfoProps {
  product: Product;
  colors: any;
}

export const ProductInfo = ({ product, colors }: ProductInfoProps) => {
  const getWeightText = (category?: string) => {
    if (!category) return "4U (Avg. 84g)";
    const cat = category.toLowerCase();
    if (cat.includes("racket")) return "4U (Avg. 84g)";
    if (cat.includes("shoes")) return "190g";
    if (cat.includes("shirt") || cat.includes("skirt") || cat.includes("short"))
      return "Light";
    if (cat.includes("bag") || cat.includes("backpack"))
      return "Super waterproof";
    if (cat.includes("accessories")) return "Substantial";
    return "4U (Avg. 84g)";
  };

  return (
    <View style={styles.detailsContainer}>
      <Text style={[styles.brand, { color: colors.primary }]}>
        {product.brand}
      </Text>
      <Text style={[styles.name, { color: colors.text }]}>{product.name}</Text>
      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
        <Text style={{ color: "#ffc107", fontSize: 16 }}>★</Text>
        <Text style={{ color: colors.text, marginLeft: 4, fontWeight: "500" }}>
          {(product.rating && product.rating > 0) ? product.rating.toFixed(1) : "No ratings"}
        </Text>
        <Text style={{ color: colors.textSecondary, marginLeft: 8 }}>
          ({product.numReviews || 0} reviews)
        </Text>
      </View>

      <View style={styles.priceRow}>
        <View style={styles.priceContainer}>
          <Text style={[styles.price, { color: colors.primary }]}>
            ${product.price.toFixed(2)}
          </Text>
          {product.oldPrice && (
            <Text style={styles.oldPrice}>${product.oldPrice.toFixed(2)}</Text>
          )}
        </View>
        <View style={[styles.stockBadge, { backgroundColor: (product.stock ?? 0) > 0 ? `${colors.primary}1A` : 'rgba(239, 68, 68, 0.1)' }]}>
          <Text style={[styles.stockText, { color: (product.stock ?? 0) > 0 ? colors.primary : '#ef4444' }]}>
            {(product.stock ?? 0) > 0 ? "In Stock" : "Out of Stock"}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Description
      </Text>
      <Text style={[styles.description, { color: colors.textSecondary }]}>
        {product.description}
      </Text>
      <Text
        style={[styles.sectionTitle, { color: colors.text, marginTop: 16 }]}
      >
        Specifications
      </Text>
      <View
        style={{
          marginTop: 8,
          backgroundColor: colors.border,
          padding: 12,
          borderRadius: 8,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingVertical: 4,
          }}
        >
          <Text style={{ color: colors.textSecondary, width: "40%" }}>
            Brand
          </Text>
          <Text style={{ color: colors.text, flex: 1, fontWeight: "500" }}>
            {product.brand || "Yonex"}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingVertical: 4,
          }}
        >
          <Text style={{ color: colors.textSecondary, width: "40%" }}>
            Category
          </Text>
          <Text style={{ color: colors.text, flex: 1, fontWeight: "500" }}>
            {product.category || "Uncategorized"}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingVertical: 4,
          }}
        >
          <Text style={{ color: colors.textSecondary, width: "40%" }}>
            Characteristics
          </Text>
          <Text style={{ color: colors.text, flex: 1, fontWeight: "500" }}>
            {getWeightText(product.category)}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingVertical: 4,
          }}
        >
          <Text style={{ color: colors.textSecondary, width: "40%" }}>
            Flex
          </Text>
          <Text style={{ color: colors.text, flex: 1, fontWeight: "500" }}>
            Medium
          </Text>
        </View>
      </View>
    </View>
  );
};
