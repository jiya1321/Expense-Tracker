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