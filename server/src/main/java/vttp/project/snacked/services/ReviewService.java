package vttp.project.snacked.services;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.access.AccessDeniedException;

import jakarta.persistence.EntityNotFoundException;
import vttp.project.snacked.dtos.CreateReviewRequest;
import vttp.project.snacked.models.Review;
import vttp.project.snacked.models.Snack;
import vttp.project.snacked.repositories.ReviewRepository;
import vttp.project.snacked.repositories.SnackRepository;
import vttp.project.snacked.repositories.UserRepository;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private SnackRepository snackRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileStorageService fileStorageService;

    public Page<Review> getReviewsBySnackId(Long snackId, Pageable pageable, boolean moderatedOnly) {
        if (moderatedOnly) {
            return reviewRepository.findModeratedReviewsBySnackId(snackId, pageable);
        }
        return reviewRepository.findBySnackId(snackId, pageable);
    }

    public Page<Review> getReviewsByUserId(Long userId, Pageable pageable, boolean moderatedOnly) {
        if (moderatedOnly) {
            return reviewRepository.findModeratedReviewsByUserId(userId, pageable);
        }
        return reviewRepository.findByUserId(userId, pageable);
    }

    @Transactional
    public Review createReview(CreateReviewRequest request, MultipartFile image, Long userId) {
        Snack snack = snackRepository.findById(request.getSnackId())
            .orElseThrow(() -> new RuntimeException("Snack not found"));

        Review review = new Review();
        review.setSnack(snack);
        review.setUser(userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found")));
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setLocationName(request.getLocationName());
        review.setPublic(request.isPublic());
        review.setModerated(false);

        if (image != null && !image.isEmpty()) {
            String imageUrl = fileStorageService.storeFile(image);
            review.setImageUrl(imageUrl);
        }

        return reviewRepository.save(review);
    }

    @Transactional
    public void deleteReview(Long reviewId, Long userId) {
        Review review = reviewRepository.findById(reviewId)
            .orElseThrow(() -> new RuntimeException("Review not found"));

        if (!review.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("You can only delete your own reviews");
        }

        if (review.getImageUrl() != null) {
            fileStorageService.deleteFile(review.getImageUrl());
        }

        reviewRepository.delete(review);
    }

    @Transactional
    public Review moderateReview(Long reviewId, boolean approved) {
        Review review = reviewRepository.findById(reviewId)
            .orElseThrow(() -> new RuntimeException("Review not found"));

        review.setModerated(true);
        review.setApproved(approved);

        return reviewRepository.save(review);
    }

    private void updateSnackRatingStats(Long snackId) {
        Snack snack = snackRepository.findById(snackId)
            .orElseThrow(() -> new EntityNotFoundException("Snack not found"));

        Double averageRating = reviewRepository.getAverageRatingBySnackId(snackId);
        Long totalReviews = reviewRepository.getReviewCountBySnackId(snackId);

        snack.setAverageRating(averageRating != null ? averageRating : 0.0);
        snack.setTotalReviews(totalReviews != null ? totalReviews.intValue() : 0);
        snackRepository.save(snack);
    }

    public Map<Integer, Long> getRatingDistribution(Long snackId) {
        Object[][] distribution = reviewRepository.getRatingDistributionBySnackId(snackId);
        Map<Integer, Long> result = new HashMap<>();
 
        for (int i = 1; i <= 5; i++) {
            result.put(i, 0L);
        }

        for (Object[] row : distribution) {
            Integer rating = ((Number) row[0]).intValue();
            Long count = ((Number) row[1]).longValue();
            result.put(rating, count);
        }
        
        return result;
    }
} 