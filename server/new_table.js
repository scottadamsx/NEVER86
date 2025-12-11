import {getMenu, getTables} from '../storage.js'
import {Order} from '../objects.js'

    // globals
    let newTable
    let numGuests
    let tables = getTables()
    let menu = getMenu()
    const display = document.getElementById("choiceDisplay")

    let order 
    let currentGuestId
    const orderedItems = document.getElementById("orderedItems")

document.addEventListener("DOMContentLoaded", () => {

    display.textContent = ""
    tables.forEach(table => {
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
    //create the new order
    order = new Order(newTable,numGuests)

    // create a radio input for each guest based on the chosen guest num
    for (let i = 0; i < numGuests; i++) {
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
        label.textContent = `Guest ${i+1}`

        // every time the radio switches, change the "currentGuestId" global and display all items
        
        input.addEventListener("change", () => {
            console.log("Guest selected:", input.value)
            currentGuestId = input.value
            let guestItems = order.items[input.value]
            console.log(guestItems)
            orderedItems.innerHTML = ""

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
        

        console.log(input,label)
        // add it to DOM
        document.getElementById("tableGuests").appendChild(input)
        document.getElementById("tableGuests").appendChild(label)
    }
    displayMenu()

    
}

function displayMenu() {
    const menuGrid = document.getElementById("menuGrid")
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



    
