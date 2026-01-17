# NEVER86 CSV Format Guide

**For AI Assistants**: Use this guide to generate properly formatted CSV test data for the NEVER86 restaurant management system.

---

## Overview

NEVER86 accepts CSV files to import test scenarios. Each CSV file represents one data type. Multiple CSV files can be uploaded together to create a complete scenario.

**Required CSV Files:**
- `staff.csv` - Staff members
- `tables.csv` - Restaurant tables
- `menuItems.csv` - Menu items
- `inventory.csv` - Inventory items
- `orders.csv` - Historical orders (optional)
- `scenarios.csv` - Scenario metadata (optional)

---

## CSV Format: staff.csv

### Purpose
Defines all staff members (managers, servers, kitchen staff).

### Column Headers
```
id,username,name,email,role,pin,avatar,sections,hireDate,hourlyRate,status
```

### Field Descriptions

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `id` | string | Yes | Unique identifier | `staff-1`, `staff_001` |
| `username` | string | Yes | Login username (3-50 chars) | `mrodriguez2847` |
| `name` | string | Yes | Full display name | `Maria Rodriguez` |
| `email` | string | No | Email address | `maria@restaurant.com` |
| `role` | enum | Yes | Staff role | `manager`, `server`, `kitchen` |
| `pin` | string | No | 4-digit PIN code | `1234` |
| `avatar` | string | No | Avatar URL/path | `avatars/maria.jpg` |
| `sections` | string | No | Comma-separated sections | `A,B` |
| `hireDate` | date | No | ISO date (YYYY-MM-DD) | `2024-03-15` |
| `hourlyRate` | number | No | Hourly wage | `18.50` |
| `status` | enum | No | Employment status | `active`, `inactive`, `on_leave` |

### Example Rows

```csv
id,username,name,email,role,pin,avatar,sections,hireDate,hourlyRate,status
staff-1,manager949,Sarah Johnson,sarah@restaurant.com,manager,1234,,,2024-01-15,25.00,active
staff-2,mrodriguez2847,Maria Rodriguez,maria@restaurant.com,server,5678,,A,2024-03-15,18.50,active
staff-3,jthompson5921,Jake Thompson,jake@restaurant.com,server,9012,,A,2024-02-20,18.50,active
staff-4,chef949,Chef Anderson,chef@restaurant.com,kitchen,3456,,,2024-01-10,22.00,active
```

### Generation Guidelines

- **IDs**: Use format `staff-{number}` or `staff_{number}`. Start from 1.
- **Usernames**: Create realistic usernames (first initial + lastname + random 4 digits)
- **Names**: Use realistic first and last names
- **Roles**: 
  - `manager`: Usually 1-2 managers
  - `server`: 5-15 servers for realistic scenarios
  - `kitchen`: 2-5 kitchen staff
- **Sections**: For servers, assign sections like `A`, `B`, `C`, or `Bar`
- **Status**: Most should be `active`, some can be `inactive` for variety

---

## CSV Format: tables.csv

### Purpose
Defines all restaurant tables and their properties.

### Column Headers
```
id,number,section,seats,shape,positionX,positionY,status
```

### Field Descriptions

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `id` | string | Yes | Unique identifier | `t1`, `t_001` |
| `number` | number | Yes | Table number (1+) | `1`, `2`, `15` |
| `section` | string | Yes | Section name | `A`, `B`, `Bar`, `Patio` |
| `seats` | number | Yes | Number of seats (1-20) | `2`, `4`, `6`, `8` |
| `shape` | enum | No | Table shape | `round`, `square`, `rectangle`, `bar` |
| `positionX` | number | No | X position (0-100) | `25`, `50`, `75` |
| `positionY` | number | No | Y position (0-100) | `25`, `50`, `75` |
| `status` | enum | No | Current status | `available`, `occupied`, `reserved`, `cleaning` |

### Example Rows

```csv
id,number,section,seats,shape,positionX,positionY,status
t1,1,A,4,square,10,20,available
t2,2,A,4,round,30,20,occupied
t3,3,A,2,square,50,20,available
t4,4,B,6,rectangle,10,50,available
t5,5,B,4,square,30,50,occupied
t6,6,Bar,2,bar,70,10,available
```

### Generation Guidelines

- **IDs**: Use format `t{number}` matching the table number
- **Sections**: Use consistent section names (A, B, C, Bar, Patio)
- **Seats**: Common sizes: 2-top, 4-top, 6-top, 8-top. Mix them realistically.
- **Shape**: 
  - `round`: Common for 2-4 tops
  - `square`: Common for 4 tops
  - `rectangle`: Common for 6+ tops
  - `bar`: For bar seating
- **Positions**: Use 0-100 scale (percentages) for flexible floor plan layout
- **Status**: For initial scenarios, most should be `available`, some `occupied` for active service

---

## CSV Format: menuItems.csv

### Purpose
Defines all menu items with prices, categories, and modifiers.

### Column Headers
```
id,name,description,price,category,cost,available,prepTime,modifiers
```

### Field Descriptions

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `id` | string | Yes | Unique identifier | `menu-1`, `menu_001` |
| `name` | string | Yes | Item name | `Ribeye Steak` |
| `description` | string | No | Item description | `12oz aged ribeye with herb butter` |
| `price` | number | Yes | Price in dollars | `42.00` |
| `category` | enum | Yes | Menu category | See categories below |
| `cost` | number | No | Food cost | `15.00` |
| `available` | boolean | No | Currently available | `true`, `false` |
| `prepTime` | number | No | Prep time in minutes | `18` |
| `modifiers` | JSON | No | Modifier groups (JSON string) | See modifiers section |

### Categories

Use these exact category values:
- `appetizers` - Starters, small plates
- `entrees` - Main courses (alternative to `mains`)
- `mains` - Main courses
- `desserts` - Desserts
- `drinks` - Beverages, cocktails, wine, beer
- `sides` - Side dishes
- `salads` - Salads
- `soups` - Soups
- `sandwiches` - Sandwiches, burgers
- `pizza` - Pizza

### Modifiers Format

Modifiers must be a JSON string (escaped for CSV). Example:

```json
[
  {
    "name": "Temperature",
    "required": true,
    "options": [
      {"name": "Rare", "price": 0},
      {"name": "Medium Rare", "price": 0},
      {"name": "Medium", "price": 0},
      {"name": "Medium Well", "price": 0},
      {"name": "Well Done", "price": 0}
    ]
  },
  {
    "name": "Side",
    "required": false,
    "options": [
      {"name": "No Side", "price": 0},
      {"name": "Mashed Potatoes", "price": 0},
      {"name": "Fries", "price": 0}
    ]
  }
]
```

In CSV, this would be escaped as:
```csv
"[{""name"":""Temperature"",""required"":true,""options"":[{""name"":""Rare"",""price"":0}]}]"
```

### Example Rows

```csv
id,name,description,price,category,cost,available,prepTime,modifiers
menu-1,Ribeye Steak,12oz aged ribeye with herb butter,42.00,mains,15.00,true,18,"[{""name"":""Temperature"",""required"":true,""options"":[{""name"":""Rare"",""price"":0}]}]"
menu-2,Grilled Salmon,Atlantic salmon with lemon dill sauce,36.00,mains,12.00,true,15,
menu-5,Caesar Salad,Romaine parmesan croutons,14.00,appetizers,4.00,true,5,
menu-11,House Red Wine,Glass of house cabernet,12.00,drinks,3.00,true,1,
```

### Generation Guidelines

- **IDs**: Use format `menu-{number}` starting from 1
- **Prices**: Use realistic restaurant prices (appetizers $8-18, mains $20-50, drinks $4-15)
- **Costs**: Food cost typically 30-40% of price
- **Prep Times**: 
  - Appetizers: 3-8 minutes
  - Mains: 12-25 minutes
  - Drinks: 1-2 minutes
  - Desserts: 5-10 minutes
- **Modifiers**: Only include for items that need customization (steaks, salads with protein options, etc.)
- **Available**: Most items should be `true`, some can be `false` for "86'd" items

---

## CSV Format: inventory.csv

### Purpose
Defines inventory stock items.

### Column Headers
```
id,name,category,quantity,unit,reorderLevel,cost,supplier
```

### Field Descriptions

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `id` | string | Yes | Unique identifier | `inv-1`, `inv_001` |
| `name` | string | Yes | Item name | `Ribeye` |
| `category` | string | No | Category | `protein`, `produce`, `dairy` |
| `quantity` | number | Yes | Current quantity | `24`, `8.5` |
| `unit` | string | Yes | Unit of measurement | `portions`, `lbs`, `bottles` |
| `reorderLevel` | number | No | Minimum threshold | `10`, `5` |
| `cost` | number | No | Cost per unit | `12.50` |
| `supplier` | string | No | Supplier name | `ABC Meats` |

### Example Rows

```csv
id,name,category,quantity,unit,reorderLevel,cost,supplier
inv-1,Ribeye,protein,24,portions,10,12.50,ABC Meats
inv-2,Salmon Fillet,protein,8,portions,10,9.00,Ocean Fresh
inv-6,Romaine Lettuce,produce,15,heads,8,2.50,Local Farm
inv-10,Parmesan Cheese,dairy,4,lbs,3,8.00,Cheese Co
inv-4,House Red Wine,beverage,3,bottles,6,15.00,Wine Distributor
```

### Generation Guidelines

- **IDs**: Use format `inv-{number}` starting from 1
- **Categories**: Common categories: `protein`, `produce`, `dairy`, `beverage`, `pantry`, `bakery`, `dessert`
- **Quantities**: Mix high and low quantities for realistic scenarios
- **Units**: Common units: `portions`, `lbs`, `oz`, `bottles`, `units`, `heads`, `quarts`, `liters`
- **Reorder Levels**: Set below current quantity for some items to show "low stock" scenarios

---

## CSV Format: orders.csv

### Purpose
Defines historical/completed orders (optional, for analytics data).

### Column Headers
```
id,tableId,serverId,guestCount,status,items,subtotal,tax,tip,total,createdAt,closedAt,shift
```

### Field Descriptions

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `id` | string | Yes | Unique identifier | `order-1`, `order_001` |
| `tableId` | string | Yes | Table ID | `t2`, `t5` |
| `serverId` | string | Yes | Server ID | `staff-2` |
| `guestCount` | number | Yes | Number of guests | `2`, `4`, `6` |
| `status` | enum | No | Order status | `completed`, `cancelled` |
| `items` | JSON | No | Order items (JSON string) | See items format |
| `subtotal` | number | No | Subtotal | `120.00` |
| `tax` | number | No | Tax amount | `9.60` |
| `tip` | number | No | Tip amount | `24.00` |
| `total` | number | No | Total amount | `153.60` |
| `createdAt` | datetime | Yes | ISO datetime | `2024-01-15T19:23:00Z` |
| `closedAt` | datetime | No | ISO datetime | `2024-01-15T20:45:00Z` |
| `shift` | enum | No | Shift | `lunch`, `dinner` |

### Items Format

Items must be a JSON array string. Example:

```json
[
  {
    "id": "oi-1",
    "menuItemId": "menu-1",
    "name": "Ribeye Steak",
    "guestNumber": 1,
    "modifications": "medium",
    "notes": "",
    "price": 42.00,
    "sentToKitchen": true
  },
  {
    "id": "oi-2",
    "menuItemId": "menu-11",
    "name": "House Red Wine",
    "guestNumber": 1,
    "modifications": "",
    "notes": "",
    "price": 12.00,
    "sentToKitchen": false
  }
]
```

### Example Rows

```csv
id,tableId,serverId,guestCount,status,items,subtotal,tax,tip,total,createdAt,closedAt,shift
order-1,t2,staff-2,4,completed,"[{""id"":""oi-1"",""menuItemId"":""menu-1"",""name"":""Ribeye Steak"",""guestNumber"":1,""modifications"":""medium"",""price"":42.00}]",140.00,11.20,28.00,179.20,2024-01-15T19:23:00Z,2024-01-15T20:45:00Z,dinner
```

### Generation Guidelines

- **IDs**: Use format `order-{number}` or `order_{number}`
- **Status**: For historical data, use `completed`
- **Guest Count**: Realistic range 1-8 guests per table
- **Items**: Include 2-6 items per order, mix food and drinks
- **Timestamps**: Spread orders across multiple days/weeks for analytics
- **Tips**: Calculate as 15-25% of subtotal
- **Tax**: Typically 7-10% of subtotal

---

## CSV Format: scenarios.csv

### Purpose
Metadata about the scenario (optional).

### Column Headers
```
scenarioName,restaurantName,description,createdAt
```

### Field Descriptions

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `scenarioName` | string | Yes | Scenario name | `Busy Friday Night` |
| `restaurantName` | string | Yes | Restaurant name | `The Golden Fork` |
| `description` | string | No | Scenario description | `High volume dinner service with 15 servers` |
| `createdAt` | datetime | No | Creation date | `2024-01-15T10:00:00Z` |

### Example Row

```csv
scenarioName,restaurantName,description,createdAt
Busy Friday Night,The Golden Fork,High volume dinner service with 15 servers and 30 tables at 80% capacity,2024-01-15T10:00:00Z
```

---

## AI Generation Instructions

### When generating CSV files:

1. **Use realistic data**: Generate names, prices, and quantities that make sense for a restaurant
2. **Maintain relationships**: 
   - Order `tableId` must reference existing table `id`
   - Order `serverId` must reference existing staff `id`
   - Order item `menuItemId` must reference existing menu item `id`
3. **Escape JSON properly**: When including JSON in CSV (modifiers, items), escape quotes with double quotes
4. **Include headers**: Always include the header row as the first line
5. **Handle empty fields**: Use empty string `""` for optional fields that aren't provided
6. **Validate enums**: Only use allowed enum values (check field descriptions)
7. **Date formats**: Use ISO format for dates: `YYYY-MM-DD` for dates, `YYYY-MM-DDTHH:mm:ssZ` for datetimes

### Example Scenario Generation

**Request**: "Generate a CSV scenario for NEVER86 with 10 servers, 25 tables, 50 menu items, and 100 historical orders"

**Response**: Generate 5 CSV files:
1. `staff.csv` - 10 server rows + 1-2 managers + 2-3 kitchen staff
2. `tables.csv` - 25 table rows with varied sections and seat counts
3. `menuItems.csv` - 50 menu items across all categories
4. `inventory.csv` - 20-30 inventory items
5. `orders.csv` - 100 completed orders referencing the above data

---

## Validation Rules

The system will validate:
- Required fields are present
- Field types match (string, number, boolean, date)
- Enum values are valid
- Number ranges (min/max)
- String lengths (min/max)
- Pattern matching (for IDs, emails, etc.)

**Errors** will prevent import. **Warnings** (like unknown fields) will be logged but won't block import.

---

## Tips for Realistic Test Data

1. **Staff Distribution**: 
   - 1-2 managers
   - 5-15 servers (more for busy scenarios)
   - 2-5 kitchen staff

2. **Table Distribution**:
   - Mix of 2-tops, 4-tops, 6-tops, 8-tops
   - More 4-tops than other sizes
   - Bar seating if applicable

3. **Menu Balance**:
   - 10-15 appetizers
   - 15-25 mains/entrees
   - 5-10 desserts
   - 10-15 drinks
   - 5-10 sides

4. **Inventory**:
   - Items that match menu items (e.g., Ribeye inventory for Ribeye Steak menu item)
   - Some items below reorder level for "low stock" scenarios

5. **Orders**:
   - Spread across multiple days
   - Mix of lunch and dinner shifts
   - Realistic item counts (2-6 items per order)
   - Tips typically 15-25% of subtotal

---

## Common Mistakes to Avoid

1. ❌ Missing required fields
2. ❌ Using wrong enum values (e.g., `waiter` instead of `server`)
3. ❌ Invalid date formats
4. ❌ Unescaped JSON in CSV (breaks parsing)
5. ❌ Referencing non-existent IDs in relationships
6. ❌ Using strings for number fields
7. ❌ Missing header row
8. ❌ Inconsistent ID formats

---

## Support

For questions or issues with CSV format, refer to:
- `src/models/dataSchemas.js` - Complete schema definitions
- `src/utils/csvParser.js` - Parser implementation
