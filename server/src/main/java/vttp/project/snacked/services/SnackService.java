package vttp.project.snacked.services;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import jakarta.persistence.EntityNotFoundException;
import vttp.project.snacked.dtos.CreateSnackRequest;
import vttp.project.snacked.models.Snack;
import vttp.project.snacked.models.SnackCategory;
import vttp.project.snacked.repositories.SnackRepository;

@Service
public class SnackService {

    @Autowired
    private SnackRepository snackRepository;

    @Autowired
    private FileStorageService fileStorageService;

    public Page<Snack> getSnacks(Pageable pageable, SnackCategory category) {
        if (category != null) {
            return snackRepository.findByCategory(category, pageable);
        }
        return snackRepository.findAll(pageable);
    }

    public Snack getSnackById(Long id) {
        return snackRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Snack not found with id: " + id));
    }

    @Transactional
    public Snack createSnack(CreateSnackRequest request, MultipartFile image) {
        Snack snack = new Snack();
        snack.setName(request.getName());
        snack.setBrand(request.getBrand());
        snack.setDescription(request.getDescription());
        snack.setCategory(request.getCategory());
        snack.setPrice(request.getPrice());
        
        LocalDateTime now = LocalDateTime.now();
        snack.setCreatedAt(now);
        snack.setUpdatedAt(now);
        snack.setAverageRating(0.0);
        snack.setTotalReviews(0);

        if (image != null && !image.isEmpty()) {
            String imageUrl = fileStorageService.storeFile(image);
            snack.setImageUrl(imageUrl);
        } else if (request.getImageUrl() != null) {
            snack.setImageUrl(request.getImageUrl());
        }

        return snackRepository.save(snack);
    }

    @Transactional
    public Snack updateSnack(Long id, CreateSnackRequest request, MultipartFile image) {
        Snack snack = getSnackById(id);

        snack.setName(request.getName());
        snack.setBrand(request.getBrand());
        snack.setDescription(request.getDescription());
        snack.setCategory(request.getCategory());
        snack.setPrice(request.getPrice());
        snack.setUpdatedAt(LocalDateTime.now());

        if (image != null && !image.isEmpty()) {
            if (snack.getImageUrl() != null) {
                fileStorageService.deleteFile(snack.getImageUrl());
            }
            String imageUrl = fileStorageService.storeFile(image);
            snack.setImageUrl(imageUrl);
        } else if (request.getImageUrl() != null) {
            snack.setImageUrl(request.getImageUrl());
        }

        return snackRepository.save(snack);
    }

    @Transactional
    public void deleteSnack(Long id) {
        Snack snack = getSnackById(id);
        if (snack.getImageUrl() != null) {
            fileStorageService.deleteFile(snack.getImageUrl());
        }
        snackRepository.deleteById(id);
    }

    public Page<Snack> searchSnacks(String query, SnackCategory category, Pageable pageable) {
        if (category != null) {
            return snackRepository.searchSnacksByQueryAndCategory(query, category, pageable);
        }
        return snackRepository.searchSnacks(query, pageable);
    }
} 