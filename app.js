// to be used as the app level javascript, all code runs through here
let tables = []
let menu = []

document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.menu) {
        tables = JSON.parse(localStorage.menu)
        console.log("tables succesfully grabbed from storage!")
    } else {
        console.log("no tables were found")
    }
    
})