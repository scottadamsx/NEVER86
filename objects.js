// ============================================
// BASE CLASS WITH SERIALIZATION SUPPORT
// ============================================

class Serializable {
    /**
     * Convert instance to plain object for storage
     */
    toJSON() {
        const obj = {};
        for (const key in this) {
            if (this.hasOwnProperty(key)) {
                obj[key] = this[key];
            }
        }
        return obj;
    }

    /**
     * Create instance from stored data
     */
    static fromJSON(data) {
        return Object.assign(new this(), data);
    }
}

// ============================================
// ITEM CLASS - Menu items
// ============================================

export class Item extends Serializable {
    constructor(name, price, category = 'uncategorized', description = '') {
        super();
        this.id = Item.generateId();
        this.name = name;
        this.price = parseFloat(price);
        this.category = category;
        this.description = description;
        this.available = true;
        this.createdAt = new Date();
    }

    static generateId() {
        return `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Mark item as unavailable (86'd)
     */
    markUnavailable() {
        this.available = false;
        console.log(`${this.name} is now 86'd`);
    }

    /**
     * Mark item as available again
     */
    markAvailable() {
        this.available = true;
        console.log(`${this.name} is back available`);
    }

    /**
     * Get formatted price
     */
    getFormattedPrice() {
        return `$${this.price.toFixed(2)}`;
    }

    static fromJSON(data) {
        const item = Object.assign(new Item(data.name, data.price), data);
        item.createdAt = new Date(data.createdAt);
        return item;
    }
}

// ============================================
// ORDER CLASS - Customer orders
// ============================================

export class Order extends Serializable {
    constructor(tableId, numGuests, server = null) {
        super();
        this.id = Order.generateId();
        this.tableId = tableId;
        this.numGuests = parseInt(numGuests);
        this.server = server;
        this.items = this.#initializeGuests(numGuests);
        this.status = 'open'; // open, sent, completed, cancelled
        this.createdAt = new Date();
        this.sentAt = null;
        this.completedAt = null;
        this.subtotal = 0;
        this.tax = 0;
        this.total = 0;
    }

    static generateId() {
        return `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    #initializeGuests(numGuests) {
        const guests = [];
        for (let i = 0; i < numGuests; i++) {
            guests.push({
                guestNumber: i + 1,
                items: [],
                subtotal: 0
            });
        }
        return guests;
    }

    /**
     * Add item to specific guest
     */
    addItem(item, guestIndex) {
        if (guestIndex < 0 || guestIndex >= this.numGuests) {
            throw new Error(`Invalid guest index: ${guestIndex}`);
        }

        const guest = this.items[guestIndex];
        guest.items.push({
            id: item.id,
            name: item.name,
            price: item.price,
            addedAt: new Date()
        });
        
        this.#recalculateTotals();
        console.log(`Guest ${guestIndex + 1} ordered ${item.name}`);
    }

    /**
     * Remove item from guest's order
     */
    removeItem(guestIndex, itemIndex) {
        if (guestIndex < 0 || guestIndex >= this.numGuests) {
            throw new Error(`Invalid guest index: ${guestIndex}`);
        }

        const guest = this.items[guestIndex];
        if (itemIndex < 0 || itemIndex >= guest.items.length) {
            throw new Error(`Invalid item index: ${itemIndex}`);
        }

        const removedItem = guest.items.splice(itemIndex, 1)[0];
        this.#recalculateTotals();
        console.log(`Removed ${removedItem.name} from Guest ${guestIndex + 1}`);
        return removedItem;
    }

    /**
     * Recalculate all totals
     */
    #recalculateTotals() {
        this.subtotal = 0;
        
        this.items.forEach(guest => {
            guest.subtotal = guest.items.reduce((sum, item) => sum + item.price, 0);
            this.subtotal += guest.subtotal;
        });

        this.tax = this.subtotal * 0.15; // 15% tax (adjust as needed)
        this.total = this.subtotal + this.tax;
    }

    /**
     * Get all items flattened (for kitchen)
     */
    getAllItems() {
        const allItems = [];
        this.items.forEach(guest => {
            allItems.push(...guest.items);
        });
        return allItems;
    }

    /**
     * Mark order as sent to kitchen
     */
    markSent() {
        this.status = 'sent';
        this.sentAt = new Date();
    }

    /**
     * Mark order as completed
     */
    markCompleted() {
        this.status = 'completed';
        this.completedAt = new Date();
    }

    /**
     * Cancel the order
     */
    cancel() {
        this.status = 'cancelled';
        console.log(`Order ${this.id} cancelled`);
    }

    /**
     * Get order summary
     */
    getSummary() {
        return {
            orderId: this.id,
            tableId: this.tableId,
            server: this.server,
            numGuests: this.numGuests,
            itemCount: this.getAllItems().length,
            subtotal: this.subtotal.toFixed(2),
            tax: this.tax.toFixed(2),
            total: this.total.toFixed(2),
            status: this.status,
            duration: this.createdAt ? this.#getOrderDuration() : null
        };
    }

    #getOrderDuration() {
        const end = this.completedAt || new Date();
        const duration = Math.floor((end - this.createdAt) / 1000 / 60);
        return `${duration} minutes`;
    }

    static fromJSON(data) {
        const order = Object.assign(new Order(data.tableId, data.numGuests, data.server), data);
        order.createdAt = new Date(data.createdAt);
        order.sentAt = data.sentAt ? new Date(data.sentAt) : null;
        order.completedAt = data.completedAt ? new Date(data.completedAt) : null;
        
        // Restore Date objects in items
        order.items.forEach(guest => {
            guest.items.forEach(item => {
                if (item.addedAt) item.addedAt = new Date(item.addedAt);
            });
        });
        
        return order;
    }
}

// ============================================
// TABLE CLASS - Restaurant tables
// ============================================

export class Table extends Serializable {
    constructor(name, capacity = 4) {
        super();
        this.id = Table.generateId();
        this.name = name;
        this.capacity = capacity;
        this.status = 'available'; // available, occupied, reserved, cleaning
        this.server = null;
        this.order = null;
        this.seatedAt = null;
        this.createdAt = new Date();
    }

    static generateId() {
        return `table_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Seat guests at the table
     */
    seat(server, order) {
        if (this.status !== 'available') {
            console.warn(`Table ${this.name} is not available (status: ${this.status})`);
            return false;
        }

        this.server = server;
        this.order = order;
        this.status = 'occupied';
        this.seatedAt = new Date();
        console.log(`Table ${this.name} seated by ${server}`);
        return true;
    }

    /**
     * Clear the table
     */
    clear() {
        const wasOccupied = this.status === 'occupied';
        this.server = null;
        this.order = null;
        this.status = 'cleaning';
        this.seatedAt = null;
        
        if (wasOccupied) {
            console.log(`Table ${this.name} cleared, needs cleaning`);
        }
    }

    /**
     * Mark table as clean and available
     */
    markClean() {
        this.status = 'available';
        console.log(`Table ${this.name} is now available`);
    }

    /**
     * Reserve the table
     */
    reserve() {
        if (this.status === 'available') {
            this.status = 'reserved';
            console.log(`Table ${this.name} reserved`);
            return true;
        }
        return false;
    }

    /**
     * Check if table is active (has customers)
     */
    isActive() {
        return this.status === 'occupied';
    }

    /**
     * Get table info summary
     */
    getInfo() {
        return {
            id: this.id,
            name: this.name,
            capacity: this.capacity,
            status: this.status,
            server: this.server,
            hasOrder: !!this.order,
            seatedDuration: this.seatedAt ? this.#getSeatedDuration() : null
        };
    }

    #getSeatedDuration() {
        const duration = Math.floor((new Date() - this.seatedAt) / 1000 / 60);
        return `${duration} minutes`;
    }

    static fromJSON(data) {
        const table = Object.assign(new Table(data.name, data.capacity), data);
        table.createdAt = new Date(data.createdAt);
        table.seatedAt = data.seatedAt ? new Date(data.seatedAt) : null;
        
        // Restore order if it exists
        if (data.order) {
            table.order = Order.fromJSON(data.order);
        }
        
        return table;
    }
}

// ============================================
// CHIT CLASS - Kitchen order tickets
// ============================================

export class Chit extends Serializable {
    constructor(table, order) {
        super();
        this.id = Chit.generateId();
        this.tableId = table.id;
        this.tableName = table.name;
        this.orderId = order.id;
        this.server = order.server;
        this.items = order.getAllItems();
        this.status = 'pending'; // pending, in-progress, completed
        this.priority = 'normal'; // low, normal, high, urgent
        this.createdAt = new Date();
        this.startedAt = null;
        this.completedAt = null;
        this.notes = '';
    }

    static generateId() {
        return `chit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Start working on the chit
     */
    startCooking() {
        if (this.status === 'pending') {
            this.status = 'in-progress';
            this.startedAt = new Date();
            console.log(`Started cooking for ${this.tableName}`);
        }
    }

    /**
     * Complete the chit
     */
    complete() {
        this.status = 'completed';
        this.completedAt = new Date();
        console.log(`Completed order for ${this.tableName}`);
    }

    /**
     * Set priority level
     */
    setPriority(level) {
        const validLevels = ['low', 'normal', 'high', 'urgent'];
        if (validLevels.includes(level)) {
            this.priority = level;
        }
    }

    /**
     * Add notes to the chit
     */
    addNote(note) {
        this.notes += (this.notes ? '\n' : '') + note;
    }

    /**
     * Get cooking duration
     */
    getCookingTime() {
        if (!this.startedAt) return 'Not started';
        const end = this.completedAt || new Date();
        const duration = Math.floor((end - this.startedAt) / 1000 / 60);
        return `${duration} minutes`;
    }

    /**
     * Get wait time (time since created)
     */
    getWaitTime() {
        const duration = Math.floor((new Date() - this.createdAt) / 1000 / 60);
        return `${duration} minutes`;
    }

    /**
     * Get formatted timestamp
     */
    getFormattedTime() {
        return this.createdAt.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }

    static fromJSON(data) {
        // Create a temporary object to pass to constructor
        const tempTable = { id: data.tableId, name: data.tableName };
        const tempOrder = { 
            id: data.orderId, 
            server: data.server,
            getAllItems: () => data.items 
        };
        
        const chit = Object.assign(new Chit(tempTable, tempOrder), data);
        chit.createdAt = new Date(data.createdAt);
        chit.startedAt = data.startedAt ? new Date(data.startedAt) : null;
        chit.completedAt = data.completedAt ? new Date(data.completedAt) : null;
        
        return chit;
    }
}

// ============================================
// RESTAURANT CLASS - Main container
// ============================================

export class Restaurant extends Serializable {
    constructor(name = 'NEVER86') {
        super();
        this.name = name;
        this.tables = [];
        this.menu = [];
        this.kitchen = [];
        this.orderHistory = [];
        this.stats = {
            ordersToday: 0,
            revenueToday: 0,
            averageOrderValue: 0,
            averageServiceTime: 0
        };
    }

    /**
     * Add a table to the restaurant
     */
    addTable(table) {
        this.tables.push(table);
    }

    /**
     * Add item to menu
     */
    addMenuItem(item) {
        this.menu.push(item);
    }

    /**
     * Get available tables
     */
    getAvailableTables() {
        return this.tables.filter(t => t.status === 'available');
    }

    /**
     * Get active tables
     */
    getActiveTables() {
        return this.tables.filter(t => t.isActive());
    }

    /**
     * Get table by name
     */
    getTableByName(name) {
        return this.tables.find(t => t.name === name);
    }

    /**
     * Get table by ID
     */
    getTableById(id) {
        return this.tables.find(t => t.id === id);
    }

    /**
     * Update daily stats
     */
    updateStats() {
        const today = new Date().toDateString();
        const todayOrders = this.orderHistory.filter(o => 
            new Date(o.createdAt).toDateString() === today && 
            o.status === 'completed'
        );

        this.stats.ordersToday = todayOrders.length;
        this.stats.revenueToday = todayOrders.reduce((sum, o) => sum + o.total, 0);
        this.stats.averageOrderValue = this.stats.ordersToday > 0 
            ? this.stats.revenueToday / this.stats.ordersToday 
            : 0;
    }

    static fromJSON(data) {
        const restaurant = Object.assign(new Restaurant(data.name), data);
        
        // Restore all objects
        restaurant.tables = data.tables.map(t => Table.fromJSON(t));
        restaurant.menu = data.menu.map(i => Item.fromJSON(i));
        restaurant.kitchen = data.kitchen.map(c => Chit.fromJSON(c));
        restaurant.orderHistory = data.orderHistory.map(o => Order.fromJSON(o));
        
        return restaurant;
    }
}