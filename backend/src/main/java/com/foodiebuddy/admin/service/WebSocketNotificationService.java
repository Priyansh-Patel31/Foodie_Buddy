package com.foodiebuddy.admin.service;

import com.foodiebuddy.admin.entity.Order;
import com.foodiebuddy.admin.entity.enums.OrderStatus;
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
     * Broadcast new order to manager dashboard.
     * New orders should primarily notify the manager (who will then confirm and assign).
     */
    public void notifyNewOrder(Order order) {
        if (order == null) {
            log.warn("WebSocket: Skipping new-order notification because order payload is null");
            return;
        }
        try {
            messagingTemplate.convertAndSend("/topic/orders", order);
            messagingTemplate.convertAndSend("/topic/manager", order);
            log.info("WebSocket: New order notification sent for order {} to manager & orders channels", order.getId());
        } catch (Exception ex) {
            log.error("WebSocket: Failed to publish new-order notification for {}", order.getId(), ex);
        }
    }

    /**
     * Broadcast order status update to all relevant subscribers based on current status.
     */
    public void notifyOrderUpdate(Order order) {
        if (order == null) {
            log.warn("WebSocket: Skipping order-update notification because order payload is null");
            return;
        }

        // Always broadcast to the general orders channel and manager channel
        try {
            messagingTemplate.convertAndSend("/topic/orders", order);
            messagingTemplate.convertAndSend("/topic/manager", order);
        } catch (Exception ex) {
            log.error("WebSocket: Failed to publish dashboard update for order {}", order.getId(), ex);
        }

        // Notify kitchen channel when order is confirmed (chef needs to see it)
        OrderStatus status = order.getStatus();
        if (status == OrderStatus.CONFIRMED || status == OrderStatus.PREPARING || status == OrderStatus.READY) {
            try {
                messagingTemplate.convertAndSend("/topic/kitchen", order);
            } catch (Exception ex) {
                log.warn("WebSocket: Failed to publish kitchen update for order {}", order.getId(), ex);
            }
        }

        // Notify delivery channel when order is ready for pickup or during delivery
        if (status == OrderStatus.READY || status == OrderStatus.PICKED_UP || status == OrderStatus.OUT_FOR_DELIVERY) {
            try {
                messagingTemplate.convertAndSend("/topic/delivery", order);
            } catch (Exception ex) {
                log.warn("WebSocket: Failed to publish delivery update for order {}", order.getId(), ex);
            }
        }

        // Notify the specific customer about their order tracking
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
        messagingTemplate.convertAndSend("/topic/manager", message);
        log.warn("WebSocket: {}", message);
    }
}
