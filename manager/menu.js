import {getMenu, getTables, updateStorage} from '../storage.js'


document.addEventListener("DOMContentLoaded", () => {
    const newItemBtn = document.getElementById("addItemBtn")

    let tables = getTables()
    let menu = getMenu()

    updateMenuDisplay(menu)

    newItemBtn.addEventListener("click", () => {
        let contentDiv = document.getElementById("content")

        const nameLabel = document.createElement("label")
        nameLabel.textContent = "Item Name: "
        const nameInput = document.createElement("input")
        const priceLabel = document.createElement("label")
        priceLabel.textContent = "Item Price: "
        const priceInput = document.createElement("input")
        const submitBtn = document.createElement("button")
        submitBtn.textContent = "Submit New Menu Item"
        
        contentDiv.appendChild(nameLabel)
        contentDiv.appendChild(nameInput)
        contentDiv.appendChild(priceLabel)
        contentDiv.appendChild(priceInput)
        contentDiv.appendChild(submitBtn)
        
        submitBtn.addEventListener("click", () => {
            menu.push({name: nameInput.value, price: priceInput.value})
            console.log("Menu item added:", nameInput.value)
            nameLabel.remove()
            nameInput.remove()
            priceLabel.remove()
            priceInput.remove()
            submitBtn.remove()
            updateStorage(tables,menu)
            updateMenuDisplay(menu)
        })
    })
})

function updateMenuDisplay(menu) {
    const display = document.getElementById("itemTable")
    display.innerHTML = ""

    // create header row
    const row = document.createElement("tr")

    const name = document.createElement("th")
    name.textContent = "Name"
    row.appendChild(name)

    const price = document.createElement("th")
    price.textContent = "Price"
    row.appendChild(price)
    display.appendChild(row)

    // add in every item to the table
    menu.forEach(item => {
        const row = document.createElement("tr")

        const name = document.createElement("td")
        name.textContent = item.name
        row.appendChild(name)

        const price = document.createElement("td")
        price.textContent = item.price
        row.appendChild(price)
        
        display.appendChild(row)
    })
}
