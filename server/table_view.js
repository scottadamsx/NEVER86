import {Order, Chit} from '../objects.js'
import { getMenu, getTables, updateStorage, sendChitToKitchen } from '../storage.js'

export function viewTableOrder(table) {
    const main = document.querySelector("main")
    main.innerHTML = ""

    const tableName = document.createElement("h1")
    tableName.textContent = table.name
    main.appendChild(tableName)

    if (!table.order) {
        const noOrder = document.createElement("p")
        noOrder.textContent = "No order for this table"
        main.appendChild(noOrder)
        return
    }

    const order = table.order

    // Display each guest's order
    order.items.forEach((guest, index) => {
        const seatTitle = document.createElement("h3")
        seatTitle.textContent = `Guest ${guest.guestNumber}`
        main.appendChild(seatTitle)

        const itemsList = document.createElement("ul")
        guest.items.forEach(item => {
            const li = document.createElement("li")
            li.textContent = `${item.name} - $${item.price.toFixed(2)}`
            itemsList.appendChild(li)
        })
        main.appendChild(itemsList)
    })

    // Show totals
    const totalsDiv = document.createElement("div")
    totalsDiv.style.marginTop = "20px"
    totalsDiv.style.padding = "15px"
    totalsDiv.style.background = "#f0f4ff"
    totalsDiv.style.borderRadius = "8px"
    totalsDiv.innerHTML = `
        <h3>Order Summary</h3>
        <p><strong>Subtotal:</strong> $${order.subtotal.toFixed(2)}</p>
        <p><strong>Tax (15%):</strong> $${order.tax.toFixed(2)}</p>
        <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
        <p><strong>Status:</strong> ${order.status}</p>
    `
    main.appendChild(totalsDiv)

    // Add option to add more items
    addItemsMenu(table, order)
}

export function addItemsMenu(table, order, chit = null) {
    const guestState = { currentGuestId: 0 }
    const main = document.querySelector("main")

    // Create chit if not provided
    if (!chit) {
        chit = new Chit(table, order)
    }

    createOrderButtons(table, order, chit)

    // Create div for ordered items
    const orderedItems = document.createElement("div")
    orderedItems.id = "orderedItems"
    main.appendChild(orderedItems)

    // Create div for guest selector
    const tableGuests = document.createElement("div")
    tableGuests.id = "tableGuests"
    main.appendChild(tableGuests)

    // Create guest radio buttons
    for (let i = 0; i < order.numGuests; i++) {
        const input = document.createElement("input")
        input.type = "radio"
        input.name = "guest"
        input.value = i
        input.id = `guest${i}`

        if (i === 0) {
            input.checked = true
            guestState.currentGuestId = 0
        }

        const label = document.createElement("label")
        label.htmlFor = `guest${i}`
        label.textContent = `Guest ${i + 1}`

        input.addEventListener("change", () => {
            orderedItems.innerHTML = ''
            guestState.currentGuestId = parseInt(input.value)
            
            const guestItems = order.items[guestState.currentGuestId].items
            
            if (guestItems.length > 0) {
                const ul = document.createElement("ul")
                ul.id = "guestItemList"
                guestItems.forEach((item, itemIndex) => {
                    const li = document.createElement("li")
                    li.textContent = `${item.name} - $${item.price.toFixed(2)}`
                    
                    // Add remove button
                    const removeBtn = document.createElement("button")
                    removeBtn.textContent = "Remove"
                    removeBtn.style.marginLeft = "10px"
                    removeBtn.style.background = "#ef4444"
                    removeBtn.addEventListener("click", () => {
                        order.removeItem(guestState.currentGuestId, itemIndex)
                        // Refresh display
                        input.dispatchEvent(new Event('change'))
                    })
                    li.appendChild(removeBtn)
                    ul.appendChild(li)
                })
                orderedItems.appendChild(ul)
            } else {
                orderedItems.innerHTML = "<p>No items ordered yet</p>"
            }
        })

        tableGuests.appendChild(input)
        tableGuests.appendChild(label)
    }

    // Add items from menu
    addItemsFromMenu(table, guestState, order, chit)
}

async function addItemsFromMenu(table, guestState, order, chit) {
    const menu = await getMenu()
    const main = document.querySelector("main")
    const menuGrid = document.createElement("div")
    menuGrid.style.display = "grid"
    menuGrid.style.gridTemplateColumns = "repeat(auto-fill, minmax(200px, 1fr))"
    menuGrid.style.gap = "15px"
    menuGrid.style.marginTop = "20px"
    main.appendChild(menuGrid)
    
    // Group items by category
    const categories = {}
    menu.forEach(item => {
        if (item.available) {
            const cat = item.category || "Uncategorized"
            if (!categories[cat]) categories[cat] = []
            categories[cat].push(item)
        }
    })

    // Display menu items by category
    Object.keys(categories).sort().forEach(category => {
        const categorySection = document.createElement("div")
        categorySection.style.gridColumn = "1 / -1"
        
        const categoryTitle = document.createElement("h3")
        categoryTitle.textContent = category
        categoryTitle.style.marginTop = "20px"
        categoryTitle.style.marginBottom = "10px"
        categoryTitle.style.color = "#3577fb"
        categorySection.appendChild(categoryTitle)
        menuGrid.appendChild(categorySection)

        categories[category].forEach(item => { 
            const button = document.createElement("button")
            button.style.display = "flex"
            button.style.flexDirection = "column"
            button.style.alignItems = "center"
            button.style.padding = "15px"
            button.style.height = "auto"
        
            const name = document.createElement("h4")
            name.textContent = item.name
            name.style.margin = "0 0 5px 0"
            button.appendChild(name)

            const price = document.createElement("h4")
            price.textContent = `$${item.price.toFixed(2)}`
            price.style.margin = "0"
            price.style.color = "#10b981"
            button.appendChild(price)
            
            if (item.description) {
                const desc = document.createElement("p")
                desc.textContent = item.description
                desc.style.fontSize = "0.8em"
                desc.style.margin = "5px 0 0 0"
                desc.style.color = "#666"
                button.appendChild(desc)
            }
            
            button.addEventListener("click", () => {
                const currentGuest = guestState.currentGuestId
                console.log(`Adding ${item.name} for Guest ${currentGuest + 1}`)
                
                // Add item to order
                order.addItem(item, currentGuest)
                
                // Update chit with new items
                chit.items = order.getAllItems()
                
                // Show feedback
                const p = document.createElement("p")
                p.textContent = `${item.name} - $${item.price.toFixed(2)}`
                p.style.animation = "fadeIn 0.3s"
                document.getElementById("orderedItems").appendChild(p)
                
                console.log("Current order:", order)
                console.log("Updated chit:", chit)
            })
            menuGrid.appendChild(button)
        })
    })
}

export function createOrderButtons(table, order, chit) {
    const main = document.querySelector("main")
    const div = document.createElement("div")
    div.style.marginBottom = "20px"
    div.style.display = "flex"
    div.style.gap = "10px"

    // Cancel button
    const cancelOrderBtn = document.createElement("button")
    cancelOrderBtn.textContent = "Cancel Order"
    cancelOrderBtn.style.background = "#ef4444"
    cancelOrderBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to cancel this order?")) {
            window.location.href = "new_table.html"
        }
    })
    div.appendChild(cancelOrderBtn)

    // Submit button
    const submitOrderBtn = document.createElement("button")
    submitOrderBtn.textContent = "Send To Kitchen"
    submitOrderBtn.style.background = "#10b981"
    submitOrderBtn.addEventListener("click", async () => {
        if (order.getAllItems().length === 0) {
            alert("Please add at least one item to the order")
            return
        }

        console.log("Submitting order for table:", table)
        console.log("Order:", order)
        console.log("Chit being sent:", chit)
        
        // Mark order as sent
        order.markSent()
        
        // Seat the table
        table.seat(order.server, order)

        // Send chit to kitchen
        await sendChitToKitchen(chit)

        // Update tables in storage
        const tables = await getTables()
        const menu = await getMenu()
        const tableToUpdate = tables.find(t => t.id === table.id)
        if (tableToUpdate) {
            tableToUpdate.seat(order.server, order)
        }
        await updateStorage(tables, menu)
        
        alert(`Order sent to kitchen!\nTotal: ${order.total.toFixed(2)}`)
        window.location.href = "my_tables.html"
    })
    div.appendChild(submitOrderBtn)
    
    main.appendChild(div)
}