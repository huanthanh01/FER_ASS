import { StyleSheet } from 'react-native';
import { AppColors } from '../../../constants/colors';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    paddingHorizontal: 16,
  },
  searchContainer: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
  },
  searchInput: {
    backgroundColor: 'rgba(32, 31, 31, 1)', // surface-container
    borderRadius: 8,
    paddingVertical: 12,
    paddingLeft: 40,
    paddingRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(90, 65, 54, 1)', // outline-variant
    color: AppColors.white,
    fontSize: 16,
  },
  filterButton: {
    backgroundColor: 'rgba(32, 31, 31, 1)',
    borderWidth: 1,
    borderColor: 'rgba(90, 65, 54, 1)',
    borderRadius: 8,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
