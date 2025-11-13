export class Server {
    constructor(name){
        this.name = name
        this.section = []
    }
}

export class Table {
    constructor(number) {
        this.number = number
        this.active = false
        this.order = null
    }
}

export class Order {
    constructor(table) {
        this.table = table
        this.items = []
        this.total = 0
    }
}

export class MenuItem {
    constructor(name, price) {
        this.name = name
        this.price = price
    }
}