// Load stored data
let ledger = JSON.parse(localStorage.getItem("ledger")) || {};
let citizens = JSON.parse(localStorage.getItem("citizens")) || [];

// Save functions
function saveLedger() {
    localStorage.setItem("ledger", JSON.stringify(ledger));
}

function saveCitizens() {
    localStorage.setItem("citizens", JSON.stringify(citizens));
}

// Register citizen
function registerCitizen() {
    let name = document.getElementById("newCitizen").value;
    if (!name) return;

    if (!citizens.includes(name)) {
        citizens.push(name);
        ledger[name] = 0;
        saveCitizens();
        saveLedger();
        displayCitizens();
        alert("Citizen Registered.");
    }
}

// Add labor credits
function addCredits() {
    let name = document.getElementById("citizenName").value;
    let credits = parseInt(document.getElementById("credits").value);

    if (!ledger[name]) ledger[name] = 0;
    ledger[name] += credits;

    saveLedger();
    displayLedger();
}

// Display functions
function displayCitizens() {
    let list = document.getElementById("citizenList");
    if (!list) return;

    list.innerHTML = "";
    citizens.forEach(c => {
        let li = document.createElement("li");
        li.textContent = c;
        list.appendChild(li);
    });
}

function displayLedger() {
    let table = document.getElementById("ledgerTable");
    if (!table) return;

    table.innerHTML = `
    <tr>
        <th>Name</th>
        <th>Labor Credits</th>
    </tr>`;

    for (let name in ledger) {
        let row = table.insertRow();
        row.insertCell(0).textContent = name;
        row.insertCell(1).textContent = ledger[name];
    }
}

// Auto-load
displayCitizens();
displayLedger();

// --- ADMIN SYSTEM ---

const ADMIN_PASSWORD = "FrankaunenSupreme"; // Change this immediately

function login() {
    const input = document.getElementById("adminPass").value;
    if (input === ADMIN_PASSWORD) {
        sessionStorage.setItem("isAdmin", "true");
        window.location.href = "admin.html";
    } else {
        alert("Access Denied.");
    }
}

function checkAdmin() {
    if (sessionStorage.getItem("isAdmin") !== "true") {
        window.location.href = "login.html";
    }
}

function logout() {
    sessionStorage.removeItem("isAdmin");
    window.location.href = "index.html";
}
