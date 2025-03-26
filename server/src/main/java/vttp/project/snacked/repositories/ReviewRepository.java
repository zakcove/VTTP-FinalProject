package vttp.project.snacked.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import vttp.project.snacked.models.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    Page<Review> findBySnackId(Long snackId, Pageable pageable);

    Page<Review> findByUserId(Long userId, Pageable pageable);

    @Query("SELECT r FROM Review r WHERE r.snack.id = :snackId AND r.isModerated = true")
    Page<Review> findModeratedReviewsBySnackId(@Param("snackId") Long snackId, Pageable pageable);

    @Query("SELECT r FROM Review r WHERE r.user.id = :userId AND r.isModerated = true")
    Page<Review> findModeratedReviewsByUserId(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.snack.id = :snackId AND r.isModerated = true")
    Double getAverageRatingBySnackId(@Param("snackId") Long snackId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.snack.id = :snackId AND r.isModerated = true")
    Long getReviewCountBySnackId(@Param("snackId") Long snackId);

    @Query("SELECT r.rating as rating, COUNT(r) as count FROM Review r " +
            "WHERE r.snack.id = :snackId AND r.isModerated = true " +
            "GROUP BY r.rating")
    Object[][] getRatingDistributionBySnackId(@Param("snackId") Long snackId);
}