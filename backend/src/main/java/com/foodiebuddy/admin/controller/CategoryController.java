package com.foodiebuddy.admin.controller;

import com.foodiebuddy.admin.dto.ApiResponse;
import com.foodiebuddy.admin.dto.CategoryDTO;
import com.foodiebuddy.admin.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/categories")
@RequiredArgsConstructor
@Tag(name = "Category Management", description = "Category CRUD APIs")
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    @Operation(summary = "List all categories")
    public ResponseEntity<ApiResponse<List<CategoryDTO>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(categoryService.getAllCategories()));
    }

    @PostMapping
    @Operation(summary = "Create a new category")
    public ResponseEntity<ApiResponse<CategoryDTO>> create(@RequestBody CategoryDTO dto) {
        return ResponseEntity.ok(ApiResponse.success("Category created", categoryService.create(dto)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update category")
    public ResponseEntity<ApiResponse<CategoryDTO>> update(@PathVariable String id, @RequestBody CategoryDTO dto) {
        return ResponseEntity.ok(ApiResponse.success("Category updated", categoryService.update(id, dto)));
    }

    @PutMapping("/{id}/toggle")
    @Operation(summary = "Toggle category active status")
    public ResponseEntity<ApiResponse<CategoryDTO>> toggle(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(categoryService.toggleActive(id)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a category")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        categoryService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Category deleted", null));
    }
}
