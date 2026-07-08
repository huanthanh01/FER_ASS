import { StyleSheet, Dimensions } from 'react-native';
import { AppColors } from '../../../constants/colors';

const { width } = Dimensions.get('window');
const itemWidth = (width - 16 * 3) / 2; // 2 columns, padding 16 on sides, gap 16

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 100, // Space for custom bottom tab bar
  },
  columnWrapper: {
    gap: 16,
    marginBottom: 16,
  },
  card: {
    width: itemWidth,
    backgroundColor: 'rgba(32, 31, 31, 1)', // surface-container
    borderRadius: 16,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 0.8, // 4/5 aspect ratio
    backgroundColor: 'rgba(42, 42, 42, 1)', // surface-container-high
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(19, 19, 19, 0.5)', // surface/50
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  cardContent: {
    padding: 12,
    flex: 1,
  },
  brand: {
    fontSize: 12,
    fontWeight: '600',
    color: AppColors.primaryOrange,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.white,
    marginTop: 4,
    lineHeight: 20,
    minHeight: 40,
  },
  description: {
    fontSize: 12,
    color: '#a0a0a0',
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 'auto',
  },
  priceContainer: {
    flexDirection: 'column',
  },
  oldPrice: {
    fontSize: 12,
    color: '#b7b5b4',
    textDecorationLine: 'line-through',
  },
  price: {
    fontSize: 20,
    fontWeight: '600',
    color: AppColors.white,
  },
  cartButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#ff6b00', // primary-container
    justifyContent: 'center',
    alignItems: 'center',
  },
});
