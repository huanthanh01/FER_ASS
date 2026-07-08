import { StyleSheet } from 'react-native';
import { AppColors } from '../../../constants/colors';

export const styles = StyleSheet.create({
  container: {
    height: 500,
    width: '100%',
    position: 'relative',
    backgroundColor: AppColors.bgDark,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 10, 10, 0.4)', // Dark gradient simulation
  },
  content: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    zIndex: 20,
  },
  badge: {
    backgroundColor: AppColors.primaryOrange,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 16,
    transform: [{ skewX: '-12deg' }],
  },
  badgeText: {
    color: AppColors.white,
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
    transform: [{ skewX: '12deg' }],
  },
  title: {
    fontSize: 40,
    fontWeight: '800',
    color: AppColors.white,
    marginBottom: 16,
    lineHeight: 48,
  },
  subtitle: {
    fontSize: 16,
    color: AppColors.textMutedDark,
    marginBottom: 32,
    lineHeight: 24,
    maxWidth: 300,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 16,
  },
  primaryButton: {
    backgroundColor: AppColors.primaryOrange,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  primaryButtonText: {
    color: AppColors.white,
    fontWeight: '600',
    fontSize: 16,
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: AppColors.primaryOrange,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  secondaryButtonText: {
    color: AppColors.primaryOrange,
    fontWeight: '600',
    fontSize: 16,
  },
});
