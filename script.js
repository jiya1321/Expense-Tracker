// =================================
// EXPENSE TRACKER - MEMBER 2
// =================================

let transactions = JSON.parse(
    localStorage.getItem("transactions")
) || [];

let categories = JSON.parse(
    localStorage.getItem("categories")
) || [
    "Food", "Shopping", "Travel",
    "Bills", "Entertainment",
    "Salary", "Other"
];

let editId = null;


// DOM
const form = document.querySelector("#transactionForm");
const list = document.querySelector("#transactionList");
const search = document.querySelector("#searchInput");
const categoryFilter = document.querySelector("#filterCategory");
const typeFilter = document.querySelector("#filterType");
const sort = document.querySelector("#sort");


// SAVE - JSON + LocalStorage
function saveData() {
    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

    localStorage.setItem(
        "categories",
        JSON.stringify(categories)
    );
}


// FORM - ADD / EDIT
form.addEventListener("submit", function(e) {

    e.preventDefault();

    const transaction = {
        id: editId || Date.now(),
        type: document.querySelector("#type").value,
        amount: Number(document.querySelector("#amount").value),
        category: document.querySelector("#category").value.trim(),
        description: document.querySelector("#description").value.trim(),
        date: document.querySelector("#date").value
    };

    // Validation
    if (
        transaction.amount <= 0 ||
        !transaction.category ||
        !transaction.description ||
        !transaction.date
    ) {
        document.querySelector("#error").textContent =
            "Please fill all fields correctly.";
        return;
    }

    document.querySelector("#error").textContent = "";

    // Edit using map()
    if (editId) {

        transactions = transactions.map(t =>
            t.id === editId
                ? { ...t, ...transaction }
                : t
        );

        editId = null;

    } else {

        // Add using push()
        transactions.push(transaction);
    }

    saveData();
    form.reset();
    display();
});


// DISPLAY - map() + destructuring
function display(data = transactions) {

    list.innerHTML = data.map(t => {

        const {
            id,
            type,
            amount,
            category,
            description,
            date
        } = t;

        return `
            <div class="transaction">

                <div>
                    <strong>${description}</strong>
                    <p>${category}</p>
                </div>

                <div>${date}</div>

                <strong class="${type}">
                    ${type === "income" ? "+" : "-"}₹${amount}
                </strong>

                <div class="actions">

                    <button onclick="editTransaction(${id})">
                        Edit
                    </button>

                    <button
                        class="delete"
                        onclick="deleteTransaction(${id})">
                        Delete
                    </button>

                </div>

            </div>
        `;
    }).join("");

    document.querySelector("#transactionCount")
        .textContent =
        `${data.length} transaction${data.length !== 1 ? "s" : ""}`;

    calculateTotals();
}


// DELETE - filter()
function deleteTransaction(id) {

    if (!confirm("Delete this transaction?"))
        return;

    transactions = transactions.filter(
        t => t.id !== id
    );

    saveData();
    display();
}


// EDIT - find() + destructuring
function editTransaction(id) {

    const t = transactions.find(
        t => t.id === id
    );

    if (!t) return;

    document.querySelector("#type").value = t.type;
    document.querySelector("#amount").value = t.amount;
    document.querySelector("#category").value = t.category;
    document.querySelector("#description").value = t.description;
    document.querySelector("#date").value = t.date;

    editId = id;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// DETAILS - for...in
function viewDetails(id) {

    const t = transactions.find(
        t => t.id === id
    );

    if (!t) return;

    let details = "";

    for (const key in t) {
        details += `${key}: ${t[key]}\n`;
    }

    alert(details);
}


// TOTALS - filter() + reduce()
function calculateTotals() {

    const income = transactions
        .filter(t => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

    const expense = transactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

    document.querySelector("#totalIncome")
        .textContent = `₹${income}`;

    document.querySelector("#totalExpense")
        .textContent = `₹${expense}`;

    document.querySelector("#balance")
        .textContent = `₹${income - expense}`;
}


// SEARCH + FILTER
function applyFilters() {

    const text =
        search.value.toLowerCase();

    let result = transactions.filter(t =>

        (t.description.toLowerCase().includes(text) ||
         t.category.toLowerCase().includes(text))

        &&

        (categoryFilter.value === "all" ||
         t.category === categoryFilter.value)

        &&

        (typeFilter.value === "all" ||
         t.type === typeFilter.value)
    );

    // sort()
    if (sort.value === "high")
        result.sort((a, b) => b.amount - a.amount);

    if (sort.value === "low")
        result.sort((a, b) => a.amount - b.amount);

    if (sort.value === "newest")
        result.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
        );

    if (sort.value === "oldest")
        result.sort(
            (a, b) => new Date(a.date) - new Date(b.date)
        );

    display(result);
}


// EVENTS
search.addEventListener("input", applyFilters);
categoryFilter.addEventListener("change", applyFilters);
typeFilter.addEventListener("change", applyFilters);
sort.addEventListener("change", applyFilters);


// CATEGORIES - forEach()
function loadCategories() {

    categoryFilter.innerHTML =
        `<option value="all">All Categories</option>`;

    categories.forEach(category => {

        categoryFilter.innerHTML +=
            `<option value="${category}">
                ${category}
            </option>`;
    });
}


function addCategory() {

    const input =
        document.querySelector("#newCategory");

    const name = input.value.trim();

    if (!name) return;

    if (categories.includes(name)) {
        alert("Category already exists.");
        return;
    }

    categories.push(name);

    saveData();
    loadCategories();

    input.value = "";
}


// START
loadCategories();
display();