// =============================
// STATE DATABASE (LocalStorage)
// =============================

let citizens = JSON.parse(localStorage.getItem("citizens")) || [];
let requests = JSON.parse(localStorage.getItem("requests")) || [];
let ledger = JSON.parse(localStorage.getItem("ledger")) || {};

function saveAll() {
    localStorage.setItem("citizens", JSON.stringify(citizens));
    localStorage.setItem("requests", JSON.stringify(requests));
    localStorage.setItem("ledger", JSON.stringify(ledger));
}

// =============================
// ADMIN SYSTEM
// =============================

const ADMIN_HASH = "RnJhbmtBdW5lblN1cHJlbWU="; // base64 for FrankAunenSupreme

function login() {
    const input = btoa(document.getElementById("adminPass").value);
    if (input === ADMIN_HASH) {
        sessionStorage.setItem("isAdmin", "true");
        window.location.href = "admin.html";
    } else {
        alert("Access Denied");
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

// =============================
// CITIZENSHIP REQUEST SYSTEM
// =============================

function requestCitizenship() {
    let name = document.getElementById("requestName").value;
    if (!name) return alert("Enter name.");

    if (!requests.includes(name) && !citizens.includes(name)) {
        requests.push(name);
        saveAll();
        alert("Request submitted.");
        displayRequests();
    }
}

function approveRequest(name) {
    citizens.push(name);
    ledger[name] = 0;
    requests = requests.filter(r => r !== name);
    saveAll();
    displayRequests();
    displayCitizens();
    displayLedger();
}

function denyRequest(name) {
    requests = requests.filter(r => r !== name);
    saveAll();
    displayRequests();
}

// =============================
// REMOVE CITIZEN
// =============================

function removeCitizen(name) {
    citizens = citizens.filter(c => c !== name);
    delete ledger[name];
    saveAll();
    displayCitizens();
    displayLedger();
}

// =============================
// LABOR CREDIT SYSTEM
// =============================

function addCredits() {
    let name = document.getElementById("citizenName").value;
    let credits = parseInt(document.getElementById("credits").value);

    if (!citizens.includes(name)) {
        alert("Citizen does not exist.");
        return;
    }

    ledger[name] += credits;
    saveAll();
    displayLedger();
}

function getRank(credits) {
    if (credits >= 800) return "Vanguard";
    if (credits >= 400) return "Sector Overseer";
    if (credits >= 150) return "Collective Organizer";
    if (credits >= 50) return "Skilled Worker";
    return "Citizen Worker";
}

// =============================
// DISPLAY FUNCTIONS
// =============================

function displayCitizens() {
    let list = document.getElementById("citizenList");
    if (!list) return;

    list.innerHTML = "";
    citizens.forEach(c => {
        let li = document.createElement("li");
        li.innerHTML = `${c} 
        <button onclick="removeCitizen('${c}')">Remove</button>`;
        list.appendChild(li);
    });
}

function displayRequests() {
    let list = document.getElementById("requestList");
    if (!list) return;

    list.innerHTML = "";
    requests.forEach(r => {
        let li = document.createElement("li");
        li.innerHTML = `${r} 
        <button onclick="approveRequest('${r}')">Approve</button>
        <button onclick="denyRequest('${r}')">Deny</button>`;
        list.appendChild(li);
    });
}

function displayLedger() {
    let table = document.getElementById("ledgerTable");
    if (!table) return;

    table.innerHTML = `
    <tr>
        <th>Name</th>
        <th>Credits</th>
        <th>Rank</th>
    </tr>`;

    for (let name in ledger) {
        let row = table.insertRow();
        row.insertCell(0).textContent = name;
        row.insertCell(1).textContent = ledger[name];
        row.insertCell(2).textContent = getRank(ledger[name]);
    }
}

// =============================
// EXPORT CSV
// =============================

function exportCSV() {
    let csv = "Name,Credits,Rank\n";
    for (let name in ledger) {
        csv += `${name},${ledger[name]},${getRank(ledger[name])}\n`;
    }

    let blob = new Blob([csv], { type: "text/csv" });
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = "frankaunen_ledger.csv";
    a.click();
}

// =============================
// AUTO LOAD
// =============================

displayCitizens();
displayRequests();
displayLedger();

document.addEventListener("DOMContentLoaded", function () {

    const intro = document.getElementById("introScreen");
    const button = document.getElementById("enterButton");

    if (button) {
        button.addEventListener("click", function () {
            intro.style.opacity = "0";
            setTimeout(() => {
                intro.style.display = "none";
            }, 500);
        });
    }

});
