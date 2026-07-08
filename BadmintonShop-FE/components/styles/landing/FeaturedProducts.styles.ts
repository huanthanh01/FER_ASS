import { StyleSheet } from 'react-native';
import { AppColors } from '../../../constants/colors';

export const styles = StyleSheet.create({
  container: {
    paddingVertical: 32,
    backgroundColor: AppColors.bgDark,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: AppColors.white,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: AppColors.textMutedDark,
  },
  viewAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    color: AppColors.primaryOrange,
    fontWeight: '700',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  scrollView: {
    paddingLeft: 20,
    paddingRight: 8, // the last item will add 12px margin right = 20 total
  },
  card: {
    width: 280,
    backgroundColor: '#0f0f10',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AppColors.borderDark,
    overflow: 'hidden',
    marginRight: 16,
  },
  imageContainer: {
    height: 250,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(20,20,20,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    padding: 16,
    flex: 1,
  },
  brand: {
    color: AppColors.textMutedDark,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  productName: {
    color: AppColors.white,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    lineHeight: 22,
    minHeight: 44,
  },
  description: {
    color: AppColors.textMutedDark,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  price: {
    color: AppColors.primaryOrange,
    fontSize: 20,
    fontWeight: '800',
  },
  cartButton: {
    backgroundColor: AppColors.primaryOrange,
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
