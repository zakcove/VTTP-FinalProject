package vttp.project.snacked.controllers;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import vttp.project.snacked.dtos.CreateReviewRequest;
import vttp.project.snacked.models.Review;
import vttp.project.snacked.models.User;
import vttp.project.snacked.services.ReviewService;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @GetMapping("/snack/{snackId}")
    public ResponseEntity<Page<Review>> getReviewsBySnackId(
            @PathVariable Long snackId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "true") boolean moderatedOnly) {
        return ResponseEntity.ok(reviewService.getReviewsBySnackId(snackId, PageRequest.of(page, size), moderatedOnly));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<Review>> getReviewsByUserId(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "true") boolean moderatedOnly) {
        return ResponseEntity.ok(reviewService.getReviewsByUserId(userId, PageRequest.of(page, size), moderatedOnly));
    }

    @PostMapping
    public ResponseEntity<Review> createReview(
            @Valid @RequestPart("review") CreateReviewRequest request,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(reviewService.createReview(request, image, user.getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        reviewService.deleteReview(id, user.getId());
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/moderate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Review> moderateReview(
            @PathVariable Long id,
            @RequestParam boolean approved) {
        Review review = reviewService.moderateReview(id, approved);
        if (review == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(review);
    }

    @GetMapping("/snack/{snackId}/rating-distribution")
    public ResponseEntity<Map<Integer, Long>> getRatingDistribution(@PathVariable Long snackId) {
        return ResponseEntity.ok(reviewService.getRatingDistribution(snackId));
    }
} 