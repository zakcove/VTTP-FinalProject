package vttp.project.snacked.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import vttp.project.snacked.models.Snack;
import vttp.project.snacked.models.SnackCategory;

public interface SnackRepository extends JpaRepository<Snack, Long> {

    Page<Snack> findByCategory(SnackCategory category, Pageable pageable);

    @Query("SELECT s FROM Snack s WHERE " +
            "LOWER(s.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(s.description) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Snack> searchSnacks(@Param("query") String query, Pageable pageable);

    @Query("SELECT s FROM Snack s WHERE " +
            "(:category IS NULL OR s.category = :category) AND " +
            "(LOWER(s.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(s.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Snack> searchSnacksByQueryAndCategory(
            @Param("query") String query,
            @Param("category") SnackCategory category,
            Pageable pageable);
}