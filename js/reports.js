

document.addEventListener("DOMContentLoaded", () => {

    const totalBalance = document.getElementById("total-balance");
    const totalIncome = document.getElementById("total-income");
    const totalExpense = document.getElementById("total-expense");
    const totalSavings = document.getElementById("total-savings");

    const setBudgetButton = document.getElementById("set-budget");
    const spentAmount = document.getElementById("spent-amount");
    const totalBudget = document.getElementById("total-budget");
    const budgetProgress = document.getElementById("budget-progress");
    const budgetRemaining = document.getElementById("budget-remaining");

    const setCategoryBudgetButton = document.getElementById("set-category-budget");
    const categoryBudgetList = document.getElementById("category-budget-list");

    const categoryList = document.getElementById("category-list");

    const monthlyIncome = document.getElementById("monthly-income");
    const monthlyExpense = document.getElementById("monthly-expense");
    const monthlySavings = document.getElementById("monthly-savings");

    const spendingAnalysisContainer = document.getElementById("spending-analysis-container");


    const convertAmountInput = document.getElementById("convert-amount");
    const convertTargetSelect = document.getElementById("convert-target");
    const convertBtn = document.getElementById("convert-btn");
    const convertError = document.getElementById("convert-error");
    const convertResultBox = document.getElementById("convert-result-box");
    const convertResult = document.getElementById("convert-result");


    let categoryBudgets = JSON.parse(localStorage.getItem("categoryBudgets")) || {};
    let monthlyBudgetVal = Number(localStorage.getItem("monthlyBudget")) || 0;


    function getTransactions() {
        return JSON.parse(localStorage.getItem("transactions")) || [];
    }

    function formatCurrency(amount) {
        return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(amount);
    }


    function calculateFinance() {
        const transactions = getTransactions();

        const income = transactions
            .filter(t => t.type === "income")
            .reduce((sum, t) => sum + Number(t.amount), 0);

        const expense = transactions
            .filter(t => t.type === "expense")
            .reduce((sum, t) => sum + Number(t.amount), 0);


        const balance = income - expense;
        const savings = income - expense;

        return { income, expense, balance, savings };
    }


    function updateBudgetDisplay(expense) {
        if (!totalBudget || !spentAmount || !budgetRemaining || !budgetProgress) return;

        totalBudget.textContent = `/ ₹${formatCurrency(monthlyBudgetVal)}`;
        spentAmount.textContent = `₹${formatCurrency(expense)}`;

        if (monthlyBudgetVal <= 0) {
            budgetRemaining.textContent = "Set your monthly budget to get started";
            budgetRemaining.style.color = "var(--color-text-muted)";
            budgetProgress.className = "fill primary";
            budgetProgress.style.width = "0%";
            return;
        }

        const remaining = monthlyBudgetVal - expense;
        const percentage = Math.min((expense / monthlyBudgetVal) * 100, 100);

        if (remaining >= 0) {
            budgetRemaining.textContent = `₹${formatCurrency(remaining)} remaining`;
            budgetRemaining.style.color = "var(--color-emerald)";
            budgetProgress.className = "fill primary";
        } else {
            budgetRemaining.textContent = `₹${formatCurrency(Math.abs(remaining))} over budget ⚠️`;
            budgetRemaining.style.color = "var(--color-rose)";
            budgetProgress.className = "fill warning";
        }

        budgetProgress.style.width = `${percentage}%`;
    }


    function updateCategorySpending() {
        if (!categoryList) return;

        const transactions = getTransactions();
        const expenses = transactions.filter(t => t.type === "expense");

        if (expenses.length === 0) {
            categoryList.innerHTML = `
                <div class="empty-state">
                    <span>📊</span>
                    <h4>No spending data</h4>
                    <p>Add expenses on the Dashboard to see breakdowns.</p>
                </div>
            `;
            return;
        }

        const categoryTotals = {};
        expenses.forEach(t => {
            const category = t.category || "Other";
            categoryTotals[category] = (categoryTotals[category] || 0) + Number(t.amount);
        });

        categoryList.innerHTML = "";


        const sortedCategories = Object.keys(categoryTotals).sort((a, b) => categoryTotals[b] - categoryTotals[a]);

        sortedCategories.forEach(category => {
            const row = document.createElement("div");
            row.className = "list-row";
            row.innerHTML = `
                <span>${category}</span>
                <strong>₹${formatCurrency(categoryTotals[category])}</strong>
            `;
            categoryList.appendChild(row);
        });
    }


    function updateCategoryBudgets() {
        if (!categoryBudgetList) return;

        const categories = Object.keys(categoryBudgets);

        if (categories.length === 0) {
            categoryBudgetList.innerHTML = `
                <div class="empty-state">
                    <span>🛡️</span>
                    <h4>No category budgets set</h4>
                    <p>Add specific category limits to prevent overspending.</p>
                </div>
            `;
            return;
        }

        const transactions = getTransactions();
        const expenses = transactions.filter(t => t.type === "expense");

        const categoryExpenses = {};
        expenses.forEach(t => {
            const cat = t.category || "Other";
            categoryExpenses[cat] = (categoryExpenses[cat] || 0) + Number(t.amount);
        });

        categoryBudgetList.innerHTML = "";

        categories.forEach(category => {
            const budgetLimit = Number(categoryBudgets[category]);
            const spent = categoryExpenses[category] || 0;
            const percentage = Math.min((spent / budgetLimit) * 100, 100);

            const item = document.createElement("div");
            item.className = "category-budget-item";

            const isOverBudget = spent > budgetLimit;
            const budgetLabelColor = isOverBudget ? "var(--color-rose)" : "var(--color-text-main)";

            item.innerHTML = `
                <div class="budget-info-row" style="margin-bottom: 6px;">
                    <span>${category}</span>
                    <strong style="color: ${budgetLabelColor}">
                        ₹${formatCurrency(spent)} <span style="color: var(--color-text-light); font-weight: 500;">/ ₹${formatCurrency(budgetLimit)}</span>
                    </strong>
                </div>
                <div class="progress-bar" style="height: 8px;">
                    <div class="fill ${isOverBudget ? "warning" : "primary"}" style="width: ${percentage}%"></div>
                </div>
                ${isOverBudget ? `<p style="font-size: 11px; color: var(--color-rose); font-weight: 600; margin-top: 4px;">Over budget by ₹${formatCurrency(spent - budgetLimit)}!</p>` : ""}
            `;

            categoryBudgetList.appendChild(item);
        });
    }


    function updateSpendingAnalysis() {
        if (!spendingAnalysisContainer) return;

        const transactions = getTransactions();
        const expenses = transactions.filter(t => t.type === "expense");

        if (expenses.length === 0) {
            spendingAnalysisContainer.innerHTML = `
                <div class="empty-state" id="spending-analysis-empty">
                    <span>💡</span>
                    <h4>No analysis insights yet</h4>
                    <p>Track more transactions to receive tailored financial analysis.</p>
                </div>
            `;
            return;
        }

        const categoryTotals = {};
        expenses.forEach(t => {
            const cat = t.category || "Other";
            categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(t.amount);
        });

        let highestCategory = "";
        let highestAmount = 0;

        for (const cat in categoryTotals) {
            if (categoryTotals[cat] > highestAmount) {
                highestCategory = cat;
                highestAmount = categoryTotals[cat];
            }
        }

        const totalExpense = expenses.reduce((sum, t) => sum + Number(t.amount), 0);
        const percentage = totalExpense > 0 ? Math.round((highestAmount / totalExpense) * 100) : 0;

        spendingAnalysisContainer.innerHTML = `
            <div style="display: flex; align-items: flex-start; gap: 16px; padding: 4px;">
                <div style="font-size: 32px;">💡</div>
                <div>
                    <h4 style="font-size: 16px; font-weight: 700; color: var(--color-text-main); margin-bottom: 6px;">
                        Your biggest spending area is <strong>${highestCategory}</strong>
                    </h4>
                    <p style="font-size: 14px; color: var(--color-text-muted); line-height: 1.5;">
                        You spent <strong>₹${formatCurrency(highestAmount)}</strong> on ${highestCategory}, which represents <strong>${percentage}%</strong> of your total monthly expenses.
                        Consider reviewing this category to find potential savings and adjust your budgets accordingly!
                    </p>
                </div>
            </div>
        `;
    }


    function updateDashboard() {
        const finance = calculateFinance();

        if (totalBalance) totalBalance.textContent = `₹${formatCurrency(finance.balance)}`;
        if (totalIncome) totalIncome.textContent = `₹${formatCurrency(finance.income)}`;
        if (totalExpense) totalExpense.textContent = `₹${formatCurrency(finance.expense)}`;
        if (totalSavings) totalSavings.textContent = `₹${formatCurrency(finance.savings)}`;

        if (monthlyIncome) monthlyIncome.textContent = `₹${formatCurrency(finance.income)}`;
        if (monthlyExpense) monthlyExpense.textContent = `₹${formatCurrency(finance.expense)}`;
        if (monthlySavings) monthlySavings.textContent = `₹${formatCurrency(finance.savings)}`;

        updateBudgetDisplay(finance.expense);
        updateCategorySpending();
        updateCategoryBudgets();
        updateSpendingAnalysis();
    }


    if (setBudgetButton) {
        setBudgetButton.addEventListener("click", () => {
            const input = prompt("Enter your monthly budget limit (₹):", monthlyBudgetVal || "");
            if (input === null) return;

            const budget = Number(input);
            if (isNaN(budget) || budget <= 0) {
                alert("Please enter a valid positive budget amount.");
                return;
            }

            monthlyBudgetVal = budget;
            localStorage.setItem("monthlyBudget", monthlyBudgetVal);
            updateDashboard();
        });
    }

    if (setCategoryBudgetButton) {
        setCategoryBudgetButton.addEventListener("click", () => {

            const category = prompt("Enter category name (e.g. Food, Travel):");
            if (!category || category.trim() === "") return;

            const trimmedCategory = category.trim();

            const input = prompt(`Enter budget limit for "${trimmedCategory}" (₹):`);
            if (input === null) return;

            const limit = Number(input);
            if (isNaN(limit) || limit <= 0) {
                alert("Please enter a valid positive budget amount.");
                return;
            }

            categoryBudgets[trimmedCategory] = limit;
            localStorage.setItem("categoryBudgets", JSON.stringify(categoryBudgets));
            updateCategoryBudgets();
        });
    }


    async function convertCurrency() {
        if (!convertAmountInput || !convertTargetSelect || !convertResult || !convertError || !convertResultBox) return;

        const amount = Number(convertAmountInput.value);
        const target = convertTargetSelect.value;

        if (isNaN(amount) || amount <= 0) {
            convertError.textContent = "Please enter a valid amount greater than 0.";
            convertResultBox.style.display = "none";
            return;
        }

        convertError.textContent = "";
        convertResult.textContent = "Fetching rates...";
        convertResultBox.style.display = "flex";

        try {

            const response = await fetch("https://open.er-api.com/v6/latest/INR");

            if (!response.ok) {
                throw new Error("Rates fetch failed. Please check network connection.");
            }

            const data = await response.json();

            if (data.result === "error") {
                throw new Error(data["error-type"] || "REST API error occurred.");
            }

            const rate = data.rates[target];
            if (!rate) {
                throw new Error(`Target currency rate for ${target} not available.`);
            }

            const convertedAmount = amount * rate;

            convertResult.innerHTML = `
                <strong>${target} ${convertedAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                <span class="rate-info">Exchange rate: 1 INR = ${rate.toFixed(5)} ${target}</span>
            `;

        } catch (err) {
            convertError.textContent = `Error: ${err.message}`;
            convertResultBox.style.display = "none";
        }
    }

    if (convertBtn) {
        convertBtn.addEventListener("click", convertCurrency);
    }


    updateDashboard();


    window.addEventListener("storage", (e) => {
        if (e.key === "transactions" || e.key === "monthlyBudget" || e.key === "categoryBudgets") {
            if (e.key === "monthlyBudget") monthlyBudgetVal = Number(e.newValue) || 0;
            if (e.key === "categoryBudgets") categoryBudgets = JSON.parse(e.newValue) || {};
            updateDashboard();
        }
    });
});