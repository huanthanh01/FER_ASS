import { StyleSheet, Platform } from 'react-native';
import { AppColors } from '../../../constants/colors';

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(28, 28, 30, 0.95)', // surface-container-low/95
    borderTopWidth: 1,
    borderTopColor: 'rgba(67, 70, 86, 0.3)', // outline-variant/30
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 24,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12, // For iPhone home indicator
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 16,
  },
  activeTabItem: {
    backgroundColor: AppColors.primaryOrange,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  badgeContainer: {
    position: 'absolute',
    top: 0,
    right: 24,
    backgroundColor: AppColors.primaryOrange,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderWidth: 1,
    borderColor: '#1c1c1e',
  },
  badgeText: {
    color: AppColors.white,
    fontSize: 10,
    fontWeight: '700',
  },
});
