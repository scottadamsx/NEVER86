import {getMenu, getTables, updateStorage} from '../storage.js'
import {Order,Table} from '../objects.js'
import {addItemsMenu} from './table_view.js'

    // globals
    let newTable
    let numGuests
    let tables = getTables()
    let menu = getMenu()
    const display = document.getElementById("choiceDisplay")

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
    order = new Order(newTable,numGuests)

    createOrderButtons()

    // create a radio input for each guest based on the chosen guest num
    addItemsMenu(newTable, order)

    
}




function createOrderButtons() {
    const main = document.querySelector("main")
    // grab the div
    const div = document.querySelector("#orderButtons")

    // create the cancel order button
    const cancelOrderBtn = document.createElement("button")
    cancelOrderBtn.textContent = "Cancel Order"
    cancelOrderBtn.style.background = "red"
    cancelOrderBtn.addEventListener("click", () => {
        window.location.reload()
    })
    div.appendChild(cancelOrderBtn)

    // create the send to kitchen button
    const submitOrderBtn = document.createElement("button")
    submitOrderBtn.textContent = "Send To Kitchen"
    submitOrderBtn.style.background = "green"
    submitOrderBtn.addEventListener("click", () => {
        console.log(newTable)
        newTable.seat(server, order)
        updateStorage(tables, menu)
        window.location.href = "home.html"
    })
    div.appendChild(submitOrderBtn)
    main.appendChild(div)
}
    
