package com.foodiebuddy.admin.controller;

import com.foodiebuddy.admin.dto.ApiResponse;
import com.foodiebuddy.admin.dto.MenuItemDTO;
import com.foodiebuddy.admin.entity.MenuItem;
import com.foodiebuddy.admin.entity.Category;
import com.foodiebuddy.admin.service.MenuService;
import com.foodiebuddy.admin.repository.CategoryRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/menu")
@RequiredArgsConstructor
@Tag(name = "Menu", description = "Public Menu APIs")
public class MenuController {

    private final MenuService menuService;
    private final CategoryRepository categoryRepository;

    @GetMapping
    @Operation(summary = "Get all available menu items")
    public ResponseEntity<ApiResponse<List<MenuItemDTO>>> getMenu() {
        List<MenuItemDTO> items = menuService.getAllAvailable().stream()
                .map(this::toDTO).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(items));
    }

    @GetMapping("/category/{categoryId}")
    @Operation(summary = "Get menu items by category")
    public ResponseEntity<ApiResponse<List<MenuItemDTO>>> getByCategory(@PathVariable String categoryId) {
        List<MenuItemDTO> items = menuService.getByCategory(categoryId).stream()
                .map(this::toDTO).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(items));
    }

    @GetMapping("/search")
    @Operation(summary = "Search menu items by name")
    public ResponseEntity<ApiResponse<List<MenuItemDTO>>> search(@RequestParam String q) {
        List<MenuItemDTO> items = menuService.searchByName(q).stream()
                .map(this::toDTO).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(items));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get single menu item")
    public ResponseEntity<ApiResponse<MenuItemDTO>> getById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(toDTO(menuService.getById(id))));
    }

    @GetMapping("/categories")
    @Operation(summary = "Get all categories")
    public ResponseEntity<ApiResponse<List<Category>>> getCategories() {
        return ResponseEntity.ok(ApiResponse.success(categoryRepository.findByActiveTrue()));
    }

    private MenuItemDTO toDTO(MenuItem m) {
        return MenuItemDTO.builder()
                .id(m.getId())
                .name(m.getName())
                .description(m.getDescription())
                .price(m.getPrice() != null ? m.getPrice().doubleValue() : 0.0)
                .imageUrl(m.getImageUrl())
                .categoryId(m.getCategoryId())
                .categoryName(m.getCategoryName())
                .isAvailable(m.getIsAvailable())
                .isVegetarian(m.getIsVegetarian())
                .ingredients(m.getIngredients())
                .build();
    }
}
