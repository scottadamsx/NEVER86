export class Table {
    constructor(name) {
        this.name = name
        this.server = null
        this.order = null
    }
    seat(server,order) {
        this.server = server
        this.order = order
    }
    
}

export class Order {
    constructor(table,numGuests) {
        this.table = table
        this.numGuests = numGuests
        this.items = []
        for (let i = 0; i < numGuests; i++) {
            this.items.push([])
        }
    }
    addItem(item,guestId) {
        this.items[guestId].push(item)
        console.log(`Guest ${parseInt(guestId) + 1} ordered ${item.name}!`)
    }
}

export class Item {
    constructor(name, price) {
        this.name = name
        this.price = price
    }
}