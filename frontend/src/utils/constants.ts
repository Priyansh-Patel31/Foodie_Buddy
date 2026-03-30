export const ROLES = {
  CUSTOMER: 'ROLE_CUSTOMER',
  ADMIN: 'ROLE_ADMIN',
  MANAGER: 'ROLE_MANAGER',
  CHEF: 'ROLE_CHEF',
  WAITER: 'ROLE_WAITER',
  CLEANER: 'ROLE_CLEANER',
  DELIVERY: 'ROLE_DELIVERY',
} as const;

export type UserRole = typeof ROLES[keyof typeof ROLES];

export const ROLE_LABELS: Record<string, string> = {
  ROLE_CUSTOMER: 'Customer',
  ROLE_ADMIN: 'Admin',
  ROLE_MANAGER: 'Manager',
  ROLE_CHEF: 'Chef',
  ROLE_WAITER: 'Waiter',
  ROLE_CLEANER: 'Cleaner',
  ROLE_DELIVERY: 'Delivery',
};
