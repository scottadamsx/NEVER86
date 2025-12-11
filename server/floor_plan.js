import {getMenu, getTables} from '../storage.js'


document.addEventListener("DOMContentLoaded", () => {

    let tables = getTables()
    let menu = getMenu()

    updateTableDisplay(tables)

})

function updateTableDisplay(tables) {
    const display = document.getElementById("tableDisplay")
    display.textContent = ""
    tables.forEach(table => {
        const button = document.createElement("button")
        button.textContent = table.name
        display.appendChild(button)
    })
}
