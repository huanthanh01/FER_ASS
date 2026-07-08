import React from "react";
import {
  View,
  Text,
  Image,
} from "react-native";
import { styles } from "../styles/landing/HeroSection.styles";
import { LinearGradient } from "expo-linear-gradient";
import { AppColors } from "../../constants/colors";

export const HeroSection = () => {
  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBcAQC-Xcay6C_wtqzIRHV6rSXR3paQKwhg5aiOZq_UzRxAYlycuzf1-5UX4oHiIbOc2yQhoA4Wp4Bn8sYDruQGnxtex1qBQEM5Pb_zll2ObMEGkWJP5cRc38zUOwct0k4ptDDESUgRXWHRMFvSFwDgT2Ne-LQrWMvefqkZul8By8QTlFaiViTgCnTQDu3jd4MvAW-jxIuQuPPvtYdX4CO9gt3dECrVpXVfyjJn_owg5mfBSkG2pDalkM_8b4nHp5d9uUGEONOrC8o",
        }}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <LinearGradient
        colors={["transparent", "rgba(10,10,10,0.8)", "rgba(10,10,10,1)"]}
        style={styles.overlay}
      />

      <View style={styles.content}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Elite Performance</Text>
        </View>
        <Text style={styles.title}>DOMINATE{"\n"}THE COURT.</Text>
        <Text style={styles.subtitle}>
          Precision engineered rackets and footwear for players who demand
          maximum velocity and control.
        </Text>
      </View>
    </View>
  );
};
