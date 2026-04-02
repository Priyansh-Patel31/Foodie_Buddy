package com.foodiebuddy.admin.service;

import com.foodiebuddy.admin.entity.Inventory;
import com.foodiebuddy.admin.entity.IngredientRequirement;
import com.foodiebuddy.admin.entity.MenuItem;

import com.foodiebuddy.admin.exception.ResourceNotFoundException;
import com.foodiebuddy.admin.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;

    public List<Inventory> getAll() {
        return inventoryRepository.findAll();
    }

    public List<Inventory> getLowStockItems() {
        return inventoryRepository.findLowStockItems();
    }

    public Inventory getById(String id) {
        return inventoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory item not found: " + id));
    }

    public Inventory create(Inventory item) {
        item.onCreate();
        return inventoryRepository.save(item);
    }

    public Inventory restock(String id, Double quantity) {
        Inventory item = getById(id);
        item.setCurrentStock(item.getCurrentStock() + quantity);
        item.setLastRestockedAt(LocalDateTime.now());
        log.info("Restocked {}: +{} {} (now: {})", item.getName(), quantity, item.getUnit(), item.getCurrentStock());
        return inventoryRepository.save(item);
    }

    /**
     * Auto-deduct ingredients when an order is placed.
     * @param menuItem the menu item ordered
     * @param quantity how many of this item were ordered
     */
    public void deductForMenuItem(MenuItem menuItem, int quantity) {
        if (menuItem.getIngredients() == null || menuItem.getIngredients().isEmpty()) {
            return; // No ingredient tracking for this item
        }

        for (IngredientRequirement req : menuItem.getIngredients()) {
            Inventory inv = inventoryRepository.findById(req.getInventoryItemId()).orElse(null);
            if (inv == null) {
                log.warn("Inventory item not found for deduction: {}", req.getInventoryItemId());
                continue;
            }

            double deductAmount = req.getQuantityRequired() * quantity;
            inv.setCurrentStock(Math.max(0, inv.getCurrentStock() - deductAmount));
            inventoryRepository.save(inv);

            log.info("Deducted {} {} of {} (remaining: {})",
                    deductAmount, inv.getUnit(), inv.getName(), inv.getCurrentStock());

            if (inv.isLowStock()) {
                log.warn("LOW STOCK ALERT: {} is at {} {} (threshold: {})",
                        inv.getName(), inv.getCurrentStock(), inv.getUnit(), inv.getLowStockThreshold());
            }
        }
    }
}
