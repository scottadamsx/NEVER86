import {getMenu, getTables, updateStorage} from '../storage.js'
import {Item} from '../objects.js'

document.addEventListener("DOMContentLoaded", async () => {
    console.log("Menu page loaded")
    
    const newItemBtn = document.getElementById("addItemBtn")
    console.log("Add item button:", newItemBtn)

    let tables = await getTables()
    let menu = await getMenu()
    
    console.log("Tables:", tables)
    console.log("Menu:", menu)

    updateMenuDisplay(menu)

    if (!newItemBtn) {
        console.error("Add item button not found!")
        return
    }

    newItemBtn.addEventListener("click", () => {
        console.log("Add item button clicked!")
        let contentDiv = document.getElementById("content")

        const nameLabel = document.createElement("label")
        nameLabel.textContent = "Item Name: "
        const nameInput = document.createElement("input")
        
        const priceLabel = document.createElement("label")
        priceLabel.textContent = "Item Price: "
        const priceInput = document.createElement("input")
        priceInput.type = "number"
        priceInput.step = "0.01"
        priceInput.min = "0"
        
        const categoryLabel = document.createElement("label")
        categoryLabel.textContent = "Category: "
        const categoryInput = document.createElement("input")
        categoryInput.placeholder = "e.g., Appetizers, Entrees, Desserts"
        
        const descLabel = document.createElement("label")
        descLabel.textContent = "Description: "
        const descInput = document.createElement("textarea")
        descInput.rows = "3"
        
        const submitBtn = document.createElement("button")
        submitBtn.textContent = "Submit New Menu Item"
        
        contentDiv.appendChild(nameLabel)
        contentDiv.appendChild(nameInput)
        contentDiv.appendChild(priceLabel)
        contentDiv.appendChild(priceInput)
        contentDiv.appendChild(categoryLabel)
        contentDiv.appendChild(categoryInput)
        contentDiv.appendChild(descLabel)
        contentDiv.appendChild(descInput)
        contentDiv.appendChild(submitBtn)
        
        submitBtn.addEventListener("click", async () => {
            const name = nameInput.value.trim()
            const price = parseFloat(priceInput.value)
            const category = categoryInput.value.trim() || "Uncategorized"
            const description = descInput.value.trim()
            
            if (!name || !price || price <= 0) {
                alert("Please enter a valid name and price")
                return
            }
            
            // Create new menu item
            const newItem = new Item(name, price, category, description)
            menu.push(newItem)
            
            // Save to storage
            await updateStorage(tables, menu)
            
            console.log("Menu item added:", name)
            
            // Clean up
            nameLabel.remove()
            nameInput.remove()
            priceLabel.remove()
            priceInput.remove()
            categoryLabel.remove()
            categoryInput.remove()
            descLabel.remove()
            descInput.remove()
            submitBtn.remove()
            
            // Reload and display
            menu = await getMenu()
            updateMenuDisplay(menu)
        })
    })
})

function updateMenuDisplay(menu) {
    const display = document.getElementById("itemTable")
    display.innerHTML = ""

    // Check if menu is valid
    if (!menu) {
        console.error("menu is null or undefined")
        return
    }

    if (!Array.isArray(menu)) {
        console.error("menu is not an array:", menu)
        return
    }

    // Create header row
    const headerRow = document.createElement("tr")

    const nameHeader = document.createElement("th")
    nameHeader.textContent = "Name"
    headerRow.appendChild(nameHeader)

    const priceHeader = document.createElement("th")
    priceHeader.textContent = "Price"
    headerRow.appendChild(priceHeader)

    const categoryHeader = document.createElement("th")
    categoryHeader.textContent = "Category"
    headerRow.appendChild(categoryHeader)

    const statusHeader = document.createElement("th")
    statusHeader.textContent = "Status"
    headerRow.appendChild(statusHeader)

    display.appendChild(headerRow)

    // Add items to table
    menu.forEach(item => {
        if (!item) return; // Skip null/undefined items
        
        const row = document.createElement("tr")

        const nameCell = document.createElement("td")
        nameCell.textContent = item.name || "Unknown"
        nameCell.title = item.description || ""
        row.appendChild(nameCell)

        const priceCell = document.createElement("td")
        const price = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0
        priceCell.textContent = `$${price.toFixed(2)}`
        row.appendChild(priceCell)

        const categoryCell = document.createElement("td")
        categoryCell.textContent = item.category || "Uncategorized"
        row.appendChild(categoryCell)

        const statusCell = document.createElement("td")
        const isAvailable = item.available !== false // Default to true if not specified
        statusCell.textContent = isAvailable ? "Available" : "86'd"
        statusCell.style.color = isAvailable ? "#10b981" : "#ef4444"
        statusCell.style.fontWeight = "bold"
        row.appendChild(statusCell)
        
        display.appendChild(row)
    })
}