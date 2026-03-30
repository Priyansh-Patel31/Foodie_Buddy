package com.foodiebuddy.admin.service;

import com.foodiebuddy.admin.entity.MenuItem;
import com.foodiebuddy.admin.entity.Category;
import com.foodiebuddy.admin.exception.ResourceNotFoundException;
import com.foodiebuddy.admin.repository.MenuItemRepository;
import com.foodiebuddy.admin.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MenuService {

    private final MenuItemRepository menuItemRepository;
    private final CategoryRepository categoryRepository;

    public List<MenuItem> getAllAvailable() {
        return menuItemRepository.findByIsAvailableTrue();
    }

    public List<MenuItem> getAll() {
        return menuItemRepository.findAll();
    }

    public List<MenuItem> getByCategory(String categoryId) {
        return menuItemRepository.findByCategoryIdAndIsAvailableTrue(categoryId);
    }

    public List<MenuItem> searchByName(String name) {
        return menuItemRepository.findByNameContainingIgnoreCase(name);
    }

    public MenuItem getById(String id) {
        return menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found: " + id));
    }

    public MenuItem create(MenuItem item) {
        if (item.getCategoryId() != null) {
            Category cat = categoryRepository.findById(item.getCategoryId()).orElse(null);
            if (cat != null) {
                item.setCategoryName(cat.getName());
            }
        }
        item.onCreate();
        return menuItemRepository.save(item);
    }

    public MenuItem update(String id, MenuItem updated) {
        MenuItem existing = getById(id);
        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setPrice(updated.getPrice());
        existing.setImageUrl(updated.getImageUrl());
        existing.setIsAvailable(updated.getIsAvailable());
        existing.setIsVegetarian(updated.getIsVegetarian());
        if (updated.getCategoryId() != null) {
            existing.setCategoryId(updated.getCategoryId());
            Category cat = categoryRepository.findById(updated.getCategoryId()).orElse(null);
            if (cat != null) {
                existing.setCategoryName(cat.getName());
            }
        }
        if (updated.getIngredients() != null) {
            existing.setIngredients(updated.getIngredients());
        }
        return menuItemRepository.save(existing);
    }

    public void delete(String id) {
        menuItemRepository.deleteById(id);
    }

    public MenuItem toggleAvailability(String id) {
        MenuItem item = getById(id);
        item.setIsAvailable(!Boolean.TRUE.equals(item.getIsAvailable()));
        return menuItemRepository.save(item);
    }
}
