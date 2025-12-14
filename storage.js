import {Table, Item} from './objects.js'

export function updateStorage(tables, menu) {
    localStorage.menu = JSON.stringify(menu)
    localStorage.tables = JSON.stringify(tables)
}

export function getTables() {
    let tables = []
    if (localStorage.tables) {
        let objects = JSON.parse(localStorage.tables)
        objects.forEach(object => {
            const table = new Table(object.name, object.server, object.order, object.status)
            tables.push(table)
        })

        console.log("tables imported:",tables)
    } else {
        tables = []
        console.log("no tables in storage!")
    }
    return tables
}


export function getMenu() {
    let menu
    if (localStorage.menu) {
        menu = JSON.parse(localStorage.menu)
        console.log("menu imported:",menu)
    } else {
        menu = []
        console.log("blank menu!")
    }
    return menu
}


