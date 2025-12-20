import {getMenu, getTables} from '../storage.js'
import { viewTableOrder } from './table_view.js'

document.addEventListener("DOMContentLoaded", async () => {
    console.log("My Tables page loaded")
    
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
    
    // Only show occupied tables
    const activeTables = tables.filter(table => table.status === "occupied")
    
    if (activeTables.length === 0) {
        const message = document.createElement("p")
        message.textContent = "No active tables"
        message.style.textAlign = "center"
        message.style.color = "#666"
        display.appendChild(message)
        return
    }
    
    activeTables.forEach(table => {
        const button = document.createElement("button")
        button.textContent = table.name
        button.style.background = "#152b4eff"
        display.appendChild(button)
    
        button.addEventListener("click", () => {
            tableClick(table)
        })
    })
}

function tableClick(table) {
    console.log("Chosen table:", table)
    viewTableOrder(table)
}