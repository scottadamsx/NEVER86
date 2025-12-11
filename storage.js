
export function updateStorage(tables, menu) {
    localStorage.menu = JSON.stringify(menu)
    localStorage.tables = JSON.stringify(tables)
}

export function getTables() {
    let tables
    if (localStorage.tables) {
        tables = JSON.parse(localStorage.tables)
        console.log("tables imported:",tables)
    } else {
        tables = []
        console.log("blank tables!")
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


