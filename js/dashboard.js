

document.addEventListener("DOMContentLoaded", () => {

    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    let categories = JSON.parse(localStorage.getItem("categories")) || [
        "Food", "Shopping", "Travel",
        "Bills", "Entertainment",
        "Salary", "Other"
    ];

    const currency = "₹";


    const transactionForm = document.getElementById("transactionForm");
    const typeInput = document.getElementById("type");
    const amountInput = document.getElementById("amount");
    const categoryInput = document.getElementById("category");
    const dateInput = document.getElementById("date");
    const descriptionInput = document.getElementById("description");

    const transactionList = document.getElementById("transactionList");
    const totalIncomeElement = document.getElementById("totalIncome");
    const totalExpenseElement = document.getElementById("totalExpense");
    const balanceElement = document.getElementById("balance");

    const removeLastBtn = document.getElementById("removeLastBtn");
    const searchInput = document.getElementById("searchInput");


    if (dateInput) {
        const today = new Date().toISOString().split("T")[0];
        dateInput.value = today;
    }


    function init() {
        loadCategoryOptions();
        updateSummary();
        displayTransactions();


        window.addEventListener("storage", (e) => {
            if (e.key === "transactions") {
                transactions = JSON.parse(e.newValue) || [];
                updateSummary();
                displayTransactions();
            }
            if (e.key === "categories") {
                categories = JSON.parse(e.newValue) || [];
                loadCategoryOptions();
            }
        });
    }


    function loadCategoryOptions() {
        if (!categoryInput) return;

        const currentValue = categoryInput.value;
        categoryInput.innerHTML = `<option value="">Select Category</option>`;

        categories.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat;
            option.textContent = cat;
            categoryInput.appendChild(option);
        });


        if (categories.includes(currentValue)) {
            categoryInput.value = currentValue;
        }
    }


    function calculateBalance(income, expense) {
        return income - expense;
    }

    function calculateIncome() {
        return transactions
            .filter(t => t.type === "income")
            .reduce((sum, t) => sum + Number(t.amount), 0);
    }

    function calculateExpense() {
        return transactions
            .filter(t => t.type === "expense")
            .reduce((sum, t) => sum + Number(t.amount), 0);
    }


    function saveTransactions() {
        localStorage.setItem("transactions", JSON.stringify(transactions));
    }


    function displayTransactions(filterText = "") {
        if (!transactionList) return;

        transactionList.innerHTML = "";
        const query = filterText.toLowerCase().trim();


        const sortedData = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
        const filteredData = sortedData.filter(t =>
            t.description.toLowerCase().includes(query) ||
            t.category.toLowerCase().includes(query)
        );

        if (filteredData.length === 0) {
            transactionList.innerHTML = `
                <div class="empty-state">
                    <span>📝</span>
                    <h4>No transactions found</h4>
                    <p>${query ? "Try adjusting your search query." : "Add income or expense transactions to get started."}</p>
                </div>
            `;
            return;
        }

        filteredData.forEach(transaction => {
            const item = document.createElement("div");
            item.className = "transaction-item";


            let emoji = "💸";
            const cat = transaction.category.toLowerCase();
            if (cat.includes("food") || cat.includes("dine") || cat.includes("eat")) emoji = "🍕";
            else if (cat.includes("shop") || cat.includes("clothes") || cat.includes("store")) emoji = "🛍️";
            else if (cat.includes("travel") || cat.includes("cab") || cat.includes("fuel") || cat.includes("ride")) emoji = "🚗";
            else if (cat.includes("bill") || cat.includes("rent") || cat.includes("phone") || cat.includes("electricity")) emoji = "🔌";
            else if (cat.includes("entertainment") || cat.includes("movie") || cat.includes("game")) emoji = "🎮";
            else if (cat.includes("salary") || cat.includes("income") || cat.includes("wage")) emoji = "💼";
            else if (cat.includes("education") || cat.includes("book") || cat.includes("school")) emoji = "📚";

            item.innerHTML = `
                <div class="transaction-left">
                    <div class="transaction-icon-box ${transaction.type}">
                        ${emoji}
                    </div>
                    <div class="transaction-details">
                        <h4>${transaction.description}</h4>
                        <span class="category">${transaction.category}</span>
                    </div>
                </div>
                <div class="transaction-right">
                    <span class="transaction-date">${transaction.date}</span>
                    <span class="transaction-amount ${transaction.type}">
                        ${transaction.type === "income" ? "+" : "-"}₹${Number(transaction.amount).toLocaleString("en-IN")}
                    </span>
                    <div class="row-actions">
                        <button class="btn btn-danger btn-icon delete-btn" data-id="${transaction.id}">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            `;

            const delButton = item.querySelector(".delete-btn");
            delButton.addEventListener("click", (e) => {
                e.stopPropagation();
                deleteTransaction(transaction.id);
            });

            transactionList.appendChild(item);
        });
    }


    function updateSummary() {
        const income = calculateIncome();
        const expense = calculateExpense();
        const balance = calculateBalance(income, expense);

        if (totalIncomeElement) {
            totalIncomeElement.textContent = currency + income.toLocaleString("en-IN");
        }
        if (totalExpenseElement) {
            totalExpenseElement.textContent = currency + expense.toLocaleString("en-IN");
        }
        if (balanceElement) {
            balanceElement.textContent = currency + balance.toLocaleString("en-IN");
        }
    }


    function addTransaction() {
        const type = typeInput.value;
        const category = categoryInput.value;
        const date = dateInput.value;
        const description = descriptionInput.value.trim();
        const amount = Number(amountInput.value);


        document.getElementById("amountError").textContent = "";
        document.getElementById("categoryError").textContent = "";
        document.getElementById("dateError").textContent = "";
        document.getElementById("descriptionError").textContent = "";

        let hasError = false;

        if (!amount || amount <= 0) {
            document.getElementById("amountError").textContent = "Please enter a valid amount greater than 0.";
            hasError = true;
        }
        if (!category) {
            document.getElementById("categoryError").textContent = "Please select a category.";
            hasError = true;
        }
        if (!date) {
            document.getElementById("dateError").textContent = "Please pick a date.";
            hasError = true;
        }
        if (!description) {
            document.getElementById("descriptionError").textContent = "Please enter a short description.";
            hasError = true;
        }

        if (hasError) return;


        const transaction = {
            id: Date.now(),
            type: type,
            amount: amount,
            category: category,
            description: description,
            date: date
        };

        transactions.push(transaction);
        saveTransactions();


        updateSummary();
        displayTransactions();


        transactionForm.reset();
        const today = new Date().toISOString().split("T")[0];
        dateInput.value = today;
    }

    function deleteTransaction(id) {
        if (!confirm("Are you sure you want to delete this transaction?")) return;

        transactions = transactions.filter(t => t.id !== id);
        saveTransactions();
        updateSummary();
        displayTransactions(searchInput ? searchInput.value : "");
    }

    function removeLastTransaction() {
        if (transactions.length === 0) {
            alert("No transactions to remove.");
            return;
        }

        if (!confirm("Are you sure you want to remove the last transaction?")) return;

        transactions.pop();
        saveTransactions();
        updateSummary();
        displayTransactions();
    }


    if (transactionForm) {
        transactionForm.addEventListener("submit", (e) => {
            e.preventDefault();
            addTransaction();
        });
    }

    if (removeLastBtn) {
        removeLastBtn.addEventListener("click", removeLastTransaction);
    }

    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            displayTransactions(e.target.value);
        });
    }


    init();
});