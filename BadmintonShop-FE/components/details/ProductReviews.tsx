import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Review } from '../../models/types';
import { AppColors } from '../../constants/colors';

interface ProductReviewsProps {
  productId: string;
  reviews: Review[];
  colors: any;
  isLoggedIn: boolean;
  currentUser: any;
  onSubmitReview: (rating: number, comment: string) => Promise<void>;
  isSubmitting: boolean;
}

export const ProductReviews = ({
  productId,
  reviews,
  colors,
  isLoggedIn,
  currentUser,
  onSubmitReview,
  isSubmitting
}: ProductReviewsProps) => {
  
  // Find current user's review to prefill if exists
  const existingReview = currentUser ? reviews.find(r => r.user?._id === currentUser.id) : null;
  
  const [rating, setRating] = useState(existingReview ? existingReview.rating : 5);
  const [comment, setComment] = useState(existingReview ? (existingReview.comment || '') : '');

  const renderStars = (ratingValue: number, size = 16, onPress?: (val: number) => void) => {
    return (
      <View style={{ flexDirection: 'row' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            disabled={!onPress}
            onPress={() => onPress && onPress(star)}
          >
            <Text style={{ 
              fontSize: size, 
              color: star <= ratingValue ? '#ffc107' : '#e4e5e9',
              marginRight: 4
            }}>
              ★
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Customer Reviews ({reviews.length})
      </Text>

      {/* Write a Review Section */}
      {isLoggedIn ? (
        <View style={[styles.reviewFormContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.formTitle, { color: colors.text }]}>Write a Review</Text>
          <View style={styles.ratingSelect}>
            <Text style={{ color: colors.textSecondary, marginRight: 8 }}>Rating:</Text>
            {renderStars(rating, 24, setRating)}
          </View>
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
            placeholder="Share your thoughts about this product..."
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={3}
            value={comment}
            onChangeText={setComment}
          />
          <TouchableOpacity 
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            disabled={isSubmitting}
            onPress={() => onSubmitReview(rating, comment)}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.submitButtonText}>Submit Review</Text>
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <View style={[styles.loginPrompt, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={{ color: colors.textSecondary }}>Please log in to write a review.</Text>
        </View>
      )}

      {/* Reviews List */}
      <View style={styles.reviewsList}>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <View key={review._id} style={[styles.reviewCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.reviewHeader}>
                <Text style={[styles.reviewAuthor, { color: colors.text }]}>
                  {review.user?.fullname || 'Anonymous'}
                </Text>
                <Text style={[styles.reviewDate, { color: colors.textSecondary }]}>
                  {new Date(review.updatedAt || review.createdAt).toLocaleDateString()}
                </Text>
              </View>
              <View style={{ marginBottom: 8 }}>
                {renderStars(review.rating, 16)}
              </View>
              {!!review.comment && (
                <Text style={[styles.reviewComment, { color: colors.textSecondary }]}>
                  {review.comment}
                </Text>
              )}
            </View>
          ))
        ) : (
          <Text style={{ color: colors.textSecondary, fontStyle: 'italic', marginTop: 8 }}>
            No reviews yet. Be the first to review this product!
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  reviewFormContainer: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  ratingSelect: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    textAlignVertical: 'top',
    marginBottom: 16,
    minHeight: 80,
  },
  submitButton: {
    backgroundColor: AppColors.primaryOrange,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginPrompt: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 20,
  },
  reviewsList: {
    flexDirection: 'column',
    gap: 12,
  },
  reviewCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewAuthor: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  reviewDate: {
    fontSize: 12,
  },
  reviewComment: {
    fontSize: 14,
    lineHeight: 20,
  },
});
