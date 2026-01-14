import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const DATA_DIR = path.join(__dirname, 'data');

// Middleware
app.use(express.json());
app.use(express.static(__dirname)); // Serve static files

// Ensure data directory exists
async function ensureDataDir() {
    try {
        await fs.access(DATA_DIR);
    } catch {
        await fs.mkdir(DATA_DIR, { recursive: true });
        console.log('Created data directory');
    }
}

// Get file path for a given key
function getFilePath(key) {
    return path.join(DATA_DIR, `${key}.json`);
}

// API: Load data
app.get('/api/load/:key', async (req, res) => {
    try {
        const filePath = getFilePath(req.params.key);
        const data = await fs.readFile(filePath, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        if (error.code === 'ENOENT') {
            // File doesn't exist, return empty array
            res.json([]);
        } else {
            console.error('Error loading data:', error);
            res.status(500).json({ error: 'Failed to load data' });
        }
    }
});

// API: Save data
app.post('/api/save/:key', async (req, res) => {
    try {
        const filePath = getFilePath(req.params.key);
        await fs.writeFile(filePath, JSON.stringify(req.body, null, 2));
        res.json({ success: true, message: `${req.params.key} saved` });
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ error: 'Failed to save data' });
    }
});

// API: Export all data
app.get('/api/export', async (req, res) => {
    try {
        const tables = await fs.readFile(getFilePath('tables'), 'utf8').catch(() => '[]');
        const menu = await fs.readFile(getFilePath('menu'), 'utf8').catch(() => '[]');
        const kitchen = await fs.readFile(getFilePath('kitchen'), 'utf8').catch(() => '[]');
        
        res.json({
            tables: JSON.parse(tables),
            menu: JSON.parse(menu),
            kitchen: JSON.parse(kitchen),
            exportDate: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error exporting data:', error);
        res.status(500).json({ error: 'Failed to export data' });
    }
});

// API: Import data
app.post('/api/import', async (req, res) => {
    try {
        const { tables, menu, kitchen } = req.body;
        
        if (tables) await fs.writeFile(getFilePath('tables'), JSON.stringify(tables, null, 2));
        if (menu) await fs.writeFile(getFilePath('menu'), JSON.stringify(menu, null, 2));
        if (kitchen) await fs.writeFile(getFilePath('kitchen'), JSON.stringify(kitchen, null, 2));
        
        res.json({ success: true, message: 'Data imported successfully' });
    } catch (error) {
        console.error('Error importing data:', error);
        res.status(500).json({ error: 'Failed to import data' });
    }
});

// Start server
async function startServer() {
    await ensureDataDir();
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        console.log(`Data directory: ${DATA_DIR}`);
    });
}

startServer();