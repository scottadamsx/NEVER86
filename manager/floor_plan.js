import {getMenu, getTables, updateStorage, removeTableByTableName} from '../storage.js'
import {Table} from '../objects.js'

document.addEventListener("DOMContentLoaded", async () => {
    console.log("Floor plan loaded")
    
    const newTableBtn = document.getElementById("addTableBtn")
    const removeTableBtn = document.getElementById("removeTableBtn")

    console.log("Add button:", newTableBtn)
    console.log("Remove button:", removeTableBtn)

    // Load data asynchronously
    let tables = await getTables()
    let menu = await getMenu()

    updateTableDisplay(tables)

    if (!newTableBtn || !removeTableBtn) {
        console.error("Buttons not found!")
        return
    }

    newTableBtn.addEventListener("click", () => {
        console.log("Add table button clicked!")
        let contentDiv = document.getElementById("content")

        const label = document.createElement("label")
        label.textContent = "Table Name: "
        const input = document.createElement("input")
        
        const capacityLabel = document.createElement("label")
        capacityLabel.textContent = "Capacity: "
        const capacityInput = document.createElement("input")
        capacityInput.type = "number"
        capacityInput.value = "4"
        capacityInput.min = "1"
        capacityInput.max = "12"
        
        const submitBtn = document.createElement("button")
        submitBtn.textContent = "Submit New Table"
        
        contentDiv.appendChild(label)
        contentDiv.appendChild(input)
        contentDiv.appendChild(capacityLabel)
        contentDiv.appendChild(capacityInput)
        contentDiv.appendChild(submitBtn)
        
        submitBtn.addEventListener("click", async () => {
            const tableName = input.value.trim()
            const capacity = parseInt(capacityInput.value)
            
            if (!tableName) {
                alert("Please enter a table name")
                return
            }
            
            // Create new table
            const newTable = new Table(tableName, capacity)
            tables.push(newTable)
            
            console.log("Table added:", newTable)
            
            // Save to storage
            await updateStorage(tables, menu)
            
            // Clean up UI
            label.remove()
            input.remove()
            capacityLabel.remove()
            capacityInput.remove()
            submitBtn.remove()
            
            // Reload tables and update display
            tables = await getTables()
            updateTableDisplay(tables)
        })
    })

    removeTableBtn.addEventListener("click", async () => {
        let tableName = prompt("Which table would you like to remove?:")
        if (tableName) {
            await removeTableByTableName(tableName)
            tables = await getTables()
            updateTableDisplay(tables)
        }
    })
})

function updateTableDisplay(tables) {
    const display = document.getElementById("tableDisplay")
    display.textContent = ""
    
    if (!Array.isArray(tables)) {
        console.error("tables is not an array:", tables)
        return
    }
    
    tables.forEach(table => {
        const button = document.createElement("button")
        button.textContent = `${table.name} (${table.capacity} seats)`
        
        // Color code by status
        if (table.status === "occupied") {
            button.style.background = "#152b4eff"
        } else if (table.status === "reserved") {
            button.style.background = "#f59e0b"
        } else if (table.status === "cleaning") {
            button.style.background = "#ef4444"
        }
        
        display.appendChild(button)
        
        // Add click handler to show table info
        button.addEventListener("click", () => {
            showTableInfo(table)
        })
    })
}

function showTableInfo(table) {
    const info = table.getInfo()
    const infoText = `
Table: ${info.name}
Capacity: ${info.capacity}
Status: ${info.status}
Server: ${info.server || 'None'}
Has Order: ${info.hasOrder ? 'Yes' : 'No'}
${info.seatedDuration ? `Seated for: ${info.seatedDuration}` : ''}
    `.trim()
    
    alert(infoText)
}