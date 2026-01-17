-- ============================================
-- NEVER86 RESTAURANT MANAGEMENT SYSTEM
-- Database Schema and Seed Data
-- ============================================
-- This file contains the complete database schema and all mock data
-- for deploying the NEVER86 application to production.
-- ============================================

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS chit_items CASCADE;
DROP TABLE IF EXISTS chits CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS menu_modifier_options CASCADE;
DROP TABLE IF EXISTS menu_modifier_groups CASCADE;
DROP TABLE IF EXISTS menu_items CASCADE;
DROP TABLE IF EXISTS inventory_usage CASCADE;
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS time_punches CASCADE;
DROP TABLE IF EXISTS scheduled_shifts CASCADE;
DROP TABLE IF EXISTS server_performance CASCADE;
DROP TABLE IF EXISTS daily_sales_summary CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS tables CASCADE;
DROP TABLE IF EXISTS staff CASCADE;

-- ============================================
-- STAFF TABLE
-- ============================================
CREATE TABLE staff (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('manager', 'server', 'kitchen')),
    display_name VARCHAR(100) NOT NULL,
    section VARCHAR(10),
    station VARCHAR(50),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    password_hash VARCHAR(255) DEFAULT '$2a$10$default_hash_here' -- Update with real hashes
);

-- ============================================
-- TABLES TABLE
-- ============================================
CREATE TABLE tables (
    id VARCHAR(50) PRIMARY KEY,
    number INTEGER UNIQUE NOT NULL,
    seats INTEGER NOT NULL,
    section VARCHAR(10) NOT NULL,
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'reserved', 'cleaning')),
    server_id VARCHAR(50) REFERENCES staff(id) ON DELETE SET NULL,
    guest_count INTEGER DEFAULT 0,
    seated_at TIMESTAMP,
    current_order_id VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- MENU ITEMS TABLE
-- ============================================
CREATE TABLE menu_items (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    prep_time INTEGER DEFAULT 0,
    on_menu BOOLEAN DEFAULT TRUE,
    available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- MENU MODIFIER GROUPS TABLE
-- ============================================
CREATE TABLE menu_modifier_groups (
    id SERIAL PRIMARY KEY,
    menu_item_id VARCHAR(50) REFERENCES menu_items(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    required BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0
);

-- ============================================
-- MENU MODIFIER OPTIONS TABLE
-- ============================================
CREATE TABLE menu_modifier_options (
    id SERIAL PRIMARY KEY,
    modifier_group_id INTEGER REFERENCES menu_modifier_groups(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) DEFAULT 0,
    display_order INTEGER DEFAULT 0
);

-- ============================================
-- INVENTORY TABLE
-- ============================================
CREATE TABLE inventory (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    min_threshold DECIMAL(10, 2) DEFAULT 0,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- ORDERS TABLE
-- ============================================
CREATE TABLE orders (
    id VARCHAR(50) PRIMARY KEY,
    table_id VARCHAR(50) REFERENCES tables(id) ON DELETE SET NULL,
    server_id VARCHAR(50) REFERENCES staff(id) ON DELETE SET NULL,
    guest_count INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    tip DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP NOT NULL,
    closed_at TIMESTAMP,
    shift VARCHAR(20) CHECK (shift IN ('lunch', 'dinner'))
);

-- ============================================
-- ORDER ITEMS TABLE
-- ============================================
CREATE TABLE order_items (
    id VARCHAR(50) PRIMARY KEY,
    order_id VARCHAR(50) REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id VARCHAR(50) REFERENCES menu_items(id) ON DELETE SET NULL,
    name VARCHAR(200) NOT NULL,
    guest_number INTEGER DEFAULT 1,
    modifications TEXT,
    notes TEXT,
    price DECIMAL(10, 2) NOT NULL,
    sent_to_kitchen BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- CHITS TABLE (Kitchen Orders)
-- ============================================
CREATE TABLE chits (
    id VARCHAR(50) PRIMARY KEY,
    order_id VARCHAR(50) REFERENCES orders(id) ON DELETE CASCADE,
    table_number INTEGER NOT NULL,
    server_name VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'ready', 'completed')),
    run BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL,
    completed_at TIMESTAMP
);

-- ============================================
-- CHIT ITEMS TABLE
-- ============================================
CREATE TABLE chit_items (
    id VARCHAR(50) PRIMARY KEY,
    chit_id VARCHAR(50) REFERENCES chits(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    modifications TEXT,
    notes TEXT,
    guest_number INTEGER DEFAULT 1,
    done BOOLEAN DEFAULT FALSE
);

-- ============================================
-- MESSAGES TABLE
-- ============================================
CREATE TABLE messages (
    id VARCHAR(50) PRIMARY KEY,
    from_role VARCHAR(20) NOT NULL CHECK (from_role IN ('manager', 'server', 'kitchen')),
    to_role VARCHAR(20) NOT NULL CHECK (to_role IN ('manager', 'server', 'kitchen')),
    from_user_id VARCHAR(50) REFERENCES staff(id) ON DELETE SET NULL,
    to_user_id VARCHAR(50) REFERENCES staff(id) ON DELETE SET NULL,
    from_name VARCHAR(100) NOT NULL,
    to_name VARCHAR(100) NOT NULL,
    text TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'chat',
    read BOOLEAN DEFAULT FALSE,
    timestamp TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- DAILY SALES SUMMARY TABLE
-- ============================================
CREATE TABLE daily_sales_summary (
    id SERIAL PRIMARY KEY,
    date DATE UNIQUE NOT NULL,
    total_revenue DECIMAL(10, 2) DEFAULT 0,
    total_tips DECIMAL(10, 2) DEFAULT 0,
    total_tables INTEGER DEFAULT 0,
    lunch_tables INTEGER DEFAULT 0,
    dinner_tables INTEGER DEFAULT 0,
    lunch_revenue DECIMAL(10, 2) DEFAULT 0,
    dinner_revenue DECIMAL(10, 2) DEFAULT 0,
    items_sold INTEGER DEFAULT 0,
    average_check DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- SERVER PERFORMANCE TABLE
-- ============================================
CREATE TABLE server_performance (
    id SERIAL PRIMARY KEY,
    server_id VARCHAR(50) REFERENCES staff(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    shift VARCHAR(20) CHECK (shift IN ('lunch', 'dinner')),
    tables_served INTEGER DEFAULT 0,
    total_sales DECIMAL(10, 2) DEFAULT 0,
    total_tips DECIMAL(10, 2) DEFAULT 0,
    average_turnover_time INTEGER DEFAULT 0,
    average_check DECIMAL(10, 2) DEFAULT 0,
    error_count INTEGER DEFAULT 0,
    customer_satisfaction DECIMAL(3, 1) DEFAULT 0,
    upsell_rate DECIMAL(5, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(server_id, date, shift)
);

-- ============================================
-- SCHEDULED SHIFTS TABLE
-- ============================================
CREATE TABLE scheduled_shifts (
    id VARCHAR(50) PRIMARY KEY,
    staff_id VARCHAR(50) REFERENCES staff(id) ON DELETE CASCADE,
    staff_name VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    shift_type VARCHAR(20) CHECK (shift_type IN ('lunch', 'dinner')),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    role VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TIME PUNCHES TABLE
-- ============================================
CREATE TABLE time_punches (
    id VARCHAR(50) PRIMARY KEY,
    staff_id VARCHAR(50) REFERENCES staff(id) ON DELETE CASCADE,
    scheduled_shift_id VARCHAR(50) REFERENCES scheduled_shifts(id) ON DELETE SET NULL,
    clock_in_time TIMESTAMP NOT NULL,
    clock_out_time TIMESTAMP,
    break_minutes INTEGER DEFAULT 0,
    hours_worked DECIMAL(5, 2) DEFAULT 0,
    notes TEXT,
    approved_by VARCHAR(50) REFERENCES staff(id) ON DELETE SET NULL,
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INVENTORY USAGE TABLE
-- ============================================
CREATE TABLE inventory_usage (
    id SERIAL PRIMARY KEY,
    item_id VARCHAR(50) REFERENCES inventory(id) ON DELETE CASCADE,
    item_name VARCHAR(200) NOT NULL,
    date DATE NOT NULL,
    quantity_used DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_orders_table_id ON orders(table_id);
CREATE INDEX idx_orders_server_id ON orders(server_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_chits_order_id ON chits(order_id);
CREATE INDEX idx_chits_status ON chits(status);
CREATE INDEX idx_messages_from_user ON messages(from_user_id);
CREATE INDEX idx_messages_to_user ON messages(to_user_id);
CREATE INDEX idx_messages_timestamp ON messages(timestamp);
CREATE INDEX idx_daily_sales_date ON daily_sales_summary(date);
CREATE INDEX idx_server_perf_server_date ON server_performance(server_id, date);
CREATE INDEX idx_scheduled_shifts_date ON scheduled_shifts(date);
CREATE INDEX idx_time_punches_staff ON time_punches(staff_id);

-- ============================================
-- INSERT STAFF DATA
-- ============================================
INSERT INTO staff (id, username, role, display_name, section, station, status, created_at) VALUES
('staff-1', 'manager949', 'manager', 'Sarah Johnson', NULL, NULL, 'active', '2024-01-15 00:00:00'),
('staff-2', 'mrodriguez2847', 'server', 'Maria Rodriguez', 'A', NULL, 'active', '2024-03-15 00:00:00'),
('staff-3', 'jthompson5921', 'server', 'Jake Thompson', 'A', NULL, 'active', '2024-02-20 00:00:00'),
('staff-4', 'schen7364', 'server', 'Sophie Chen', 'B', NULL, 'active', '2024-01-10 00:00:00'),
('staff-5', 'mbrown4189', 'server', 'Michael Brown', 'B', NULL, 'active', '2024-02-05 00:00:00'),
('staff-6', 'edavis8523', 'server', 'Emily Davis', 'C', NULL, 'active', '2024-01-20 00:00:00'),
('staff-7', 'dwilson1647', 'server', 'David Wilson', 'C', NULL, 'active', '2024-02-15 00:00:00'),
('staff-8', 'omartinez9032', 'server', 'Olivia Martinez', 'A', NULL, 'active', '2024-03-01 00:00:00'),
('staff-9', 'chef949', 'kitchen', 'Chef Anderson', NULL, 'grill', 'active', '2024-01-10 00:00:00');

-- ============================================
-- INSERT TABLES DATA
-- ============================================
INSERT INTO tables (id, number, seats, section, status, server_id, guest_count, seated_at, current_order_id) VALUES
('t1', 1, 4, 'A', 'available', NULL, 0, NULL, NULL),
('t2', 2, 4, 'A', 'occupied', 'staff-2', 4, NOW() - INTERVAL '1 hour', 'order-1'),
('t3', 3, 2, 'A', 'occupied', 'staff-2', 2, NOW() - INTERVAL '30 minutes', 'order-2'),
('t4', 4, 4, 'B', 'available', NULL, 0, NULL, NULL),
('t5', 5, 4, 'B', 'occupied', 'staff-3', 3, NOW() - INTERVAL '2 hours', 'order-3'),
('t6', 6, 6, 'B', 'available', NULL, 0, NULL, NULL),
('t7', 7, 2, 'C', 'occupied', 'staff-4', 2, NOW() - INTERVAL '15 minutes', 'order-4'),
('t8', 8, 4, 'C', 'available', NULL, 0, NULL, NULL),
('t9', 9, 8, 'C', 'reserved', NULL, 0, NULL, NULL),
('t10', 10, 4, 'A', 'available', NULL, 0, NULL, NULL),
('t11', 11, 4, 'A', 'available', NULL, 0, NULL, NULL),
('t12', 12, 6, 'A', 'available', NULL, 0, NULL, NULL),
('t13', 13, 2, 'B', 'available', NULL, 0, NULL, NULL),
('t14', 14, 4, 'B', 'available', NULL, 0, NULL, NULL),
('t15', 15, 6, 'B', 'available', NULL, 0, NULL, NULL),
('t16', 16, 4, 'C', 'available', NULL, 0, NULL, NULL),
('t17', 17, 2, 'C', 'available', NULL, 0, NULL, NULL),
('t18', 18, 8, 'C', 'available', NULL, 0, NULL, NULL),
('t19', 19, 4, 'A', 'available', NULL, 0, NULL, NULL),
('t20', 20, 6, 'B', 'available', NULL, 0, NULL, NULL);

-- ============================================
-- INSERT MENU ITEMS DATA
-- ============================================
INSERT INTO menu_items (id, name, description, price, category, prep_time, on_menu, available) VALUES
('menu-1', 'Ribeye Steak', '12oz aged ribeye with herb butter', 42.00, 'mains', 18, TRUE, TRUE),
('menu-2', 'Grilled Salmon', 'Atlantic salmon with lemon dill sauce', 36.00, 'mains', 15, TRUE, TRUE),
('menu-3', 'Chicken Parmesan', 'Breaded chicken breast with marinara', 28.00, 'mains', 16, TRUE, TRUE),
('menu-4', 'Pasta Primavera', 'Seasonal vegetables in garlic cream sauce', 24.00, 'mains', 12, TRUE, TRUE),
('menu-5', 'Caesar Salad', 'Romaine, parmesan, croutons, caesar dressing', 14.00, 'appetizers', 5, TRUE, TRUE),
('menu-6', 'Soup of the Day', 'Ask your server for today''s selection', 9.00, 'appetizers', 3, TRUE, TRUE),
('menu-7', 'Calamari', 'Crispy fried calamari with marinara', 16.00, 'appetizers', 8, TRUE, TRUE),
('menu-8', 'Bruschetta', 'Toasted bread with tomato basil topping', 12.00, 'appetizers', 6, TRUE, TRUE),
('menu-9', 'Chocolate Cake', 'Rich chocolate layer cake', 12.00, 'desserts', 5, TRUE, FALSE),
('menu-10', 'Tiramisu', 'Classic Italian coffee dessert', 11.00, 'desserts', 5, TRUE, TRUE),
('menu-11', 'House Red Wine', 'Glass of house cabernet', 12.00, 'drinks', 1, TRUE, TRUE),
('menu-12', 'House White Wine', 'Glass of house chardonnay', 12.00, 'drinks', 1, TRUE, TRUE),
('menu-13', 'Draft Beer', 'Ask for today''s selections', 8.00, 'drinks', 1, TRUE, TRUE),
('menu-14', 'Soft Drinks', 'Coke, Sprite, Ginger Ale', 4.00, 'drinks', 1, TRUE, TRUE),
('menu-15', 'Garlic Mashed Potatoes', 'Creamy mashed potatoes with roasted garlic', 8.00, 'sides', 5, TRUE, TRUE),
('menu-16', 'Seasonal Vegetables', 'Chef''s selection of grilled vegetables', 7.00, 'sides', 6, TRUE, TRUE),
('menu-17', 'French Fries', 'Crispy hand-cut fries', 6.00, 'sides', 7, TRUE, TRUE);

-- ============================================
-- INSERT MENU MODIFIER GROUPS AND OPTIONS
-- ============================================
-- Ribeye Steak modifiers
INSERT INTO menu_modifier_groups (menu_item_id, name, required, display_order) VALUES
('menu-1', 'Temperature', TRUE, 1),
('menu-1', 'Side', FALSE, 2);

INSERT INTO menu_modifier_options (modifier_group_id, name, price, display_order) VALUES
((SELECT id FROM menu_modifier_groups WHERE menu_item_id = 'menu-1' AND name = 'Temperature'), 'Rare', 0, 1),
((SELECT id FROM menu_modifier_groups WHERE menu_item_id = 'menu-1' AND name = 'Temperature'), 'Medium Rare', 0, 2),
((SELECT id FROM menu_modifier_groups WHERE menu_item_id = 'menu-1' AND name = 'Temperature'), 'Medium', 0, 3),
((SELECT id FROM menu_modifier_groups WHERE menu_item_id = 'menu-1' AND name = 'Temperature'), 'Medium Well', 0, 4),
((SELECT id FROM menu_modifier_groups WHERE menu_item_id = 'menu-1' AND name = 'Temperature'), 'Well Done', 0, 5),
((SELECT id FROM menu_modifier_groups WHERE menu_item_id = 'menu-1' AND name = 'Side'), 'No Side', 0, 1),
((SELECT id FROM menu_modifier_groups WHERE menu_item_id = 'menu-1' AND name = 'Side'), 'Mashed Potatoes', 0, 2),
((SELECT id FROM menu_modifier_groups WHERE menu_item_id = 'menu-1' AND name = 'Side'), 'Fries', 0, 3),
((SELECT id FROM menu_modifier_groups WHERE menu_item_id = 'menu-1' AND name = 'Side'), 'Vegetables', 0, 4);

-- Grilled Salmon modifiers
INSERT INTO menu_modifier_groups (menu_item_id, name, required, display_order) VALUES
('menu-2', 'Preparation', TRUE, 1);

INSERT INTO menu_modifier_options (modifier_group_id, name, price, display_order) VALUES
((SELECT id FROM menu_modifier_groups WHERE menu_item_id = 'menu-2' AND name = 'Preparation'), 'Grilled', 0, 1),
((SELECT id FROM menu_modifier_groups WHERE menu_item_id = 'menu-2' AND name = 'Preparation'), 'Pan Seared', 0, 2),
((SELECT id FROM menu_modifier_groups WHERE menu_item_id = 'menu-2' AND name = 'Preparation'), 'Blackened', 0, 3);

-- Caesar Salad modifiers
INSERT INTO menu_modifier_groups (menu_item_id, name, required, display_order) VALUES
('menu-5', 'Add Protein', FALSE, 1);

INSERT INTO menu_modifier_options (modifier_group_id, name, price, display_order) VALUES
((SELECT id FROM menu_modifier_groups WHERE menu_item_id = 'menu-5' AND name = 'Add Protein'), 'No Protein', 0, 1),
((SELECT id FROM menu_modifier_groups WHERE menu_item_id = 'menu-5' AND name = 'Add Protein'), 'Grilled Chicken', 6.00, 2),
((SELECT id FROM menu_modifier_groups WHERE menu_item_id = 'menu-5' AND name = 'Add Protein'), 'Grilled Shrimp', 8.00, 3),
((SELECT id FROM menu_modifier_groups WHERE menu_item_id = 'menu-5' AND name = 'Add Protein'), 'Salmon', 10.00, 4);

-- Draft Beer modifiers
INSERT INTO menu_modifier_groups (menu_item_id, name, required, display_order) VALUES
('menu-13', 'Selection', TRUE, 1);

INSERT INTO menu_modifier_options (modifier_group_id, name, price, display_order) VALUES
((SELECT id FROM menu_modifier_groups WHERE menu_item_id = 'menu-13' AND name = 'Selection'), 'IPA', 0, 1),
((SELECT id FROM menu_modifier_groups WHERE menu_item_id = 'menu-13' AND name = 'Selection'), 'Lager', 0, 2),
((SELECT id FROM menu_modifier_groups WHERE menu_item_id = 'menu-13' AND name = 'Selection'), 'Pilsner', 0, 3),
((SELECT id FROM menu_modifier_groups WHERE menu_item_id = 'menu-13' AND name = 'Selection'), 'Stout', 2.00, 4);

-- Soft Drinks modifiers
INSERT INTO menu_modifier_groups (menu_item_id, name, required, display_order) VALUES
('menu-14', 'Type', TRUE, 1);

INSERT INTO menu_modifier_options (modifier_group_id, name, price, display_order) VALUES
((SELECT id FROM menu_modifier_groups WHERE menu_item_id = 'menu-14' AND name = 'Type'), 'Coca-Cola', 0, 1),
((SELECT id FROM menu_modifier_groups WHERE menu_item_id = 'menu-14' AND name = 'Type'), 'Diet Coke', 0, 2),
((SELECT id FROM menu_modifier_groups WHERE menu_item_id = 'menu-14' AND name = 'Type'), 'Sprite', 0, 3),
((SELECT id FROM menu_modifier_groups WHERE menu_item_id = 'menu-14' AND name = 'Type'), 'Ginger Ale', 0, 4),
((SELECT id FROM menu_modifier_groups WHERE menu_item_id = 'menu-14' AND name = 'Type'), 'Root Beer', 0, 5),
((SELECT id FROM menu_modifier_groups WHERE menu_item_id = 'menu-14' AND name = 'Type'), 'Lemonade', 0, 6);

-- French Fries modifiers
INSERT INTO menu_modifier_groups (menu_item_id, name, required, display_order) VALUES
('menu-17', 'Sauce', FALSE, 1);

INSERT INTO menu_modifier_options (modifier_group_id, name, price, display_order) VALUES
((SELECT id FROM menu_modifier_groups WHERE menu_item_id = 'menu-17' AND name = 'Sauce'), 'No Sauce', 0, 1),
((SELECT id FROM menu_modifier_groups WHERE menu_item_id = 'menu-17' AND name = 'Sauce'), 'Ketchup', 0, 2),
((SELECT id FROM menu_modifier_groups WHERE menu_item_id = 'menu-17' AND name = 'Sauce'), 'Ranch', 0.50, 3),
((SELECT id FROM menu_modifier_groups WHERE menu_item_id = 'menu-17' AND name = 'Sauce'), 'Aioli', 0.50, 4),
((SELECT id FROM menu_modifier_groups WHERE menu_item_id = 'menu-17' AND name = 'Sauce'), 'Cheese Sauce', 1.00, 5);

-- ============================================
-- INSERT INVENTORY DATA
-- ============================================
INSERT INTO inventory (id, name, quantity, unit, min_threshold, category) VALUES
('inv-1', 'Ribeye', 24.00, 'portions', 10.00, 'protein'),
('inv-2', 'Salmon Fillet', 8.00, 'portions', 10.00, 'protein'),
('inv-3', 'Chicken Breast', 30.00, 'portions', 12.00, 'protein'),
('inv-4', 'House Red Wine', 3.00, 'bottles', 6.00, 'beverage'),
('inv-5', 'House White Wine', 8.00, 'bottles', 6.00, 'beverage'),
('inv-6', 'Romaine Lettuce', 15.00, 'heads', 8.00, 'produce'),
('inv-7', 'Lemons', 12.00, 'units', 20.00, 'produce'),
('inv-8', 'Olive Oil', 1.50, 'liters', 2.00, 'pantry'),
('inv-9', 'Bread Rolls', 6.00, 'units', 24.00, 'bakery'),
('inv-10', 'Parmesan Cheese', 4.00, 'lbs', 3.00, 'dairy'),
('inv-11', 'Heavy Cream', 6.00, 'quarts', 4.00, 'dairy'),
('inv-12', 'Pasta', 20.00, 'lbs', 10.00, 'pantry'),
('inv-13', 'Marinara Sauce', 8.00, 'quarts', 5.00, 'pantry'),
('inv-14', 'Chocolate Cake', 0.00, 'slices', 8.00, 'dessert'),
('inv-15', 'Tiramisu', 12.00, 'portions', 6.00, 'dessert');

-- ============================================
-- INSERT CURRENT ACTIVE ORDERS
-- ============================================
INSERT INTO orders (id, table_id, server_id, guest_count, status, tip, total, created_at, closed_at, shift) VALUES
('order-1', 't2', 'staff-2', 4, 'active', 0, 140.00, NOW() - INTERVAL '1 hour', NULL, 'dinner'),
('order-2', 't3', 'staff-2', 2, 'active', 0, 80.00, NOW() - INTERVAL '30 minutes', NULL, 'dinner'),
('order-3', 't5', 'staff-3', 3, 'active', 0, 108.00, NOW() - INTERVAL '2 hours', NULL, 'dinner'),
('order-4', 't7', 'staff-4', 2, 'active', 0, 18.00, NOW() - INTERVAL '15 minutes', NULL, 'dinner');

-- ============================================
-- INSERT ORDER ITEMS FOR ACTIVE ORDERS
-- ============================================
INSERT INTO order_items (id, order_id, menu_item_id, name, guest_number, modifications, notes, price, sent_to_kitchen) VALUES
('oi-1', 'order-1', 'menu-1', 'Ribeye Steak', 1, 'med-rare', 'no onions', 42.00, TRUE),
('oi-2', 'order-1', 'menu-2', 'Grilled Salmon', 2, '', '', 36.00, TRUE),
('oi-3', 'order-1', 'menu-11', 'House Red Wine', 1, '', '', 12.00, FALSE),
('oi-4', 'order-1', 'menu-11', 'House Red Wine', 2, '', '', 12.00, FALSE),
('oi-5', 'order-1', 'menu-5', 'Caesar Salad', 3, '', 'dressing on side', 14.00, TRUE),
('oi-6', 'order-1', 'menu-4', 'Pasta Primavera', 4, '', 'extra garlic', 24.00, TRUE),
('oi-7', 'order-2', 'menu-7', 'Calamari', 1, '', '', 16.00, TRUE),
('oi-8', 'order-2', 'menu-3', 'Chicken Parmesan', 1, '', '', 28.00, FALSE),
('oi-9', 'order-2', 'menu-2', 'Grilled Salmon', 2, '', 'well done', 36.00, FALSE),
('oi-10', 'order-3', 'menu-1', 'Ribeye Steak', 1, 'medium', '', 42.00, TRUE),
('oi-11', 'order-3', 'menu-1', 'Ribeye Steak', 2, 'med-well', '', 42.00, TRUE),
('oi-12', 'order-3', 'menu-4', 'Pasta Primavera', 3, '', '', 24.00, TRUE),
('oi-13', 'order-4', 'menu-6', 'Soup of the Day', 1, '', '', 9.00, TRUE),
('oi-14', 'order-4', 'menu-6', 'Soup of the Day', 2, '', '', 9.00, TRUE);

-- ============================================
-- INSERT CHITS (Kitchen Orders)
-- ============================================
INSERT INTO chits (id, order_id, table_number, server_name, status, run, created_at, completed_at) VALUES
('chit-1', 'order-1', 2, 'Maria Rodriguez', 'pending', FALSE, NOW() - INTERVAL '1 hour', NULL),
('chit-2', 'order-2', 3, 'Maria Rodriguez', 'ready', FALSE, NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '20 minutes'),
('chit-3', 'order-3', 5, 'Jake Thompson', 'pending', FALSE, NOW() - INTERVAL '2 hours', NULL),
('chit-4', 'order-4', 7, 'Sophie Chen', 'ready', FALSE, NOW() - INTERVAL '15 minutes', NOW() - INTERVAL '10 minutes');

-- ============================================
-- INSERT CHIT ITEMS
-- ============================================
INSERT INTO chit_items (id, chit_id, name, modifications, notes, guest_number, done) VALUES
('ci-1', 'chit-1', 'Ribeye Steak', 'med-rare', 'no onions', 1, TRUE),
('ci-2', 'chit-1', 'Grilled Salmon', '', '', 2, TRUE),
('ci-3', 'chit-1', 'Caesar Salad', '', 'dressing on side', 3, FALSE),
('ci-4', 'chit-1', 'Pasta Primavera', '', 'extra garlic', 4, FALSE),
('ci-5', 'chit-2', 'Calamari', '', '', 1, TRUE),
('ci-6', 'chit-3', 'Ribeye Steak', 'medium', '', 1, FALSE),
('ci-7', 'chit-3', 'Ribeye Steak', 'med-well', '', 2, FALSE),
('ci-8', 'chit-3', 'Pasta Primavera', '', '', 3, FALSE),
('ci-9', 'chit-4', 'Soup of the Day', '', '', 1, TRUE),
('ci-10', 'chit-4', 'Soup of the Day', '', '', 2, TRUE);

-- ============================================
-- INSERT MESSAGES
-- ============================================
INSERT INTO messages (id, from_role, to_role, from_user_id, to_user_id, from_name, to_name, text, type, read, timestamp) VALUES
('msg-1', 'server', 'kitchen', 'staff-2', NULL, 'Maria Rodriguez', 'Kitchen', 'Can we get 2 more ribeyes?', 'chat', FALSE, NOW() - INTERVAL '30 minutes'),
('msg-2', 'kitchen', 'server', NULL, 'staff-2', 'Kitchen', 'Maria Rodriguez', 'On it!', 'chat', FALSE, NOW() - INTERVAL '29 minutes');

-- ============================================
-- NOTE: Historical data generation
-- ============================================
-- The following tables would typically be populated with historical data:
-- - daily_sales_summary (84 days of sales data)
-- - server_performance (performance metrics per server per shift)
-- - scheduled_shifts (past 12 weeks + next 2 weeks)
-- - time_punches (clock in/out records)
-- - inventory_usage (daily inventory consumption)
-- - orders (historical completed orders)
-- - order_items (items from historical orders)
-- - chits (historical kitchen orders)
-- - chit_items (items from historical chits)
--
-- For a production deployment, you would:
-- 1. Use the data generation functions from generatedHistoricalData.js
-- 2. Convert the generated data to SQL INSERT statements
-- 3. Or use a script to populate these tables programmatically
--
-- Example: To generate 12 weeks of historical data, you would need approximately:
-- - 3,000-5,000 orders
-- - 10,000-15,000 order items
-- - 2,000-3,000 chits
-- - 84 daily sales summaries
-- - 500-700 server performance records
-- - 600-800 scheduled shifts
-- - 500-700 time punches
--
-- This seed file provides the schema and current active data.
-- Historical data can be generated using your application's data generation utilities.

-- ============================================
-- END OF DATABASE SEED FILE
-- ============================================
