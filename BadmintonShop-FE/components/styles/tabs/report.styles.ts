import { StyleSheet } from 'react-native';
import { AppColors } from '../../../constants/colors';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.bgDark,
  },
  container: {
    flex: 1,
    backgroundColor: AppColors.bgDark,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.borderDark,
    backgroundColor: AppColors.cardDark,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 107, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerAvatarText: {
    color: AppColors.primaryOrange,
    fontWeight: 'bold',
    fontSize: 18,
  },
  headerTitle: {
    color: AppColors.textDark,
    fontSize: 16,
    fontWeight: '600',
  },
  headerSubtitle: {
    color: '#4ade80',
    fontSize: 12,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyTitle: {
    color: AppColors.textDark,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyText: {
    color: AppColors.textMutedDark,
    textAlign: 'center',
  },
  messageWrapper: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  messageWrapperLeft: {
    justifyContent: 'flex-start',
  },
  messageWrapperRight: {
    justifyContent: 'flex-end',
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
  },
  messageBubbleLeft: {
    backgroundColor: AppColors.cardDark,
    borderBottomLeftRadius: 4,
  },
  messageBubbleRight: {
    backgroundColor: AppColors.primaryOrange,
    borderBottomRightRadius: 4,
  },
  messageText: {
    color: AppColors.textDark,
    fontSize: 15,
  },
  messageTime: {
    fontSize: 10,
    marginTop: 4,
  },
  messageTimeLeft: {
    color: AppColors.textMutedDark,
  },
  messageTimeRight: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    paddingBottom: 85, // Add padding to avoid the bottom tab bar
    borderTopWidth: 1,
    borderTopColor: AppColors.borderDark,
    backgroundColor: AppColors.cardDark,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: AppColors.bgDark,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    color: AppColors.textDark,
    marginRight: 8,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: AppColors.primaryOrange,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
