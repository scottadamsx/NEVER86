/**
 * DATA SCHEMAS & VALIDATION
 * 
 * This file defines the structure and validation rules for all data types in NEVER86.
 * Used by CSV parsers, data importers, and validation functions to ensure data integrity.
 * 
 * Each schema defines:
 * - Required fields
 * - Field types
 * - Allowed values (for enums)
 * - Default values
 * - Validation functions
 */

/**
 * STAFF SCHEMA
 * Represents staff members (managers, servers, kitchen staff)
 */
export const StaffSchema = {
  id: {
    type: 'string',
    required: true,
    pattern: /^staff[-_]\w+$/,
    description: 'Unique identifier (e.g., "staff-1", "staff_001")'
  },
  username: {
    type: 'string',
    required: true,
    minLength: 3,
    maxLength: 50,
    description: 'Login username'
  },
  name: {
    type: 'string',
    required: true,
    minLength: 1,
    maxLength: 100,
    description: 'Full display name'
  },
  email: {
    type: 'string',
    required: false,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    description: 'Email address'
  },
  role: {
    type: 'enum',
    required: true,
    values: ['manager', 'server', 'kitchen'],
    description: 'Staff role'
  },
  pin: {
    type: 'string',
    required: false,
    pattern: /^\d{4}$/,
    description: '4-digit PIN code'
  },
  avatar: {
    type: 'string',
    required: false,
    description: 'Avatar URL or path'
  },
  sections: {
    type: 'array',
    required: false,
    itemType: 'string',
    description: 'Comma-separated section assignments (for servers)'
  },
  hireDate: {
    type: 'date',
    required: false,
    description: 'ISO date string (YYYY-MM-DD)'
  },
  hourlyRate: {
    type: 'number',
    required: false,
    min: 0,
    description: 'Hourly wage'
  },
  status: {
    type: 'enum',
    required: false,
    values: ['active', 'inactive', 'on_leave'],
    default: 'active',
    description: 'Employment status'
  },
  section: {
    type: 'string',
    required: false,
    description: 'Primary section assignment (legacy field)'
  },
  station: {
    type: 'string',
    required: false,
    description: 'Kitchen station (for kitchen staff)'
  },
  displayName: {
    type: 'string',
    required: false,
    description: 'Display name (legacy field, use "name" instead)'
  },
  createdAt: {
    type: 'date',
    required: false,
    description: 'Creation date (ISO string)'
  }
};

/**
 * TABLE SCHEMA
 * Represents restaurant tables
 */
export const TableSchema = {
  id: {
    type: 'string',
    required: true,
    pattern: /^t\d+$/,
    description: 'Unique identifier (e.g., "t1", "t2")'
  },
  number: {
    type: 'number',
    required: true,
    min: 1,
    description: 'Table number'
  },
  section: {
    type: 'string',
    required: true,
    minLength: 1,
    maxLength: 10,
    description: 'Section name (e.g., "A", "B", "Bar")'
  },
  seats: {
    type: 'number',
    required: true,
    min: 1,
    max: 20,
    description: 'Number of seats'
  },
  shape: {
    type: 'enum',
    required: false,
    values: ['round', 'square', 'rectangle', 'bar'],
    default: 'square',
    description: 'Table shape'
  },
  positionX: {
    type: 'number',
    required: false,
    min: 0,
    max: 100,
    description: 'X position on floor plan (percentage or grid coordinate)'
  },
  positionY: {
    type: 'number',
    required: false,
    min: 0,
    max: 100,
    description: 'Y position on floor plan (percentage or grid coordinate)'
  },
  status: {
    type: 'enum',
    required: false,
    values: ['available', 'occupied', 'reserved', 'cleaning'],
    default: 'available',
    description: 'Current table status'
  },
  serverId: {
    type: 'string',
    required: false,
    nullable: true,
    description: 'ID of assigned server'
  },
  guestCount: {
    type: 'number',
    required: false,
    min: 0,
    default: 0,
    description: 'Current number of guests'
  },
  seatedAt: {
    type: 'datetime',
    required: false,
    nullable: true,
    description: 'ISO datetime when guests were seated'
  },
  currentOrderId: {
    type: 'string',
    required: false,
    nullable: true,
    description: 'ID of current active order'
  }
};

/**
 * MENU ITEM SCHEMA
 * Represents menu items
 */
export const MenuItemSchema = {
  id: {
    type: 'string',
    required: true,
    pattern: /^menu[-_]\w+$/,
    description: 'Unique identifier (e.g., "menu-1", "menu_001")'
  },
  name: {
    type: 'string',
    required: true,
    minLength: 1,
    maxLength: 200,
    description: 'Item name'
  },
  description: {
    type: 'string',
    required: false,
    maxLength: 500,
    default: '',
    description: 'Item description'
  },
  price: {
    type: 'number',
    required: true,
    min: 0,
    description: 'Price in dollars'
  },
  category: {
    type: 'enum',
    required: true,
    values: ['appetizers', 'entrees', 'mains', 'desserts', 'drinks', 'sides', 'salads', 'soups', 'sandwiches', 'pizza'],
    description: 'Menu category'
  },
  cost: {
    type: 'number',
    required: false,
    min: 0,
    description: 'Food cost (for profitability)'
  },
  available: {
    type: 'boolean',
    required: false,
    default: true,
    description: 'Whether item is currently available'
  },
  prepTime: {
    type: 'number',
    required: false,
    min: 0,
    default: 10,
    description: 'Estimated prep time in minutes'
  },
  onMenu: {
    type: 'boolean',
    required: false,
    default: true,
    description: 'Whether item is on the menu'
  },
  modifiers: {
    type: 'array',
    required: false,
    default: [],
    description: 'Array of modifier groups (JSON string in CSV)'
  },
  imageUrl: {
    type: 'string',
    required: false,
    nullable: true,
    description: 'Image URL'
  }
};

/**
 * INVENTORY ITEM SCHEMA
 * Represents inventory stock items
 */
export const InventoryItemSchema = {
  id: {
    type: 'string',
    required: true,
    pattern: /^inv[-_]\w+$/,
    description: 'Unique identifier (e.g., "inv-1", "inv_001")'
  },
  name: {
    type: 'string',
    required: true,
    minLength: 1,
    maxLength: 200,
    description: 'Item name'
  },
  category: {
    type: 'string',
    required: false,
    maxLength: 50,
    description: 'Category (e.g., "protein", "produce", "dairy")'
  },
  quantity: {
    type: 'number',
    required: true,
    min: 0,
    description: 'Current quantity'
  },
  unit: {
    type: 'string',
    required: true,
    minLength: 1,
    maxLength: 50,
    description: 'Unit of measurement (e.g., "lbs", "portions", "bottles")'
  },
  reorderLevel: {
    type: 'number',
    required: false,
    min: 0,
    description: 'Minimum threshold for reordering (legacy: minThreshold)'
  },
  minThreshold: {
    type: 'number',
    required: false,
    min: 0,
    description: 'Minimum threshold (legacy field, use reorderLevel)'
  },
  cost: {
    type: 'number',
    required: false,
    min: 0,
    description: 'Cost per unit'
  },
  supplier: {
    type: 'string',
    required: false,
    maxLength: 100,
    description: 'Supplier name'
  }
};

/**
 * ORDER SCHEMA
 * Represents customer orders
 */
export const OrderSchema = {
  id: {
    type: 'string',
    required: true,
    pattern: /^order[-_]\w+$/,
    description: 'Unique identifier (e.g., "order-1", "order_001")'
  },
  tableId: {
    type: 'string',
    required: true,
    description: 'ID of the table'
  },
  serverId: {
    type: 'string',
    required: true,
    description: 'ID of the server'
  },
  guestCount: {
    type: 'number',
    required: true,
    min: 1,
    description: 'Number of guests'
  },
  status: {
    type: 'enum',
    required: false,
    values: ['active', 'completed', 'cancelled', 'pending', 'sent', 'preparing', 'ready'],
    default: 'active',
    description: 'Order status'
  },
  items: {
    type: 'array',
    required: false,
    default: [],
    description: 'Array of order items (JSON string in CSV)'
  },
  subtotal: {
    type: 'number',
    required: false,
    min: 0,
    description: 'Subtotal before tax and tip'
  },
  tax: {
    type: 'number',
    required: false,
    min: 0,
    description: 'Tax amount'
  },
  tip: {
    type: 'number',
    required: false,
    min: 0,
    default: 0,
    description: 'Tip amount'
  },
  total: {
    type: 'number',
    required: false,
    min: 0,
    description: 'Total amount'
  },
  createdAt: {
    type: 'datetime',
    required: true,
    description: 'ISO datetime when order was created'
  },
  closedAt: {
    type: 'datetime',
    required: false,
    nullable: true,
    description: 'ISO datetime when order was closed'
  },
  shift: {
    type: 'enum',
    required: false,
    values: ['lunch', 'dinner'],
    description: 'Shift when order was placed'
  }
};

/**
 * ORDER ITEM SCHEMA
 * Represents individual items within an order
 */
export const OrderItemSchema = {
  id: {
    type: 'string',
    required: true,
    description: 'Unique identifier (e.g., "oi-1")'
  },
  orderId: {
    type: 'string',
    required: true,
    description: 'ID of the parent order'
  },
  menuItemId: {
    type: 'string',
    required: false,
    nullable: true,
    description: 'ID of the menu item'
  },
  name: {
    type: 'string',
    required: true,
    minLength: 1,
    maxLength: 200,
    description: 'Item name'
  },
  guestNumber: {
    type: 'number',
    required: false,
    min: 1,
    default: 1,
    description: 'Which guest ordered this item'
  },
  modifications: {
    type: 'string',
    required: false,
    maxLength: 500,
    default: '',
    description: 'Modification requests'
  },
  notes: {
    type: 'string',
    required: false,
    maxLength: 500,
    default: '',
    description: 'Special notes'
  },
  price: {
    type: 'number',
    required: true,
    min: 0,
    description: 'Price of this item'
  },
  sentToKitchen: {
    type: 'boolean',
    required: false,
    default: false,
    description: 'Whether item has been sent to kitchen'
  }
};

/**
 * CHIT SCHEMA (Kitchen Ticket)
 * Represents kitchen orders/tickets
 */
export const ChitSchema = {
  id: {
    type: 'string',
    required: true,
    pattern: /^chit[-_]\w+$/,
    description: 'Unique identifier (e.g., "chit-1")'
  },
  orderId: {
    type: 'string',
    required: true,
    description: 'ID of the parent order'
  },
  tableNumber: {
    type: 'number',
    required: true,
    min: 1,
    description: 'Table number'
  },
  serverName: {
    type: 'string',
    required: true,
    minLength: 1,
    maxLength: 100,
    description: 'Server name'
  },
  status: {
    type: 'enum',
    required: false,
    values: ['pending', 'ready', 'completed'],
    default: 'pending',
    description: 'Chit status'
  },
  items: {
    type: 'array',
    required: false,
    default: [],
    description: 'Array of chit items (JSON string in CSV)'
  },
  createdAt: {
    type: 'datetime',
    required: true,
    description: 'ISO datetime when chit was created'
  },
  completedAt: {
    type: 'datetime',
    required: false,
    nullable: true,
    description: 'ISO datetime when chit was completed'
  },
  run: {
    type: 'boolean',
    required: false,
    default: false,
    description: 'Whether food has been run to table'
  }
};

/**
 * SCENARIO METADATA SCHEMA
 * Represents scenario information
 */
export const ScenarioSchema = {
  scenarioName: {
    type: 'string',
    required: true,
    minLength: 1,
    maxLength: 100,
    description: 'Scenario name'
  },
  restaurantName: {
    type: 'string',
    required: true,
    minLength: 1,
    maxLength: 100,
    description: 'Restaurant name'
  },
  description: {
    type: 'string',
    required: false,
    maxLength: 500,
    default: '',
    description: 'Scenario description'
  },
  createdAt: {
    type: 'datetime',
    required: false,
    description: 'ISO datetime when scenario was created'
  }
};

/**
 * VALIDATION FUNCTIONS
 */

/**
 * Validates a value against a field schema
 */
export function validateField(value, fieldSchema, fieldName) {
  const errors = [];

  // Check required
  if (fieldSchema.required && (value === null || value === undefined || value === '')) {
    errors.push(`${fieldName} is required`);
    return { valid: false, errors };
  }

  // Skip validation if value is empty and not required
  if (!fieldSchema.required && (value === null || value === undefined || value === '')) {
    return { valid: true, errors: [] };
  }

  // Type validation
  if (fieldSchema.type === 'string') {
    if (typeof value !== 'string') {
      errors.push(`${fieldName} must be a string`);
    } else if (fieldSchema.minLength && value.length < fieldSchema.minLength) {
      errors.push(`${fieldName} must be at least ${fieldSchema.minLength} characters`);
    } else if (fieldSchema.maxLength && value.length > fieldSchema.maxLength) {
      errors.push(`${fieldName} must be at most ${fieldSchema.maxLength} characters`);
    } else if (fieldSchema.pattern && !fieldSchema.pattern.test(value)) {
      errors.push(`${fieldName} format is invalid`);
    }
  } else if (fieldSchema.type === 'number') {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) {
      errors.push(`${fieldName} must be a number`);
    } else {
      if (fieldSchema.min !== undefined && numValue < fieldSchema.min) {
        errors.push(`${fieldName} must be at least ${fieldSchema.min}`);
      }
      if (fieldSchema.max !== undefined && numValue > fieldSchema.max) {
        errors.push(`${fieldName} must be at most ${fieldSchema.max}`);
      }
    }
  } else if (fieldSchema.type === 'boolean') {
    if (typeof value !== 'boolean') {
      // Try to parse string booleans
      const lower = String(value).toLowerCase();
      if (lower !== 'true' && lower !== 'false' && lower !== '1' && lower !== '0') {
        errors.push(`${fieldName} must be a boolean`);
      }
    }
  } else if (fieldSchema.type === 'enum') {
    if (!fieldSchema.values.includes(value)) {
      errors.push(`${fieldName} must be one of: ${fieldSchema.values.join(', ')}`);
    }
  } else if (fieldSchema.type === 'date' || fieldSchema.type === 'datetime') {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      errors.push(`${fieldName} must be a valid date`);
    }
  } else if (fieldSchema.type === 'array') {
    if (!Array.isArray(value)) {
      // Try to parse JSON string
      try {
        const parsed = JSON.parse(value);
        if (!Array.isArray(parsed)) {
          errors.push(`${fieldName} must be an array`);
        }
      } catch {
        errors.push(`${fieldName} must be an array or valid JSON array string`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validates an object against a schema
 */
export function validateObject(obj, schema) {
  const errors = [];
  const warnings = [];

  // Check all required fields
  for (const [fieldName, fieldSchema] of Object.entries(schema)) {
    const value = obj[fieldName];
    const result = validateField(value, fieldSchema, fieldName);
    
    if (!result.valid) {
      errors.push(...result.errors);
    }
  }

  // Check for unknown fields (warnings, not errors)
  for (const fieldName of Object.keys(obj)) {
    if (!schema[fieldName]) {
      warnings.push(`Unknown field: ${fieldName}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Coerces a CSV value to the correct type based on schema
 */
export function coerceValue(value, fieldSchema) {
  if (value === null || value === undefined || value === '') {
    if (fieldSchema.default !== undefined) {
      return fieldSchema.default;
    }
    if (fieldSchema.nullable) {
      return null;
    }
    return value;
  }

  if (fieldSchema.type === 'number') {
    const num = parseFloat(value);
    return isNaN(num) ? value : num;
  } else if (fieldSchema.type === 'boolean') {
    const lower = String(value).toLowerCase();
    return lower === 'true' || lower === '1';
  } else if (fieldSchema.type === 'date' || fieldSchema.type === 'datetime') {
    return new Date(value).toISOString();
  } else if (fieldSchema.type === 'array') {
    try {
      return JSON.parse(value);
    } catch {
      // Try comma-separated string
      if (typeof value === 'string' && value.includes(',')) {
        return value.split(',').map(v => v.trim());
      }
      return [];
    }
  } else if (fieldSchema.type === 'string') {
    return String(value);
  }

  return value;
}

/**
 * Transforms a CSV row object to match the application's data structure
 */
export function transformCSVRow(row, schema) {
  const transformed = {};

  for (const [fieldName, fieldSchema] of Object.entries(schema)) {
    // Try exact match first
    if (row[fieldName] !== undefined) {
      transformed[fieldName] = coerceValue(row[fieldName], fieldSchema);
    }
    // Try camelCase
    else if (row[toCamelCase(fieldName)] !== undefined) {
      transformed[fieldName] = coerceValue(row[toCamelCase(fieldName)], fieldSchema);
    }
    // Try snake_case
    else if (row[toSnakeCase(fieldName)] !== undefined) {
      transformed[fieldName] = coerceValue(row[toSnakeCase(fieldName)], fieldSchema);
    }
    // Use default if available
    else if (fieldSchema.default !== undefined) {
      transformed[fieldName] = fieldSchema.default;
    }
  }

  return transformed;
}

/**
 * Helper: Convert to camelCase
 */
function toCamelCase(str) {
  return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
}

/**
 * Helper: Convert to snake_case
 */
function toSnakeCase(str) {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

/**
 * Export all schemas as a map for easy lookup
 */
export const Schemas = {
  staff: StaffSchema,
  table: TableSchema,
  menuItem: MenuItemSchema,
  inventory: InventoryItemSchema,
  order: OrderSchema,
  orderItem: OrderItemSchema,
  chit: ChitSchema,
  scenario: ScenarioSchema
};
