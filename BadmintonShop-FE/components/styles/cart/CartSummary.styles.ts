import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  summaryContainer: {
    padding: 24,
    borderWidth: 1,
    borderRadius: 24,
    marginTop: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
  },
  summaryValue: {
    fontSize: 16,
  },
  freeDelivery: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalRow: {
    marginTop: 8,
    marginBottom: 24,
  },
  totalLabel: {
    fontSize: 24,
    fontWeight: '700',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '800',
  },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 8,
  },
  checkoutBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
