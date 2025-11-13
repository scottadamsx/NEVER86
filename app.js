import {Server, Table, Order, Item} from "./objects.js"

const server = new Server("scotty")

const table1 = new Table(1)
const table2 = new Table(2)
const table3 = new Table(3)

server.section = [table1, table2, table3]
