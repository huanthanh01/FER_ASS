import { StyleSheet, Dimensions } from 'react-native';
import { AppColors } from '../../../constants/colors';

const { width } = Dimensions.get('window');
const itemWidth = (width - 40 - 16) / 2; // padding 20 on sides, gap 16

export const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: AppColors.bgDark,
  },
  header: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: AppColors.white,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: AppColors.textMutedDark,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  card: {
    width: itemWidth,
    height: itemWidth,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: AppColors.borderDark,
    marginBottom: 4,
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 16,
  },
  title: {
    color: AppColors.white,
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    color: AppColors.primaryOrange,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
