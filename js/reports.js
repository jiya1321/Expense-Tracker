function formatCurrency(amount) {
    return new Intl.NumberFormat("en-IN").format(amount);
}

const setBudgetButton = document.querySelector("#set-budget");
const totalBudget = document.querySelector("#total-budget");
const spentAmount = document.querySelector("#spent-amount");
const budgetRemaining = document.querySelector("#budget-remaining");
const budgetProgress = document.querySelector("#budget-progress");

const totalBalance = document.querySelector("#total-balance");
const totalIncome = document.querySelector("#total-income");
const totalExpense = document.querySelector("#total-expense");
const totalSavings = document.querySelector("#total-savings");

const analysisEmpty = document.querySelector(".analysis-empty");

const monthlyIncome = document.querySelector("#monthly-income");
const monthlyExpense = document.querySelector("#monthly-expense");
const monthlySavings = document.querySelector("#monthly-savings");

const setCategoryBudgetButton = document.querySelector("#set-category-budget");
const categoryBudgetList = document.querySelector("#category-budget-list");

let categoryBudgets =
    JSON.parse(localStorage.getItem("categoryBudgets")) || {};
const categoryList = document.querySelector("#category-list");
let monthlyBudget = Number(localStorage.getItem("monthlyBudget")) || 0;


function getTransactions() {
    return JSON.parse(localStorage.getItem("transactions")) || [];
}

function calculateFinance() {
    const transactions = getTransactions();

    const income = transactions
        .filter(transaction => transaction.type === "income")
        .reduce((total, transaction) => total + Number(transaction.amount), 0);

    const expense = transactions
        .filter(transaction => transaction.type === "expense")
        .reduce((total, transaction) => total + Number(transaction.amount), 0);

    const balance = income - expense;
    const savings = income - expense;

    return {
        income,
        expense,
        balance,
        savings
    };
}

function updateBudgetDisplay(expense) {
    totalBudget.textContent = `/ ₹${formatCurrency(monthlyBudget)}`;
    spentAmount.textContent = `₹${formatCurrency(expense)}`;

    if (monthlyBudget <= 0) {
        budgetRemaining.textContent = "Set your monthly budget to get started";
        budgetProgress.style.width = "0%";
        return;
    }

    const remaining = monthlyBudget - expense;
    const percentage = Math.min((expense / monthlyBudget) * 100, 100);

    budgetRemaining.textContent =
        remaining >= 0
            ? `₹${formatCurrency(remaining)} remaining`
            : `₹${formatCurrency(Math.abs(remaining))} over budget`;

    budgetProgress.style.width = `${percentage}%`;
}
function updateCategorySpending() {
    const transactions = getTransactions();

    const expenses = transactions.filter(
        transaction => transaction.type === "expense"
    );

    if (expenses.length === 0) {
        categoryList.className = "empty-state";
        categoryList.textContent = "No spending data available yet.";
        return;
    }

    const categoryTotals = {};

    expenses.forEach(function (transaction) {
        const category = transaction.category || "Other";

        if (categoryTotals[category]) {
            categoryTotals[category] += Number(transaction.amount);
        } else {
            categoryTotals[category] = Number(transaction.amount);
        }
    });

    categoryList.className = "category-list";
    categoryList.innerHTML = "";

    for (const category in categoryTotals) {
        const categoryRow = document.createElement("div");
        categoryRow.classList.add("category-row");

        categoryRow.innerHTML = `
            <span>${category}</span>
            <strong>₹${formatCurrency(categoryTotals[category])}</strong>
        `;

        categoryList.appendChild(categoryRow);
    }
}
function updateSpendingAnalysis() {
    const transactions = getTransactions();

    const expenses = transactions.filter(
        transaction => transaction.type === "expense"
    );

    if (expenses.length === 0) {
        analysisEmpty.innerHTML = `
            <span>💡</span>
            <h4>No analysis yet</h4>
            <p>Add transactions to start seeing insights about your spending.</p>
        `;
        return;
    }

    const categoryTotals = {};

    expenses.forEach(function (transaction) {
        const category = transaction.category || "Other";

        if (categoryTotals[category]) {
            categoryTotals[category] += Number(transaction.amount);
        } else {
            categoryTotals[category] = Number(transaction.amount);
        }
    });

    let highestCategory = "";
    let highestAmount = 0;

    for (const category in categoryTotals) {
        if (categoryTotals[category] > highestAmount) {
            highestCategory = category;
            highestAmount = categoryTotals[category];
        }
    }

    const totalExpense = expenses.reduce(function (total, transaction) {
        return total + Number(transaction.amount);
    }, 0);

    const percentage =
        totalExpense > 0
            ? Math.round((highestAmount / totalExpense) * 100)
            : 0;

    analysisEmpty.innerHTML = `
        <span>💡</span>
        <h4>Your biggest spending area is ${highestCategory}</h4>
        <p>You spent ₹${formatCurrency(highestAmount)} on ${highestCategory}, which is ${percentage}% of your total expenses.</p>
    `;
}
setCategoryBudgetButton.addEventListener("click", function () {
    const category = prompt("Enter category name:");

    if (!category || category.trim() === "") {
        return;
    }

    const input = prompt(`Enter budget for ${category}:`);

    if (input === null) {
        return;
    }

    const budget = Number(input);

    if (!budget || budget <= 0) {
        alert("Please enter a valid budget amount.");
        return;
    }

    categoryBudgets[category.trim()] = budget;

    localStorage.setItem(
        "categoryBudgets",
        JSON.stringify(categoryBudgets)
    );

    updateCategoryBudgets();
});
function getCategoryExpenses() {
    const transactions = getTransactions();

    const expenses = transactions.filter(
        transaction => transaction.type === "expense"
    );

    const categoryExpenses = {};

    expenses.forEach(function (transaction) {
        const category = transaction.category || "Other";

        if (categoryExpenses[category]) {
            categoryExpenses[category] += Number(transaction.amount);
        } else {
            categoryExpenses[category] = Number(transaction.amount);
        }
    });

    return categoryExpenses;
}

function updateCategoryBudgets() {
    const categories = Object.keys(categoryBudgets);
    const categoryExpenses = getCategoryExpenses();

    if (categories.length === 0) {
        categoryBudgetList.className = "empty-state";
        categoryBudgetList.textContent = "No category budgets set yet.";
        return;
    }

    categoryBudgetList.className = "category-budget-list";
    categoryBudgetList.innerHTML = "";

    categories.forEach(function (category) {
        const budget = Number(categoryBudgets[category]);
        const spent = categoryExpenses[category] || 0;
        const percentage = Math.min((spent / budget) * 100, 100);

        const item = document.createElement("div");
        item.classList.add("category-budget-item");

        item.innerHTML = `
            <div class="category-budget-info">
                <span>${category}</span>
                <strong>₹${formatCurrency(spent)} / ₹${formatCurrency(budget)}</strong>
            </div>

            <div class="progress-bar">
                <div class="progress" style="width: ${percentage}%"></div>
            </div>
        `;

        categoryBudgetList.appendChild(item);
    });
}
function updateDashboard() {
    const finance = calculateFinance();

    totalBalance.textContent = `₹${formatCurrency(finance.balance)}`;
    totalIncome.textContent = `₹${formatCurrency(finance.income)}`;
    totalExpense.textContent = `₹${formatCurrency(finance.expense)}`;
    totalSavings.textContent = `₹${formatCurrency(finance.savings)}`;

    monthlyIncome.textContent = `₹${formatCurrency(finance.income)}`;
    monthlyExpense.textContent = `₹${formatCurrency(finance.expense)}`;
    monthlySavings.textContent = `₹${formatCurrency(finance.savings)}`;

    updateBudgetDisplay(finance.expense);
    updateCategorySpending();
    updateSpendingAnalysis();
    updateCategoryBudgets();
}

setBudgetButton.addEventListener("click", function () {
    const input = prompt("Enter your monthly budget:");

    if (input === null) {
        return;
    }

    const budget = Number(input);

    if (!budget || budget <= 0) {
        alert("Please enter a valid budget amount.");
        return;
    }

    monthlyBudget = budget;
    localStorage.setItem("monthlyBudget", monthlyBudget);

    updateDashboard();
});

updateDashboard();

