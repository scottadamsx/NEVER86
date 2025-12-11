import {getMenu, getTables, updateStorage} from '../storage.js'
import {Table} from '../objects.js'

document.addEventListener("DOMContentLoaded", () => {
    const newTableBtn = document.getElementById("addTableBtn")

    let tables = getTables()
    let menu = getMenu()

    updateTableDisplay(tables)

    newTableBtn.addEventListener("click", () => {
        let contentDiv = document.getElementById("content")

        const label = document.createElement("label")
        label.textContent = "Table Name: "
        const input = document.createElement("input")
        const submitBtn = document.createElement("button")
        submitBtn.textContent = "Submit New Table"
        
        contentDiv.appendChild(label)
        contentDiv.appendChild(input)
        contentDiv.appendChild(submitBtn)
        
        submitBtn.addEventListener("click", () => {
            const table = new Table(input.value)
            tables.push(table)
            console.log("Table added:", input.value)
            label.remove()
            input.remove()
            submitBtn.remove()
            updateStorage(tables,menu)
            updateTableDisplay(tables)
        })
    })

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
