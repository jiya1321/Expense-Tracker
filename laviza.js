<<<<<<< HEAD
// ==========================================
// EXPENSE TRACKER - DASHBOARD

// ==========================================


// ---------- VARIABLES ----------

// let: value can be changed
let transactions = [];

// const: value cannot be reassigned
const currency = "₹";

// var: older way of declaring a variable
var appName = "Expense Tracker";


// ---------- DOM ELEMENTS ----------

// Selecting HTML elements using getElementById()
const transactionForm =
    document.getElementById("transactionForm");

const typeInput =
    document.getElementById("type");

const amountInput =
    document.getElementById("amount");

const categoryInput =
    document.getElementById("category");

const dateInput =
    document.getElementById("date");

const descriptionInput =
    document.getElementById("description");

const transactionList =
    document.getElementById("transactionList");

const totalIncomeElement =
    document.getElementById("totalIncome");

const totalExpenseElement =
    document.getElementById("totalExpense");

const balanceElement =
    document.getElementById("balance");


// ---------- CALCULATE BALANCE ----------

// Function Declaration
// Parameters: income, expense
function calculateBalance(income, expense) {

    // Return Value
    return income - expense;
}


// ---------- ARROW FUNCTION: CALCULATE INCOME ----------

const calculateIncome = () => {

    let total = 0;

    // for...of loop
    for (const transaction of transactions) {

        if (transaction.type === "income") {

            total = total + transaction.amount;
        }
    }

    return total;
};


// ---------- ARROW FUNCTION: CALCULATE EXPENSE ----------

const calculateExpense = () => {

    let total = 0;

    // for...of loop
    for (const transaction of transactions) {

        if (transaction.type === "expense") {

            total = total + transaction.amount;
        }
    }

    return total;
};


// ---------- FUNCTION EXPRESSION ----------

// Function stored inside a variable
const clearTransactionForm = function () {

    transactionForm.reset();

};


// ---------- ADD TRANSACTION FUNCTION ----------

function addTransaction() {

    // Getting values from the form
    const type = typeInput.value;
    const category = categoryInput.value;
    const date = dateInput.value;
    const description = descriptionInput.value;


    // ---------- TYPE CONVERSION ----------

    // Input value comes as a string,
    // so convert it into a Number.
    const amount = Number(amountInput.value);


    // ---------- CONDITIONAL STATEMENTS ----------

    if (amount <= 0) {

        alert("Please enter a valid amount.");
        return;
    }


    if (category === "") {

        alert("Please select a category.");
        return;
    }


    if (date === "") {

        alert("Please select a date.");
        return;
    }


    if (description === "") {

        alert("Please enter a description.");
        return;
    }


    // ---------- OBJECT ----------

    const transaction = {

        type: type,
        amount: amount,
        category: category,
        date: date,
        description: description

    };


    // ---------- ARRAY ----------

    // Add transaction object to array
    transactions.push(transaction);


    // Display transactions
    displayTransactions();


    // Update dashboard
    updateSummary();


    // Clear form
    clearTransactionForm();

}


// ---------- DISPLAY TRANSACTIONS ----------

function displayTransactions() {

    // Remove old transactions from page
    transactionList.innerHTML = "";


    // ---------- FOR...OF LOOP ----------

    for (const transaction of transactions) {

        // Create new HTML element
        const transactionElement =
            document.createElement("div");


        // Add CSS class
        transactionElement.classList.add(
            "transaction-item"
        );


        // ---------- DOM MANIPULATION ----------

        transactionElement.innerHTML = `

            <div>

                <strong>
                    ${transaction.category}
                </strong>

                <p>
                    ${transaction.description}
                </p>

                <small>
                    ${transaction.date}
                </small>

            </div>


            <div class="transaction-right">

                <strong>

                    ${
                        transaction.type === "income"
                            ? "+"
                            : "-"
                    }

                    ${currency}${transaction.amount}

                </strong>


                <button class="delete-btn">
                    Delete
                </button>

            </div>

        `;


        // ---------- QUERY SELECTOR ----------

        // Find Delete button
        const deleteButton =
            transactionElement.querySelector(
                ".delete-btn"
            );


        // ---------- DELETE EVENT ----------

        deleteButton.addEventListener(
            "click",
            function (event) {

                // Stop event from affecting parent elements
                event.stopPropagation();


                // Find transaction index
                const transactionIndex =
                    transactions.indexOf(transaction);


                // ---------- SPLICE ----------

                // Remove one transaction
                // from the specific index
                transactions.splice(
                    transactionIndex,
                    1
                );


                // Display updated transactions
                displayTransactions();


                // Update dashboard
                updateSummary();

            }
        );


        // ---------- APPEND CHILD ----------

        // Add transaction element to webpage
        transactionList.appendChild(
            transactionElement
        );

    }

}


// ---------- UPDATE SUMMARY ----------

function updateSummary() {

    // Call arrow functions
    const totalIncome =
        calculateIncome();

    const totalExpense =
        calculateExpense();


    // Call function with parameters/arguments
    const balance =
        calculateBalance(
            totalIncome,
            totalExpense
        );


    // ---------- DOM MANIPULATION ----------

    totalIncomeElement.textContent =
        currency + totalIncome;

    totalExpenseElement.textContent =
        currency + totalExpense;

    balanceElement.textContent =
        currency + balance;

}


// ---------- POP() FUNCTION ----------

// Removes the last transaction
function removeLastTransaction() {

    // Check if array is empty
    if (transactions.length === 0) {

        alert("No transactions to remove.");
        return;

    }


    // ---------- POP ----------

    // Remove last transaction
    transactions.pop();


    // Display updated transactions
    displayTransactions();


    // Update dashboard
    updateSummary();

}


// ---------- REMOVE LAST BUTTON ----------

// Select button from HTML
const removeLastBtn =
    document.getElementById(
        "removeLastBtn"
    );


// ---------- CLICK EVENT ----------

removeLastBtn.addEventListener(
    "click",
    function () {

        removeLastTransaction();

    }
);


// ---------- FORM EVENT ----------

// When form is submitted
transactionForm.addEventListener(
    "submit",
    function (event) {

        // Stop page from refreshing
        event.preventDefault();


        // Add transaction
        addTransaction();

    }
);
=======
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
>>>>>>> origin/jiya
