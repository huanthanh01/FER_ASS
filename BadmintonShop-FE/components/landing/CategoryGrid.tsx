import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { styles } from "../styles/landing/CategoryGrid.styles";
import { LinearGradient } from "expo-linear-gradient";

const categories = [
  {
    id: 1,
    title: "BADMINTON RACKET",
    subtitle: "PRO SERIES",
    image:
      "https://yonexshop.tw/photo/BDRC/AX100ZVAYX/zz-AX100ZVAYX_452-1.jpg?1757005401",
    tag: "RACKET"
  },
  {
    id: 2,
    title: "BADMINTON SHOES",
    subtitle: "NON-MARKING",
    image:
      "https://cdn.shopvnb.com/uploads/gallery/3giay-cau-long-yonex-subaxia-gt-men-pale-green-chinh-hang_1782241434.webp",
    tag: "SHOES"
  },
  {
    id: 3,
    title: "BADMINTON SHIRTS",
    subtitle: "DRY-FIT TECH",
    image:
      "https://www.directbadminton.co.uk/images/extralarge/Yon_16556JA-WH.jpg",
    tag: "SHIRTS"
  },
  {
    id: 4,
    title: "BADMINTON SHORTS",
    subtitle: "FLEXIBLE",
    image:
      "https://tse2.mm.bing.net/th/id/OIP.5ffN7UV2b5O43loIJ1JXQAHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    tag: "SHORTS"
  },
  {
    id: 5,
    title: "BADMINTON SKIRTS",
    subtitle: "COMFORT",
    image:
      "https://tse3.mm.bing.net/th/id/OIP.1IHb7Y6FmBoVdsmX-Sc7SwHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    tag: "SKIRTS"
  },
  {
    id: 6,
    title: "BADMINTON BAGS",
    subtitle: "THERMAL GUARD",
    image:
      "https://www.tgsports.co.nz/media/commerce_products/1497/92226EX-MIST-PURPLE.jpg",
    tag: "BAGS"
  },
  {
    id: 7,
    title: "BADMINTON BACKPACKS",
    subtitle: "SPACIOUS",
    image:
      "https://ae01.alicdn.com/kf/S916cbcacee344c41ba8f534053690f7b4/YONEX-Mochila-deportiva-de-gran-capacidad-bolso-de-b-dminton-doble-hombro.jpg",
    tag: "BACKPACKS"
  },
  {
    id: 8,
    title: "BADMINTON ACCESSORIES",
    subtitle: "GRIPS & SHUTTLES",
    image:
      "https://th.bing.com/th/id/R.ffd21d0eb9c382131cfc90b1b2cd7c67?rik=WqVx7vHV%2bLaSBQ&riu=http%3a%2f%2fcdn.sweatband.com%2fYonex_Accessory_Pack.jpg&ehk=4F1SeVLOwc6OYWESm0wypAwZs%2fiUD38wB3qCQe08vdw%3d&risl=&pid=ImgRaw&r=0",
    tag: "ACCESSORIES"
  },
];

export const CategoryGrid = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>BROWSE CATEGORIES</Text>
        <Text style={styles.sectionSubtitle}>Find the perfect gear for your game.</Text>
      </View>
      <View style={styles.grid}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => router.push({ pathname: '/shop', params: { category: cat.tag } })}
          >
            <Image
              source={{ uri: cat.image }}
              style={styles.image}
              resizeMode="cover"
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.2)", "rgba(0,0,0,0.8)"]}
              style={styles.overlay}
            />
            <View style={styles.content}>
              <Text style={styles.title}>{cat.title}</Text>
              <Text style={styles.subtitle}>{cat.subtitle}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
