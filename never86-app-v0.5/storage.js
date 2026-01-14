import {Table, Item, Order, Chit} from './objects.js'

// Configuration for storage backend
const USE_JSON_FILES = false; // Set to true when server is running

// ============================================
// CORE STORAGE FUNCTIONS
// ============================================

async function saveData(key, data) {
    if (USE_JSON_FILES) {
        try {
            const response = await fetch(`/api/save/${key}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error(`Failed to save ${key}`);
            }
            console.log(`✓ ${key} saved to JSON file`);
        } catch (error) {
            console.error(`✗ Error saving ${key}:`, error);
            // Fallback to localStorage
            localStorage.setItem(key, JSON.stringify(data));
            console.log(`↻ ${key} saved to localStorage (fallback)`);
        }
    } else {
        localStorage.setItem(key, JSON.stringify(data));
        console.log(`✓ ${key} saved to localStorage`);
    }
}

async function loadData(key, defaultValue = null) {
    if (USE_JSON_FILES) {
        try {
            const response = await fetch(`/api/load/${key}`);
            if (response.ok) {
                const data = await response.json();
                console.log(`✓ ${key} loaded from JSON file`);
                return data;
            }
        } catch (error) {
            console.error(`✗ Error loading ${key}:`, error);
        }
        // Fallback to localStorage
        const localData = localStorage.getItem(key);
        if (localData) {
            console.log(`↻ ${key} loaded from localStorage (fallback)`);
            return JSON.parse(localData);
        }
        return defaultValue;
    } else {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    }
}

// ============================================
// MAIN EXPORT FUNCTIONS (Backwards Compatible)
// ============================================

export async function updateStorage(tables, menu) {
    await saveData('tables', tables);
    await saveData('menu', menu);
}

export async function getTables() {
    const rawTables = await loadData('tables', []);
    
    const tables = rawTables.map(obj => {
        // Reconstruct Order if it exists
        let order = null;
        if (obj.order) {
            order = Order.fromJSON(obj.order);
        }
        
        // Create Table instance
        return Table.fromJSON(obj);
    });

    console.log("Tables loaded:", tables);
    return tables;
}

export async function getKitchen() {
    const rawKitchen = await loadData('kitchen', []);
    
    // Reconstruct Chit objects
    const kitchen = rawKitchen.map(data => Chit.fromJSON(data));
    
    console.log("Kitchen orders loaded:", kitchen);
    return kitchen;
}

export async function getMenu() {
    const rawMenu = await loadData('menu', []);
    
    // Reconstruct Item objects
    const menu = rawMenu.map(data => Item.fromJSON(data));
    
    console.log("Menu loaded:", menu);
    return menu;
}

export async function sendChitToKitchen(chit) {
    let kitchen = await getKitchen();
    kitchen.push(chit);
    await saveData('kitchen', kitchen);
    console.log("Chit sent to kitchen:", chit);
}

export async function removeTableByTableName(tableName) {
    const tables = await getTables();
    const menu = await getMenu();
    const updatedTables = tables.filter(table => table.name !== tableName);
    await updateStorage(updatedTables, menu);
    console.log(`Table ${tableName} removed`);
}

// ============================================
// ADDITIONAL HELPER FUNCTIONS
// ============================================

export async function updateKitchen(kitchen) {
    await saveData('kitchen', kitchen);
}

export async function clearAllData() {
    await saveData('tables', []);
    await saveData('menu', []);
    await saveData('kitchen', []);
    console.log('✓ All data cleared');
}

export async function exportData() {
    return {
        tables: await loadData('tables', []),
        menu: await loadData('menu', []),
        kitchen: await loadData('kitchen', []),
        exportDate: new Date().toISOString()
    };
}

export async function importData(data) {
    if (data.tables) await saveData('tables', data.tables);
    if (data.menu) await saveData('menu', data.menu);
    if (data.kitchen) await saveData('kitchen', data.kitchen);
    console.log('✓ Data imported successfully');
}