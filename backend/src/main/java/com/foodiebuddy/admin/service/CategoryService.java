package com.foodiebuddy.admin.service;

import com.foodiebuddy.admin.dto.CategoryDTO;
import com.foodiebuddy.admin.entity.Category;
import com.foodiebuddy.admin.exception.BadRequestException;
import com.foodiebuddy.admin.exception.ResourceNotFoundException;
import com.foodiebuddy.admin.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional
    public CategoryDTO create(CategoryDTO dto) {
        if (categoryRepository.existsByName(dto.getName())) {
            throw new BadRequestException("Category with name '" + dto.getName() + "' already exists");
        }
        Category category = Category.builder().name(dto.getName()).active(true).build();
        return toDTO(categoryRepository.save(category));
    }

    @Transactional
    public CategoryDTO update(String id, CategoryDTO dto) {
        Category category = findById(id);
        category.setName(dto.getName());
        return toDTO(categoryRepository.save(category));
    }

    @Transactional
    public CategoryDTO toggleActive(String id) {
        Category category = findById(id);
        category.setActive(!category.getActive());
        log.info("Category {} active status toggled to {}", id, category.getActive());
        return toDTO(categoryRepository.save(category));
    }

    @Transactional
    public void delete(String id) {
        Category category = findById(id);
        categoryRepository.delete(category);
        log.info("Category {} deleted", id);
    }

    private Category findById(String id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
    }

    private CategoryDTO toDTO(Category c) {
        return CategoryDTO.builder().id(c.getId()).name(c.getName()).active(c.getActive()).build();
    }
}
