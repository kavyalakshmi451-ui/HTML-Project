// SAMPLE DATA

let donors = [
    {
        name: "Ananya Rao",
        id: "DNR-0182",
        blood: "O+",
        organ: "Kidney",
        consent: "Verified",
        status: "Verified"
    },
    {
        name: "Rahul Varma",
        id: "DNR-0179",
        blood: "A+",
        organ: "Liver",
        consent: "Pending",
        status: "Pending"
    },
    {
        name: "Meera Nair",
        id: "DNR-0174",
        blood: "B+",
        organ: "Cornea",
        consent: "Verified",
        status: "Verified"
    }
];

let recipients = [
    {
        name: "Sana Reddy",
        id: "REC-0081",
        blood: "O+",
        organ: "Kidney",
        priority: "Urgent",
        status: "Active"
    },
    {
        name: "Kiran Das",
        id: "REC-0078",
        blood: "A+",
        organ: "Liver",
        priority: "High",
        status: "Active"
    }
];

// NAVIGATION

document.querySelectorAll(".nav-link").forEach(button => {

    button.addEventListener("click", () => {

        let page = button.dataset.page;

        document.querySelectorAll(".page").forEach(section => {
            section.classList.remove("active");
        });

        document.querySelectorAll(".nav-link").forEach(nav => {
            nav.classList.remove("active");
        });

        document.getElementById("page-" + page).classList.add("active");

        button.classList.add("active");

        document.getElementById("breadcrumb").textContent =
            button.textContent.trim();

        document.getElementById("welcomeTitle").textContent =
            button.textContent.trim();

        document.getElementById("sidebar").classList.remove("open");

    });

});

// MOBILE MENU

document.getElementById("mobileMenu").onclick = () => {
    document.getElementById("sidebar").classList.toggle("open");
};

// DASHBOARD CHART

const chartValues = [45, 65, 55, 80, 72, 95, 85, 100];

document.getElementById("chartBars").innerHTML =
chartValues.map(value => {

    return `<div class="chart-bar"
    style="height:${value}%"></div>`;

}).join("");

// MODAL

function openModal(type) {

    document.getElementById("recordType").value = type;

    document.getElementById("modalTitle").textContent =
        type === "donor" ? "Register Donor" : "Register Recipient";

    document.getElementById("statusLabel").textContent =
        type === "donor" ? "Consent Status" : "Priority";

    let status = document.getElementById("personStatus");

    status.innerHTML = type === "donor"
        ? `<option>Pending</option>
           <option>Verified</option>
           <option>Review</option>`
        : `<option>Standard</option>
           <option>High</option>
           <option>Urgent</option>`;

    document.getElementById("recordModal").classList.add("show");
}

function closeModal() {
    document.getElementById("recordModal").classList.remove("show");
}

// SAVE RECORD

document.getElementById("recordForm").addEventListener("submit", function(e) {

    e.preventDefault();

    let type = document.getElementById("recordType").value;

    let name = document.getElementById("personName").value;

    let blood = document.getElementById("personBlood").value;

    let organ = document.getElementById("personOrgan").value;

    let location = document.getElementById("personLocation").value;

    let status = document.getElementById("personStatus").value;

    let id = type === "donor"
        ? "DNR-" + Date.now().toString().slice(-4)
        : "REC-" + Date.now().toString().slice(-4);

    if(type === "donor") {

        donors.push({
            name,
            id,
            blood,
            organ,
            consent: status,
            status
        });

    } else {

        recipients.push({
            name,
            id,
            blood,
            organ,
            priority: status,
            status: "Active"
        });

    }

    renderDonors();
    renderRecipients();
    renderRecent();

    document.getElementById("recordForm").reset();

    closeModal();

    showToast("Record added successfully!");

});

// DONOR TABLE

function renderDonors() {

    let table = document.getElementById("donorTable");

    table.innerHTML = donors.map(d => `

        <tr>
            <td>${d.name}</td>
            <td>${d.id}</td>
            <td>${d.blood}</td>
            <td>${d.organ}</td>
            <td>${d.consent}</td>
            <td><span class="status ${d.status.toLowerCase()}">${d.status}</span></td>
        </tr>

    `).join("");

}

// RECIPIENT TABLE

function renderRecipients() {

    let table = document.getElementById("recipientTable");

    table.innerHTML = recipients.map(r => `

        <tr>
            <td>${r.name}</td>
            <td>${r.id}</td>
            <td>${r.blood}</td>
            <td>${r.organ}</td>
            <td>${r.priority}</td>
            <td>${r.status}</td>
        </tr>

    `).join("");

}

// RECENT REGISTRATIONS

function renderRecent() {

    let rows = [
        ...donors.map(d => ({...d, type:"Donor"})),
        ...recipients.map(r => ({...r, type:"Recipient"}))
    ].slice(-4).reverse();

    document.getElementById("recentTable").innerHTML =
    rows.map(r => `

        <tr>
            <td>${r.name}</td>
            <td>${r.id}</td>
            <td>${r.type}</td>
            <td>${r.status}</td>
        </tr>

    `).join("");

}

// SEARCH

document.getElementById("donorSearch").addEventListener("input", function() {

    let search = this.value.toLowerCase();

    document.querySelectorAll("#donorTable tr").forEach(row => {

        row.style.display =
            row.textContent.toLowerCase().includes(search)
            ? ""
            : "none";

    });

});

document.getElementById("recipientSearch").addEventListener("input", function() {

    let search = this.value.toLowerCase();

    document.querySelectorAll("#recipientTable tr").forEach(row => {

        row.style.display =
            row.textContent.toLowerCase().includes(search)
            ? ""
            : "none";

    });

});

// SMART MATCHING DEMO

document.getElementById("runMatch").onclick = function() {

    let blood = document.getElementById("matchBlood").value;

    let organ = document.getElementById("matchOrgan").value;

    let results = [];

    donors.forEach(donor => {

        recipients.forEach(recipient => {

            if(
                donor.blood === recipient.blood &&
                donor.organ === recipient.organ &&
                (blood === "all" || donor.blood === blood) &&
                (organ === "all" || donor.organ === organ)
            ) {

                results.push(
                    `${donor.name} ↔ ${recipient.name}
                    | Blood: ${donor.blood}
                    | Organ: ${donor.organ}`
                );

            }

        });

    });

    document.getElementById("matchResults").innerHTML =
        results.length
        ? results.map(x => `<p>${x}</p>`).join("")
        : "No sample matches found.";

};

// VERIFICATION

function approve(button) {

    let row = button.parentElement.parentElement;

    row.cells[3].innerHTML =
        '<span class="status verified">Approved</span>';

    button.remove();

    showToast("Demo approval updated!");

}

// QR GENERATION

function generateQR() {

    let value = document.getElementById("qrInput").value.trim();

    if(!value) {
        showToast("Enter a record ID first.");
        return;
    }

    let qr = document.getElementById("qrcode");

    qr.innerHTML = "";

    new QRCode(qr, {
        text: value,
        width: 160,
        height: 160,
        colorDark: "#173c33",
        colorLight: "#ffffff"
    });

    showToast("QR code generated!");
}

// QR DOWNLOAD

function downloadQR() {

    let qr = document.querySelector("#qrcode canvas");

    if(!qr) {
        showToast("Generate a QR code first.");
        return;
    }

    let link = document.createElement("a");

    link.download = "lifeline-qr.png";

    link.href = qr.toDataURL("image/png");

    link.click();

}

// NOTIFICATIONS

document.getElementById("topNotifications").onclick = () => {

    document.querySelector('[data-page="notifications"]').click();

};

// TOAST MESSAGE

function showToast(message) {

    let toast = document.getElementById("toast");

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);

}

// INITIAL RENDER

renderDonors();

renderRecipients();

renderRecent();