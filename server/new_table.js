import {getMenu, getTables} from '../storage.js'
import {Order, Chit} from '../objects.js'
import {addItemsMenu} from './table_view.js'

// globals
let newTable
let numGuests
let tables
let menu
const display = document.getElementById("choiceDisplay")
let chit
let order 

const SERVER_NAME = "Scott Adams" // You can change this or make it dynamic

document.addEventListener("DOMContentLoaded", async () => {
    // Load data
    tables = await getTables()
    menu = await getMenu()
    
    display.textContent = ""
    
    // Show only available tables
    const availableTables = tables.filter(table => table.status === "available")
    
    if (availableTables.length === 0) {
        display.innerHTML = "<p>No available tables. Please clear a table first.</p>"
        return
    }
    
    availableTables.forEach(table => {
        const button = document.createElement("button")
        button.textContent = `${table.name} (${table.capacity} seats)`
        display.appendChild(button)

        button.addEventListener("click", () => {
            console.log("Chosen table:", table)
            newTable = table
            display.innerHTML = ""
            document.getElementById("title").textContent = table.name
            // Use the table's actual capacity instead of max 8
            chooseNumGuests(table.capacity)
        })
    })
})

function chooseNumGuests(max) {
    document.getElementById("numGuests").textContent = `How many guests are dining at this table? (Max: ${max})`
    
    for (let i = 1; i <= max; i++) {
        const button = document.createElement("button")
        button.textContent = i
        display.appendChild(button)

        button.addEventListener("click", () => {
            numGuests = parseInt(button.textContent)
            document.getElementById("numGuests").textContent = `${numGuests} guest${numGuests > 1 ? 's' : ''}`
            display.innerHTML = ""
            startNewTableOrder()
        })
    }
}

function startNewTableOrder() {
    // Create the new order using the new Order class
    order = new Order(newTable.id, numGuests, SERVER_NAME)
    
    // Create chit
    chit = new Chit(newTable, order)

    // Start the ordering interface
    addItemsMenu(newTable, order, chit)
}