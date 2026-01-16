# Menu Import Guide for AI Assistants

This guide helps AI assistants parse restaurant menu PDFs and convert them into the NEVER86 application's menu data format.

## Overview

When provided with a restaurant menu PDF, you should:
1. Extract all menu items with their details
2. Identify categories and organize items accordingly
3. Parse modifiers/options for customizable items
4. Convert everything into the application's JSON format
5. Generate the output file ready for import

---

## Application Menu Data Structure

### Base Menu Item Format

```javascript
{
  id: 'menu-{unique-number}',           // Unique identifier (e.g., 'menu-1', 'menu-2')
  name: 'Item Name',                     // Display name of the menu item
  description: 'Item description',      // Brief description (can be empty string if not provided)
  price: 24.99,                          // Base price as a number (not string)
  category: 'mains',                     // Category slug (see categories below)
  prepTime: 15,                          // Estimated prep time in minutes (default: 10 if unknown)
  onMenu: true,                          // Always true for imported items
  available: true,                       // Set to true by default (can be manually changed later)
  modifiers: []                          // Array of modifier groups (see modifiers section)
}
```

### Required Fields

- **id**: Must be unique. Format: `'menu-'` followed by a number
- **name**: The item name as it appears on the menu
- **price**: Numeric value (parse from currency strings like "$24.99" → 24.99)
- **category**: One of the standard categories (see below)
- **modifiers**: Array (can be empty `[]` if no modifiers)

### Optional Fields

- **description**: Can be empty string `''` if menu doesn't provide descriptions
- **prepTime**: Default to 10 minutes if not specified

---

## Standard Categories

Use these category slugs (lowercase, no spaces):

- `'appetizers'` - Starters, small plates, tapas
- `'mains'` - Entrees, main courses, entrees
- `'desserts'` - Desserts, sweets
- `'drinks'` - Beverages, cocktails, wine, beer, soft drinks
- `'sides'` - Side dishes, accompaniments
- `'salads'` - Salads (if distinct from appetizers)
- `'soups'` - Soups (if distinct from appetizers)
- `'sandwiches'` - Sandwiches, burgers, wraps
- `'pizza'` - Pizza items
- `'breakfast'` - Breakfast items (if applicable)
- `'lunch'` - Lunch-specific items (if applicable)

**Category Mapping Tips:**
- If menu uses "Starters" → use `'appetizers'`
- If menu uses "Entrees" or "Main Courses" → use `'mains'`
- If menu uses "Beverages" → use `'drinks'`
- If unsure, default to `'mains'` for main section items

---

## Modifiers Structure

Modifiers allow customers to customize menu items. Each modifier group represents a choice category.

### Modifier Group Format

```javascript
{
  name: 'Modifier Group Name',          // e.g., 'Temperature', 'Size', 'Add Protein'
  required: true,                        // true if customer must select, false if optional
  options: [                             // Array of available choices
    { name: 'Option Name', price: 0 },  // price can be 0 or additional cost
    { name: 'Another Option', price: 2.50 }
  ]
}
```

### Common Modifier Patterns

#### 1. Temperature/Doneness (for meats)
```javascript
{
  name: 'Temperature',
  required: true,
  options: [
    { name: 'Rare', price: 0 },
    { name: 'Medium Rare', price: 0 },
    { name: 'Medium', price: 0 },
    { name: 'Medium Well', price: 0 },
    { name: 'Well Done', price: 0 }
  ]
}
```

#### 2. Size Options
```javascript
{
  name: 'Size',
  required: true,
  options: [
    { name: 'Small', price: 0 },
    { name: 'Medium', price: 2 },
    { name: 'Large', price: 4 }
  ]
}
```

#### 3. Add-ons (Optional)
```javascript
{
  name: 'Add Protein',
  required: false,
  options: [
    { name: 'No Protein', price: 0 },
    { name: 'Grilled Chicken', price: 6 },
    { name: 'Grilled Shrimp', price: 8 },
    { name: 'Salmon', price: 10 }
  ]
}
```

#### 4. Sauce/Topping Selection
```javascript
{
  name: 'Sauce',
  required: false,
  options: [
    { name: 'No Sauce', price: 0 },
    { name: 'Ketchup', price: 0 },
    { name: 'Ranch', price: 0.50 },
    { name: 'Aioli', price: 0.50 }
  ]
}
```

### Identifying Modifiers in Menu PDFs

Look for these patterns:
- **Price variations**: "Small $10, Large $14" → Size modifier
- **"Add" language**: "Add chicken +$6" → Add-on modifier
- **Choice lists**: "Choose: Rare, Medium, Well Done" → Temperature modifier
- **Substitutions**: "Substitute fries for salad +$2" → Side modifier
- **Multiple options**: Items with "or" between options → Modifier group

**Important**: If an item has multiple prices (e.g., "Small $10 / Large $14"), create a Size modifier rather than separate menu items.

---

## PDF Parsing Guidelines

### Step 1: Identify Menu Sections

1. Scan the PDF for section headers (usually bold, larger font, or centered)
2. Map each section to a category slug
3. Note any subsections (e.g., "Hot Appetizers" vs "Cold Appetizers" → both are `'appetizers'`)

### Step 2: Extract Menu Items

For each item in a section, extract:

1. **Name**: Usually the first line, often bold or larger font
2. **Description**: Text following the name (may be italicized or smaller font)
3. **Price**: Usually on the right side or end of line (look for currency symbols: $, €, £)
4. **Modifiers**: Look for:
   - Parenthetical notes: "(add chicken +$6)"
   - Separate lines with options
   - Price ranges: "$12-16"
   - "Choice of" language

### Step 3: Handle Price Variations

**Single Price**: `"$24.99"` → `price: 24.99`

**Price Range**: `"$12-16"` → Use the lower price as base, create Size modifier:
```javascript
{
  price: 12,
  modifiers: [{
    name: 'Size',
    required: true,
    options: [
      { name: 'Small', price: 0 },
      { name: 'Large', price: 4 }
    ]
  }]
}
```

**Multiple Prices Listed**: `"Small $10, Large $14"` → Same as price range

**Add-on Prices**: `"Add chicken +$6"` → Create optional add-on modifier

### Step 4: Parse Descriptions

- Extract descriptive text that follows the item name
- Remove price information from descriptions
- If no description exists, use empty string `''`
- Keep descriptions concise (1-2 sentences max)

### Step 5: Identify Modifiers

Look for these indicators:
- **Parenthetical notes**: "(choice of side)" → Side modifier
- **"Add" or "+"**: "Add bacon +$2" → Add-on modifier
- **Lists**: "Rare, Medium, Well Done" → Temperature modifier
- **"Substitute"**: "Substitute for..." → Substitution modifier
- **Size words**: "Small/Large", "Regular/Supersize" → Size modifier

---

## Example: Parsing a Menu Item

### Input (from PDF):
```
GRILLED SALMON
Atlantic salmon with lemon dill sauce, served with your choice of side
$36

(Add protein: Grilled Chicken +$6, Shrimp +$8)
```

### Output:
```javascript
{
  id: 'menu-2',
  name: 'Grilled Salmon',
  description: 'Atlantic salmon with lemon dill sauce, served with your choice of side',
  price: 36.00,
  category: 'mains',
  prepTime: 15,
  onMenu: true,
  available: true,
  modifiers: [
    {
      name: 'Add Protein',
      required: false,
      options: [
        { name: 'No Protein', price: 0 },
        { name: 'Grilled Chicken', price: 6 },
        { name: 'Shrimp', price: 8 }
      ]
    }
  ]
}
```

---

## Complete Output Format

Generate a JavaScript file with this structure:

```javascript
// Menu items extracted from [Restaurant Name] menu
export const menuItems = [
  {
    id: 'menu-1',
    name: 'Item Name',
    description: 'Description text',
    price: 24.99,
    category: 'mains',
    prepTime: 15,
    onMenu: true,
    available: true,
    modifiers: []
  },
  // ... more items
];
```

Or as a JSON array if preferred:

```json
[
  {
    "id": "menu-1",
    "name": "Item Name",
    "description": "Description text",
    "price": 24.99,
    "category": "mains",
    "prepTime": 15,
    "onMenu": true,
    "available": true,
    "modifiers": []
  }
]
```

---

## Common Challenges & Solutions

### Challenge 1: No Clear Categories
**Solution**: Use section headers or visual grouping. If truly unclear, default to `'mains'` and note in comments.

### Challenge 2: Items with Multiple Modifiers
**Solution**: Create multiple modifier groups. Example:
```javascript
modifiers: [
  { name: 'Temperature', required: true, options: [...] },
  { name: 'Side', required: false, options: [...] },
  { name: 'Sauce', required: false, options: [...] }
]
```

### Challenge 3: Items Listed Multiple Times (e.g., lunch vs dinner)
**Solution**: Create separate items with different IDs, or use modifiers if the only difference is size/portion.

### Challenge 4: "Market Price" or "Ask Server"
**Solution**: Use a reasonable estimate price (e.g., $25 for seafood) and set `available: true`. Add note in description: "Price varies - ask server".

### Challenge 5: Combo Meals
**Solution**: Create as single item with modifiers for choices. Example:
```javascript
{
  name: 'Combo Meal',
  price: 15.99,
  modifiers: [
    {
      name: 'Main',
      required: true,
      options: [
        { name: 'Burger', price: 0 },
        { name: 'Chicken Sandwich', price: 0 },
        { name: 'Wrap', price: 0 }
      ]
    },
    {
      name: 'Side',
      required: true,
      options: [
        { name: 'Fries', price: 0 },
        { name: 'Salad', price: 0 },
        { name: 'Soup', price: 0 }
      ]
    }
  ]
}
```

### Challenge 6: Wine/Drink Lists with Varietals
**Solution**: Create separate menu items for each wine, or use modifiers:
```javascript
{
  name: 'House Wine',
  price: 12.00,
  modifiers: [{
    name: 'Selection',
    required: true,
    options: [
      { name: 'Cabernet Sauvignon', price: 0 },
      { name: 'Chardonnay', price: 0 },
      { name: 'Pinot Grigio', price: 0 }
    ]
  }]
}
```

---

## Quality Checklist

Before finalizing the output, verify:

- [ ] All items have unique IDs
- [ ] All prices are numeric (not strings)
- [ ] All categories use standard slugs
- [ ] Modifiers have at least one option
- [ ] Required modifiers have `required: true`
- [ ] Optional modifiers include a "No [X]" option with price 0
- [ ] Descriptions don't contain price information
- [ ] Item names match the menu (preserve capitalization)
- [ ] No duplicate items (unless intentionally different)

---

## Example: Full Menu Parse

### Input PDF Structure:
```
APPETIZERS
Caesar Salad - Romaine, parmesan, croutons - $14
(add protein: Chicken +$6, Shrimp +$8)

Soup of the Day - Ask server - $9

MAINS
Ribeye Steak - 12oz aged ribeye - $42
(Temperature: Rare, Medium Rare, Medium, Well Done)
(Side: Mashed Potatoes, Fries, Vegetables)

Grilled Salmon - Atlantic salmon - $36
(Preparation: Grilled, Pan Seared, Blackened)

DESSERTS
Chocolate Cake - Rich chocolate layer cake - $12
Tiramisu - Classic Italian dessert - $11
```

### Output:
```javascript
export const menuItems = [
  {
    id: 'menu-1',
    name: 'Caesar Salad',
    description: 'Romaine, parmesan, croutons',
    price: 14.00,
    category: 'appetizers',
    prepTime: 5,
    onMenu: true,
    available: true,
    modifiers: [{
      name: 'Add Protein',
      required: false,
      options: [
        { name: 'No Protein', price: 0 },
        { name: 'Chicken', price: 6 },
        { name: 'Shrimp', price: 8 }
      ]
    }]
  },
  {
    id: 'menu-2',
    name: 'Soup of the Day',
    description: 'Ask server',
    price: 9.00,
    category: 'appetizers',
    prepTime: 3,
    onMenu: true,
    available: true,
    modifiers: []
  },
  {
    id: 'menu-3',
    name: 'Ribeye Steak',
    description: '12oz aged ribeye',
    price: 42.00,
    category: 'mains',
    prepTime: 18,
    onMenu: true,
    available: true,
    modifiers: [
      {
        name: 'Temperature',
        required: true,
        options: [
          { name: 'Rare', price: 0 },
          { name: 'Medium Rare', price: 0 },
          { name: 'Medium', price: 0 },
          { name: 'Well Done', price: 0 }
        ]
      },
      {
        name: 'Side',
        required: false,
        options: [
          { name: 'No Side', price: 0 },
          { name: 'Mashed Potatoes', price: 0 },
          { name: 'Fries', price: 0 },
          { name: 'Vegetables', price: 0 }
        ]
      }
    ]
  },
  {
    id: 'menu-4',
    name: 'Grilled Salmon',
    description: 'Atlantic salmon',
    price: 36.00,
    category: 'mains',
    prepTime: 15,
    onMenu: true,
    available: true,
    modifiers: [{
      name: 'Preparation',
      required: true,
      options: [
        { name: 'Grilled', price: 0 },
        { name: 'Pan Seared', price: 0 },
        { name: 'Blackened', price: 0 }
      ]
    }]
  },
  {
    id: 'menu-5',
    name: 'Chocolate Cake',
    description: 'Rich chocolate layer cake',
    price: 12.00,
    category: 'desserts',
    prepTime: 5,
    onMenu: true,
    available: true,
    modifiers: []
  },
  {
    id: 'menu-6',
    name: 'Tiramisu',
    description: 'Classic Italian dessert',
    price: 11.00,
    category: 'desserts',
    prepTime: 5,
    onMenu: true,
    available: true,
    modifiers: []
  }
];
```

---

## Final Notes

- **Preserve original formatting**: Keep item names as they appear (capitalization, special characters)
- **Be conservative with modifiers**: Only create modifiers if clearly indicated on the menu
- **Default prep times**: Use 10 minutes if not specified, adjust based on item type:
  - Appetizers: 5-8 minutes
  - Mains: 12-20 minutes
  - Desserts: 3-5 minutes
  - Drinks: 1-2 minutes
- **Ask for clarification**: If the menu is unclear, note uncertainties in comments
- **Validate prices**: Ensure all prices are reasonable and properly parsed

---

## Quick Reference

**File to generate**: `menuItems.js` or `menuItems.json`

**Required fields per item**: `id`, `name`, `price`, `category`, `modifiers`

**Standard categories**: `appetizers`, `mains`, `desserts`, `drinks`, `sides`, `salads`, `soups`, `sandwiches`, `pizza`

**Modifier structure**: `{ name: string, required: boolean, options: [{ name: string, price: number }] }`

**Price format**: Always numeric (24.99, not "24.99" or "$24.99")
