import { getKitchen } from '../storage.js'

document.addEventListener("DOMContentLoaded", async () => {
    await displayKitchenOrders()
})

async function displayKitchenOrders() {
    const main = document.querySelector("main")
    main.innerHTML = ""
    
    const kitchen = await getKitchen()
    
    if (kitchen.length === 0) {
        const emptyMessage = document.createElement("h2")
        emptyMessage.textContent = "No orders in the kitchen"
        emptyMessage.style.textAlign = "center"
        emptyMessage.style.marginTop = "50px"
        main.appendChild(emptyMessage)
        return
    }
    
    const ordersContainer = document.createElement("div")
    ordersContainer.className = "orders-container"
    main.appendChild(ordersContainer)
    
    kitchen.forEach((chit, index) => {
        const chitCard = createChitCard(chit, index)
        ordersContainer.appendChild(chitCard)
    })
}

function createChitCard(chit, index) {
    const card = document.createElement("div")
    card.className = "chit-card"
    
    // Header with table name and timestamp
    const header = document.createElement("div")
    header.className = "chit-header"
    
    const tableName = document.createElement("h2")
    tableName.textContent = chit.tableName
    header.appendChild(tableName)
    
    const timestamp = document.createElement("p")
    const time = new Date(chit.timeStamp || chit.createdAt)
    timestamp.textContent = time.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
    })
    timestamp.className = "timestamp"
    header.appendChild(timestamp)
    
    card.appendChild(header)
    
    // Items list
    const itemsList = document.createElement("ul")
    itemsList.className = "chit-items"
    
    chit.items.forEach(item => {
        const li = document.createElement("li")
        li.textContent = `${item.name} - ${item.price.toFixed(2)}`
        itemsList.appendChild(li)
    })
    
    card.appendChild(itemsList)
    
    // Buttons container
    const buttonsDiv = document.createElement("div")
    buttonsDiv.className = "chit-buttons"
    
    // Complete button
    const completeBtn = document.createElement("button")
    completeBtn.textContent = "Complete Order"
    completeBtn.className = "complete-btn"
    completeBtn.addEventListener("click", () => {
        completeOrder(index)
    })
    buttonsDiv.appendChild(completeBtn)
    
    // Delete button
    const deleteBtn = document.createElement("button")
    deleteBtn.textContent = "Delete"
    deleteBtn.className = "delete-btn"
    deleteBtn.addEventListener("click", () => {
        deleteOrder(index)
    })
    buttonsDiv.appendChild(deleteBtn)
    
    card.appendChild(buttonsDiv)
    
    return card
}

async function completeOrder(index) {
    let kitchen = await getKitchen()
    
    // Remove the completed order
    kitchen.splice(index, 1)
    
    // Update storage using the storage module
    localStorage.kitchen = JSON.stringify(kitchen)
    
    console.log(`Order ${index} completed!`)
    
    // Refresh the display
    await displayKitchenOrders()
}

async function deleteOrder(index) {
    if (confirm("Are you sure you want to delete this order?")) {
        let kitchen = await getKitchen()
        
        // Remove the order
        kitchen.splice(index, 1)
        
        // Update storage
        localStorage.kitchen = JSON.stringify(kitchen)
        
        console.log(`Order ${index} deleted!`)
        
        // Refresh the display
        await displayKitchenOrders()
    }
}