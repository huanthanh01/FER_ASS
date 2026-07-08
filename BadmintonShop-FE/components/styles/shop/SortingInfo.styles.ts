import { StyleSheet } from 'react-native';
import { AppColors } from '../../../constants/colors';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 32,
    marginBottom: 24,
  },
  productsFound: {
    fontSize: 12,
    fontWeight: '500',
    color: '#e2bfb0',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sortText: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.primaryOrange,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalContent: {
    position: 'absolute',
    top: 220, // Approx height of headers above
    right: 16,
    backgroundColor: AppColors.white,
    borderRadius: 8,
    padding: 10,
    width: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    display: 'none', // hide title for small dropdown
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sortOptionText: {
    fontSize: 14,
    color: '#333',
  },
  sortOptionTextActive: {
    fontWeight: 'bold',
    color: AppColors.primaryOrange,
  },
});
