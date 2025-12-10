
export function updateStorage(tables, menu) {
    localStorage.menu = JSON.jsonify(menu)
    localStorage.tables = JSON.jsonify(tables)
}

