package com.foodiebuddy.admin.service;

import com.foodiebuddy.admin.entity.Order;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class WebSocketNotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Broadcast new order to manager/kitchen dashboards
     */
    public void notifyNewOrder(Order order) {
        messagingTemplate.convertAndSend("/topic/orders", order);
        messagingTemplate.convertAndSend("/topic/kitchen", order);
        log.info("WebSocket: New order notification sent for order {}", order.getId());
    }

    /**
     * Broadcast order status update to all relevant subscribers
     */
    public void notifyOrderUpdate(Order order) {
        messagingTemplate.convertAndSend("/topic/orders", order);
        messagingTemplate.convertAndSend("/topic/kitchen", order);

        // Send to the specific customer's personal queue
        if (order.getCustomerId() != null) {
            messagingTemplate.convertAndSendToUser(
                    order.getCustomerId(), "/queue/tracking", order);
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
