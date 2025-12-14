import {Table} from '../objects.js'

export function viewTable(table) {
    // clear anything in the main rn
    const main = document.querySelector("main")
    main.innerHTML = ""

    const tableName = document.createElement("h1")
    tableName.textContent = table.name
    main.appendChild(tableName)

    
}