import {Table, Order, Chit} from '../objects.js'
import { getMenu, getTables, updateStorage, sendChitToKitchen } from '../storage.js'

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

// FIX: Pass chit as parameter to keep it consistent
export function addItemsMenu(table, order=table.order, chit=null) {
    // FIX: Use an object to hold currentGuestId so it can be referenced by menu buttons
    const guestState = { currentGuestId: 0 }

    const main = document.querySelector("main")

    // FIX: Create chit here if not provided
    if (!chit) {
        chit = new Chit(table)
    }

    createOrderButtons(table, order, chit)

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
            guestState.currentGuestId = input.value
        }
        const label = document.createElement("label")
        label.htmlFor = i
        label.textContent = `Guest ${i + 1}`

        // every time the radio switches, change the "currentGuestId" and display all items
        input.addEventListener("change", () => {
            orderedItems.innerHTML = ''
            console.log("Guest selected:", input.value)
            guestState.currentGuestId = input.value
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
        // add it to DOM
        tableGuests.appendChild(input)
        tableGuests.appendChild(label)
    }
    // FIX: Pass the guestState object instead of the value
    addItemsFromMenu(table, guestState, order, chit)
}

// FIX: Accept guestState object to get current guest dynamically
function addItemsFromMenu(table, guestState, order=table.order, chit) {
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
            // FIX: Use guestState.currentGuestId to get the CURRENT guest at click time
            const currentGuest = guestState.currentGuestId
            console.log(`Adding ${item.name} for Guest ${parseInt(currentGuest) + 1}`)
            
            // add it to the order for the correct guest
            order.addItem(item, currentGuest)
            // add it to chit (same chit instance throughout)
            chit.addItem(item)
            const p = document.createElement("p")
            p.textContent = `${item.name} - Price: ${item.price}`
            document.getElementById("orderedItems").appendChild(p)
            
            console.log("Current order:", order)
            console.log("Current chit:", chit)
        })
        menuGrid.appendChild(button)
    })
}

export function createOrderButtons(table, order, chit) {
    const tables = getTables()
    const menu = getMenu()

    const main = document.querySelector("main")
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
        console.log("Submitting order for table:", table)
        console.log("Chit being sent:", chit)
        
        // Seat the table with the order
        table.seat(table.server, order)

        // Send the chit to kitchen
        sendChitToKitchen(chit)

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