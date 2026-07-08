import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  promoCode: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 32,
  },
  promoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  promoText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
