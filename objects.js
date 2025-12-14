// TABLE CLASS
export class Table {
    constructor(name,server=null,order=null,status="inactive") {
        this.name = name
        this.server = server
        this.order = order
        this.status = status
    }
    seat(server,order) {
        this.server = server
        this.order = order
        this.status = "active"
    } 
}

// ODRER CLASS
export class Order {
    constructor(table,numGuests) {
        this.table = table.name
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

// ITEM CLASS
export class Item {
    constructor(name, price) {
        this.name = name
        this.price = price
    }
}