package vttp.project.snacked.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import vttp.project.snacked.dtos.CreateSnackRequest;
import vttp.project.snacked.dtos.SnackResponse;
import vttp.project.snacked.models.Snack;
import vttp.project.snacked.models.SnackCategory;
import vttp.project.snacked.services.SnackService;

@RestController
@RequestMapping("/api/snacks")
public class SnackController {

    @Autowired
    private SnackService snackService;

    @GetMapping
    public ResponseEntity<SnackResponse> getSnacks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) SnackCategory category) {
        
        Page<Snack> snackPage = snackService.getSnacks(PageRequest.of(page, size), category);
        
        SnackResponse response = new SnackResponse(
            snackPage.getContent(),
            snackPage.getTotalElements(),
            snackPage.getTotalPages(),
            snackPage.getSize(),
            snackPage.getNumber()
        );
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Snack> getSnackById(@PathVariable Long id) {
        return ResponseEntity.ok(snackService.getSnackById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Snack> createSnack(
            @Valid @RequestPart("snack") CreateSnackRequest request,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        return ResponseEntity.ok(snackService.createSnack(request, image));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Snack> updateSnack(
            @PathVariable Long id,
            @Valid @RequestPart("snack") CreateSnackRequest request,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        return ResponseEntity.ok(snackService.updateSnack(id, request, image));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteSnack(@PathVariable Long id) {
        snackService.deleteSnack(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<SnackResponse> searchSnacks(
            @RequestParam String query,
            @RequestParam(required = false) SnackCategory category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Page<Snack> snackPage = snackService.searchSnacks(query, category, PageRequest.of(page, size));
        
        SnackResponse response = new SnackResponse(
            snackPage.getContent(),
            snackPage.getTotalElements(),
            snackPage.getTotalPages(),
            snackPage.getSize(),
            snackPage.getNumber()
        );
        
        return ResponseEntity.ok(response);
    }
} 