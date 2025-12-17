import {getMenu, getTables} from '../storage.js'
import { viewTableOrder } from './table_view.js'


document.addEventListener("DOMContentLoaded", () => {

    let tables = getTables()
    let menu = getMenu()

    updateTableDisplay(tables)
})

function updateTableDisplay(tables) {
    const display = document.getElementById("tableDisplay")
    display.textContent = ""
    tables.forEach(table => {
        if (table.status == "active") {
            const button = document.createElement("button")
            button.textContent = table.name
            button.style.background = "#152b4eff"
            display.appendChild(button)
        
            button.addEventListener("click", () => {
                tables.forEach(table => {
                    if (table.name == button.textContent) {
                        tableClick(table)
                    }
                })
            })
        }
    })
}

function tableClick(table) {
    console.log("chosen table:",table)
    viewTableOrder(table)
}