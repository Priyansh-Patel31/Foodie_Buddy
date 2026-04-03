package com.foodiebuddy.admin.service;

import com.foodiebuddy.admin.entity.Order;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Slf4j
@Service
@RequiredArgsConstructor
public class WebSocketNotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Broadcast new order to manager/kitchen dashboards
     */
    public void notifyNewOrder(Order order) {
        if (order == null) {
            log.warn("WebSocket: Skipping new-order notification because order payload is null");
            return;
        }
        try {
            messagingTemplate.convertAndSend("/topic/orders", order);
            messagingTemplate.convertAndSend("/topic/kitchen", order);
            log.info("WebSocket: New order notification sent for order {}", order.getId());
        } catch (Exception ex) {
            log.error("WebSocket: Failed to publish new-order notification for {}", order.getId(), ex);
        }
    }

    /**
     * Broadcast order status update to all relevant subscribers
     */
    public void notifyOrderUpdate(Order order) {
        if (order == null) {
            log.warn("WebSocket: Skipping order-update notification because order payload is null");
            return;
        }
        try {
            messagingTemplate.convertAndSend("/topic/orders", order);
            messagingTemplate.convertAndSend("/topic/kitchen", order);
        } catch (Exception ex) {
            log.error("WebSocket: Failed to publish dashboard update for order {}", order.getId(), ex);
        }

        String customerId = order.getCustomerId();
        if (StringUtils.hasText(customerId)) {
            try {
                messagingTemplate.convertAndSendToUser(customerId, "/queue/tracking", order);
            } catch (Exception ex) {
                log.warn("WebSocket: Failed to publish customer tracking update for order {}", order.getId(), ex);
            }
        }

        log.info("WebSocket: Order {} status updated to {}", order.getId(), order.getStatus());
    }

    /**
     * Broadcast low-stock alert to manager
     */
    public void notifyLowStock(String itemName, Double currentStock) {
        String message = String.format("LOW STOCK: %s is at %.1f units", itemName, currentStock);
        messagingTemplate.convertAndSend("/topic/inventory-alerts", message);
        log.warn("WebSocket: {}", message);
    }
}
