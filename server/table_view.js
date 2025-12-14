import {Table} from '../objects.js'

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
}