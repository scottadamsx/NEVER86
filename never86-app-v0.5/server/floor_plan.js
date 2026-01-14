import {getMenu, getTables} from '../storage.js'

document.addEventListener("DOMContentLoaded", async () => {
    console.log("Server Floor Plan loaded")
    
    let tables = await getTables()
    let menu = await getMenu()
    
    console.log("Tables loaded:", tables)
    console.log("Menu loaded:", menu)

    updateTableDisplay(tables)
})

function updateTableDisplay(tables) {
    const display = document.getElementById("tableDisplay")
    display.textContent = ""
    
    console.log("updateTableDisplay called with:", tables)
    console.log("Is array?", Array.isArray(tables))
    
    if (!tables) {
        console.error("tables is null or undefined")
        return
    }
    
    if (!Array.isArray(tables)) {
        console.error("tables is not an array:", tables)
        return
    }
    
    tables.forEach(table => {
        const button = document.createElement("button")
        button.textContent = table.name
        
        if (table.status === "occupied") {
            button.style.background = "#152b4eff"
        } else if (table.status === "reserved") {
            button.style.background = "#f59e0b"
        }
        
        display.appendChild(button)

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
    
    console.log("Chosen table:", table)
    alert(infoText)
}