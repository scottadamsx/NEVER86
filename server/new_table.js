import {getMenu, getTables, updateStorage} from '../storage.js'
import {Order, Table, Chit} from '../objects.js'
import {addItemsMenu, createOrderButtons} from './table_view.js'

// globals
let newTable
let numGuests
let tables = getTables()
let menu = getMenu()
const display = document.getElementById("choiceDisplay")
let chit

let server = "Scott Adams"
let order 

document.addEventListener("DOMContentLoaded", () => {
    display.textContent = ""
    tables.forEach(table => {
        if (table.status == "active") {return}
        const button = document.createElement("button")
        button.textContent = table.name
        display.appendChild(button)

        button.addEventListener("click", () => {
            tables.forEach(table => {
                if (table.name == button.textContent) {
                    console.log("chosen table:",table)
                    newTable = table
                    display.innerHTML = ""
                    document.getElementById("title").textContent = table.name
                    chooseNumGuests(8)
                }
            })
        })
    })
})

function chooseNumGuests(max) {
    document.getElementById("numGuests").textContent = "how many guests are dining at this table?"
    for (let i = 1; i <= max; i++) {
        const button = document.createElement("button")
        button.textContent = i
        display.appendChild(button)

        button.addEventListener("click", () => {
            numGuests = button.textContent
            document.getElementById("numGuests").textContent = `${numGuests} guests`
            display.innerHTML = ""
            startNewTableOrder()
        })
    }
}

function startNewTableOrder() {
    // create the new order
    order = new Order(newTable, numGuests)
    chit = new Chit(newTable)

    // FIX: Pass the chit to addItemsMenu so it's the same instance
    addItemsMenu(newTable, order, chit)
}

