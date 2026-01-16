# Menu Import Quick Reference

**For AI Assistants**: Use this when parsing restaurant menu PDFs.

## Required Format

```javascript
{
  id: 'menu-1',                    // Unique: 'menu-' + number
  name: 'Item Name',               // As it appears on menu
  description: 'Description',      // Can be empty string ''
  price: 24.99,                    // NUMERIC (not string)
  category: 'mains',              // See categories below
  prepTime: 10,                    // Minutes (default: 10)
  onMenu: true,                    // Always true
  available: true,                 // Default: true
  modifiers: []                    // Array of modifier groups
}
```

## Categories (use lowercase slugs)

- `appetizers` - Starters, small plates
- `mains` - Entrees, main courses  
- `desserts` - Desserts
- `drinks` - Beverages, cocktails, wine, beer
- `sides` - Side dishes
- `salads` - Salads
- `soups` - Soups
- `sandwiches` - Sandwiches, burgers
- `pizza` - Pizza

## Modifiers Format

```javascript
modifiers: [
  {
    name: 'Temperature',          // Modifier group name
    required: true,                // true = must select, false = optional
    options: [
      { name: 'Rare', price: 0 },
      { name: 'Medium', price: 0 },
      { name: 'Well Done', price: 0 }
    ]
  }
]
```

## Modifier Rules

- **Required modifiers**: Set `required: true` (e.g., temperature for steaks)
- **Optional modifiers**: Set `required: false` AND include a "No [X]" option with `price: 0`
- **Price variations**: If item has "Small $10, Large $14" → use base price $10 + Size modifier
- **Add-ons**: "Add chicken +$6" → Optional modifier with "No Protein" (price 0) and "Chicken" (price 6)

## Price Parsing

- `"$24.99"` → `24.99` (numeric)
- `"$12-16"` → Use lower price (12) + Size modifier
- `"Market Price"` → Use estimate (e.g., 25) + note in description

## Common Modifier Patterns

**Temperature** (for meats): Rare, Medium Rare, Medium, Medium Well, Well Done  
**Size**: Small, Medium, Large (often with price differences)  
**Add Protein**: No Protein (0), Chicken (+$6), Shrimp (+$8)  
**Side**: No Side (0), Fries (0), Salad (0), Vegetables (0)  
**Sauce**: No Sauce (0), Ketchup (0), Ranch (+$0.50), Aioli (+$0.50)

## Example Output

```javascript
export const menuItems = [
  {
    id: 'menu-1',
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
      }
    ]
  }
];
```

## Checklist

- [ ] All IDs are unique (`menu-1`, `menu-2`, etc.)
- [ ] All prices are numeric (not strings)
- [ ] All categories use standard slugs
- [ ] Optional modifiers have "No [X]" option
- [ ] Required modifiers have `required: true`
- [ ] Descriptions don't contain prices
