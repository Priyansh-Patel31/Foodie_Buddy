package com.foodiebuddy.admin.config;

/**
 * ThreadLocal context to track if the current thread is operating
 * within the Shared Demo Environment.
 */
public class TenantContext {

    private static final ThreadLocal<Boolean> IS_DEMO = ThreadLocal.withInitial(() -> false);

    /**
     * Set the current tenant mode.
     * @param isDemo true if this thread should use the demo database.
     */
    public static void setDemo(boolean isDemo) {
        IS_DEMO.set(isDemo);
    }

    /**
     * Check if the current thread is in demo mode.
     * @return true if demo mode is active.
     */
    public static boolean isDemo() {
        return IS_DEMO.get();
    }

    /**
     * Clear the ThreadLocal variable to prevent memory leaks in pooled environments.
     */
    public static void clear() {
        IS_DEMO.remove();
    }
}
