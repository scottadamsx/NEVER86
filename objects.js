export class Table {
    constructor(name) {
        this.name = name
        this.server = null
        this.order = null
    }
}

export class Order {
    constructor(table,numGuests) {
        this.table = table
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
