import { StyleSheet } from 'react-native';
import { AppColors } from '../../../constants/colors';

export const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: AppColors.bgDark,
  },
  card: {
    backgroundColor: '#232325', // surface-container-high
    borderRadius: 24,
    padding: 24,
    borderColor: 'rgba(255, 107, 0, 0.2)', // primary with opacity
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  contentContainer: {
    position: 'relative',
    zIndex: 10,
    width: '100%',
  },
  title: {
    color: AppColors.primaryOrange,
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
    lineHeight: 40,
  },
  description: {
    color: AppColors.textMutedDark,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
    maxWidth: '80%',
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 24,
  },
  button: {
    backgroundColor: AppColors.primaryOrange,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: AppColors.primaryOrange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'column',
  },
  statsNumber: {
    color: '#22C55E', // success-neon
    fontSize: 24,
    fontWeight: '700',
  },
  statsLabel: {
    color: AppColors.textMutedDark,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
