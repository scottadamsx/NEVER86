import {Table, Order} from '../objects.js'
import { getMenu, getTables, updateStorage } from '../storage.js'

export function viewTableOrder(table) {
    // clear anything in the main rn
    const main = document.querySelector("main")
    main.innerHTML = ""

    const tableName = document.createElement("h1")
    tableName.textContent = table.name
    main.appendChild(tableName)

    const order = table.order.items

    let guestNum = 1
    order.forEach(seat => {
        // create guest title and add it to the DOM
        const seatTitle = document.createElement("h3")
        seatTitle.textContent = `Guest ${guestNum}`
        main.append(seatTitle)

        //create list of items for chosen guest and add it to the DOM
        const itemsList = document.createElement("ul")
        seat.forEach(item => {
            const li = document.createElement("li")
            li.textContent = item.name
            itemsList.appendChild(li)
        })
        main.appendChild(itemsList)
        // increment guest
        guestNum++
    })
    addItemsMenu(table)
}

export function addItemsMenu(table,order=table.order) {
    let currentGuestId = 0

    const main = document.querySelector("main")

    createOrderButtons(table,order)

    // create div for ordered items
    const orderedItems = document.createElement("div")
    orderedItems.id = "orderedItems"
    main.appendChild(orderedItems)

    // create a div for table guests
    const tableGuests = document.createElement("div")
    tableGuests.id = "tableGuests"
    main.appendChild(tableGuests)

    for (let i = 0; i < order.numGuests; i++) {
        const input = document.createElement("input")
        input.type = "radio"
        input.name = "guest"
        input.value = i
        input.id = i

        if (i == 0) {
            input.checked = true
            currentGuestId = input.value
        }
        const label = document.createElement("label")
        label.htmlFor = i
        label.textContent = `Guest ${i + 1}`

        // every time the radio switches, change the "currentGuestId" global and display all items
        input.addEventListener("change", () => {
            orderedItems.innerHTML = ''
            console.log("Guest selected:", input.value)
            currentGuestId = input.value
            let guestItems = order.items[input.value]
            console.log(guestItems)
           

            if (guestItems.length > 0) {
                const ul = document.createElement("ul")
                ul.id = "guestItemList"
                guestItems.forEach(item => {
                    const li = document.createElement("li")
                    li.textContent = `${item.name} - Price: ${item.price}`
                    ul.appendChild(li)
                })
                orderedItems.appendChild(ul)
            }
        })
        // TESTING: console.log(input,label)
        // add it to DOM
        tableGuests.appendChild(input)
        tableGuests.appendChild(label)
    }
    addItemsFromMenu(table,order, currentGuestId)
}

function addItemsFromMenu(table,order=table.order,currentGuestId) {

    // grab menu
    const menu = getMenu()

    const main = document.querySelector("main")
    const menuGrid = document.createElement("div")
    main.appendChild(menuGrid)
    
    // display menu items in the menuGrid
    menu.forEach(item => { 
        const button = document.createElement("button")

        const name = document.createElement("h4")
        name.textContent = item.name
        button.appendChild(name)

        const price = document.createElement("h4")
        price.textContent = item.price
        button.appendChild(price)
        
        // add an item when clicked 
        button.addEventListener("click", () => {
            order.addItem(item,currentGuestId)
            const p = document.createElement("p")
            p.textContent = `${item.name} - Price: ${item.price}`
            document.getElementById("orderedItems").appendChild(p)
            
            console.log(order)

        })
        menuGrid.appendChild(button)
    })
}

function createOrderButtons(table,order) {
    const tables = getTables()
    const menu = getMenu()

    const main = document.querySelector("main")
    // grab the div
    const div = document.createElement("div")

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
        console.log(table)
        table.seat(table.server, order)

        // Find the matching table in the tables array and update it
        const tableToUpdate = tables.find(t => t.name === table.name)
        if (tableToUpdate) {
            tableToUpdate.seat(table.server, order)
        }
        updateStorage(tables, menu)
        window.location.href = "home.html"
    })
    div.appendChild(submitOrderBtn)
    main.appendChild(div)
}
