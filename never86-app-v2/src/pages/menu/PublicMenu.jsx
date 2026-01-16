import { useState, useMemo } from 'react';
import { Search, Leaf, Wheat, Flame, Bell, Star } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { mockMenuItems } from '../../data/mockDataExtended';

const PublicMenu = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dietaryFilters, setDietaryFilters] = useState([]);

  // Group items by category
  const categories = useMemo(() => {
    const cats = {};
    for (const item of mockMenuItems) {
      if (!cats[item.category]) cats[item.category] = [];
      cats[item.category].push(item);
    }
    return cats;
  }, []);

  // Filter items
  const filteredItems = useMemo(() => {
    let items = selectedCategory === 'all' ? mockMenuItems : categories[selectedCategory] || [];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(i => i.name.toLowerCase().includes(query) || i.description.toLowerCase().includes(query));
    }
    return items;
  }, [selectedCategory, searchQuery, categories]);

  const categoryOrder = ['appetizers', 'mains', 'sides', 'desserts', 'drinks'];
  const orderedCategories = categoryOrder.filter(c => categories[c]);

  const categoryLabels = {
    appetizers: 'Starters',
    mains: 'Main Courses',
    sides: 'Sides',
    desserts: 'Desserts',
    drinks: 'Beverages'
  };

  const getPopularity = (itemId) => {
    const hash = parseInt(itemId.split('-')[1]) * 7;
    return hash % 100;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary to-primary/80 px-6 pt-12 pb-8 text-primary-foreground">
        <div className="max-w-lg mx-auto text-center">
          <h1 className="text-3xl font-black tracking-tight mb-2">
            <span className="text-primary-foreground">NEVER</span>
            <span style={{ color: '#4169E1' }}>86</span>
          </h1>
          <p className="text-primary-foreground/80">Fresh ingredients, exceptional flavors</p>
        </div>
      </div>

      {/* Search */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b px-4 py-3">
        <div className="max-w-lg mx-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="sticky top-[68px] z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="max-w-lg mx-auto px-4 py-2.5 overflow-x-auto">
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80 border border-border'
              }`}
            >
              All
            </button>
            {orderedCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80 border border-border'
                }`}
              >
                {categoryLabels[cat] || cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dietary Filters */}
      <div className="max-w-lg mx-auto px-4 py-3">
        <div className="flex gap-2 flex-wrap">
          {[
            { key: 'vegetarian', icon: Leaf, label: 'Vegetarian' },
            { key: 'gluten-free', icon: Wheat, label: 'Gluten-Free' },
            { key: 'spicy', icon: Flame, label: 'Spicy' }
          ].map(filter => (
            <button
              key={filter.key}
              onClick={() => {
                setDietaryFilters(prev => 
                  prev.includes(filter.key) ? prev.filter(f => f !== filter.key) : [...prev, filter.key]
                );
              }}
              className={`flex items-center px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                dietaryFilters.includes(filter.key)
                  ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80 border border-border'
              }`}
            >
              <filter.icon className="w-3.5 h-3.5 mr-1.5" />
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="max-w-lg mx-auto px-4 pb-28">
        {selectedCategory === 'all' ? (
          orderedCategories.map(cat => (
            <div key={cat} className="mb-8">
              <h2 className="text-lg font-semibold mb-3">{categoryLabels[cat] || cat}</h2>
              <div className="space-y-3">
                {categories[cat]?.map(item => (
                  <MenuItemCard key={item.id} item={item} popularity={getPopularity(item.id)} />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="space-y-3 mt-4">
            {filteredItems.map(item => (
              <MenuItemCard key={item.id} item={item} popularity={getPopularity(item.id)} />
            ))}
            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No items found</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Call Server Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background/95 to-transparent pt-8">
        <div className="max-w-lg mx-auto">
          <Button size="lg" className="w-full h-14 text-base font-semibold shadow-lg">
            <Bell className="w-5 h-5 mr-2" />
            Call Server
          </Button>
        </div>
      </div>
    </div>
  );
};

const MenuItemCard = ({ item, popularity }) => {
  const isPopular = popularity > 70;
  const isSoldOut = !item.available;

  return (
    <div 
      className={`bg-card rounded-xl border p-4 transition-all ${
        isSoldOut ? 'opacity-60' : 'hover:shadow-md hover:border-border/80'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold">{item.name}</h3>
            {isPopular && !isSoldOut && (
              <Badge variant="warning" className="text-[10px] px-1.5">
                <Star className="w-2.5 h-2.5 mr-0.5 fill-current" />
                Popular
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-lg font-bold">${item.price.toFixed(2)}</p>
          {isSoldOut && (
            <Badge variant="destructive" className="text-[10px]">Sold Out</Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicMenu;
