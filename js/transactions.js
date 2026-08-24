

document.addEventListener("DOMContentLoaded", () => {

    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    let categories = JSON.parse(localStorage.getItem("categories")) || [
        "Food", "Shopping", "Travel",
        "Bills", "Entertainment",
        "Salary", "Other"
    ];

    let editId = null;


    const form = document.getElementById("transactionForm");
    const formTitle = document.getElementById("formTitle");
    const submitBtn = document.getElementById("submitBtn");
    const cancelEditBtn = document.getElementById("cancelEditBtn");
    const errorEl = document.getElementById("error");

    const typeSelect = document.getElementById("type");
    const amountInput = document.getElementById("amount");
    const categorySelect = document.getElementById("category");
    const descriptionInput = document.getElementById("description");
    const dateInput = document.getElementById("date");

    const searchInput = document.getElementById("searchInput");
    const filterCategory = document.getElementById("filterCategory");
    const filterType = document.getElementById("filterType");
    const sortSelect = document.getElementById("sort");

    const listContainer = document.getElementById("transactionList");
    const transactionCountEl = document.getElementById("transactionCount");

    const totalIncomeEl = document.getElementById("totalIncome");
    const totalExpenseEl = document.getElementById("totalExpense");
    const balanceEl = document.getElementById("balance");

    const categoryListEl = document.getElementById("categoryList");


    if (dateInput) {
        const today = new Date().toISOString().split("T")[0];
        dateInput.value = today;
    }


    function init() {
        loadCategories();
        applyFilters();


        window.addEventListener("storage", (e) => {
            if (e.key === "transactions") {
                transactions = JSON.parse(e.newValue) || [];
                applyFilters();
            }
            if (e.key === "categories") {
                categories = JSON.parse(e.newValue) || [];
                loadCategories();
            }
        });
    }


    function saveData() {
        localStorage.setItem("transactions", JSON.stringify(transactions));
        localStorage.setItem("categories", JSON.stringify(categories));
    }


    function loadCategories() {

        const currentFormVal = categorySelect.value;
        categorySelect.innerHTML = `<option value="">Select Category</option>`;
        categories.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat;
            option.textContent = cat;
            categorySelect.appendChild(option);
        });
        if (categories.includes(currentFormVal)) {
            categorySelect.value = currentFormVal;
        }


        const currentFilterVal = filterCategory.value;
        filterCategory.innerHTML = `<option value="all">All Categories</option>`;
        categories.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat;
            option.textContent = cat;
            filterCategory.appendChild(option);
        });
        filterCategory.value = currentFilterVal || "all";


        if (categoryListEl) {
            categoryListEl.innerHTML = "";
            categories.forEach(category => {
                const tag = document.createElement("span");
                tag.className = "tag-badge";
                tag.textContent = category;
                categoryListEl.appendChild(tag);
            });
        }
    }

    window.addCategory = function() {
        const input = document.getElementById("newCategory");
        const name = input.value.trim();

        if (!name) return;

        if (categories.some(cat => cat.toLowerCase() === name.toLowerCase())) {
            alert("Category already exists.");
            return;
        }

        categories.push(name);
        saveData();
        loadCategories();
        input.value = "";
    };


    function calculateTotals(filteredData) {

        const income = transactions
            .filter(t => t.type === "income")
            .reduce((sum, t) => sum + Number(t.amount), 0);

        const expense = transactions
            .filter(t => t.type === "expense")
            .reduce((sum, t) => sum + Number(t.amount), 0);

        const balance = income - expense;

        if (totalIncomeEl) totalIncomeEl.textContent = `₹${income.toLocaleString("en-IN")}`;
        if (totalExpenseEl) totalExpenseEl.textContent = `₹${expense.toLocaleString("en-IN")}`;
        if (balanceEl) {
            balanceEl.textContent = `₹${balance.toLocaleString("en-IN")}`;
            if (balance >= 0) {
                balanceEl.style.color = "var(--color-emerald)";
            } else {
                balanceEl.style.color = "var(--color-rose)";
            }
        }
    }


    function display(dataList) {
        if (!listContainer) return;

        listContainer.innerHTML = "";

        if (transactionCountEl) {
            transactionCountEl.textContent = `${dataList.length} transaction${dataList.length !== 1 ? "s" : ""}`;
        }

        if (dataList.length === 0) {
            listContainer.innerHTML = `
                <div class="empty-state">
                    <span>📑</span>
                    <h4>No transactions found</h4>
                    <p>Verify your search query or filters.</p>
                </div>
            `;
            return;
        }

        dataList.forEach(t => {
            const item = document.createElement("div");
            item.className = "transaction-item";


            let emoji = "💸";
            const cat = t.category.toLowerCase();
            if (cat.includes("food") || cat.includes("dine") || cat.includes("eat")) emoji = "🍕";
            else if (cat.includes("shop") || cat.includes("clothes") || cat.includes("store")) emoji = "🛍️";
            else if (cat.includes("travel") || cat.includes("cab") || cat.includes("fuel") || cat.includes("ride")) emoji = "🚗";
            else if (cat.includes("bill") || cat.includes("rent") || cat.includes("phone") || cat.includes("electricity")) emoji = "🔌";
            else if (cat.includes("entertainment") || cat.includes("movie") || cat.includes("game")) emoji = "🎮";
            else if (cat.includes("salary") || cat.includes("income") || cat.includes("wage")) emoji = "💼";
            else if (cat.includes("education") || cat.includes("book") || cat.includes("school")) emoji = "📚";

            item.innerHTML = `
                <div class="transaction-left">
                    <div class="transaction-icon-box ${t.type}">
                        ${emoji}
                    </div>
                    <div class="transaction-details">
                        <h4>${t.description}</h4>
                        <span class="category">${t.category}</span>
                    </div>
                </div>
                <div class="transaction-right">
                    <span class="transaction-date">${t.date}</span>
                    <span class="transaction-amount ${t.type}">
                        ${t.type === "income" ? "+" : "-"}₹${Number(t.amount).toLocaleString("en-IN")}
                    </span>
                    <div class="row-actions">
                        <button class="btn btn-secondary btn-icon edit-btn" title="Edit Entry">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>
                        <button class="btn btn-danger btn-icon delete-btn" title="Delete Entry">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            `;


            item.querySelector(".edit-btn").addEventListener("click", () => {
                editTransaction(t.id);
            });


            item.querySelector(".delete-btn").addEventListener("click", () => {
                deleteTransaction(t.id);
            });

            listContainer.appendChild(item);
        });
    }


    form.addEventListener("submit", (e) => {
        e.preventDefault();

        if (errorEl) errorEl.textContent = "";

        const type = typeSelect.value;
        const amount = Number(amountInput.value);
        const category = categorySelect.value;
        const description = descriptionInput.value.trim();
        const date = dateInput.value;


        if (!amount || amount <= 0 || !category || !description || !date) {
            if (errorEl) errorEl.textContent = "Please fill in all transaction fields correctly.";
            return;
        }

        const transaction = {
            id: editId || Date.now(),
            type,
            amount,
            category,
            description,
            date
        };

        if (editId) {

            transactions = transactions.map(t => t.id === editId ? transaction : t);
            cancelEdit();
        } else {

            transactions.push(transaction);
        }

        saveData();
        applyFilters();


        form.reset();
        const today = new Date().toISOString().split("T")[0];
        dateInput.value = today;
    });

    function deleteTransaction(id) {
        if (!confirm("Are you sure you want to delete this transaction?")) return;


        if (editId === id) {
            cancelEdit();
        }

        transactions = transactions.filter(t => t.id !== id);
        saveData();
        applyFilters();
    }

    function editTransaction(id) {
        const t = transactions.find(item => item.id === id);
        if (!t) return;

        typeSelect.value = t.type;
        amountInput.value = t.amount;
        categorySelect.value = t.category;
        descriptionInput.value = t.description;
        dateInput.value = t.date;

        editId = id;
        if (formTitle) formTitle.textContent = "Edit Transaction";
        if (submitBtn) submitBtn.textContent = "Update Transaction";
        if (cancelEditBtn) cancelEditBtn.style.display = "inline-flex";

        window.scrollTo({
            top: form.getBoundingClientRect().top + window.scrollY - 100,
            behavior: "smooth"
        });
    }

    function cancelEdit() {
        editId = null;
        form.reset();
        const today = new Date().toISOString().split("T")[0];
        dateInput.value = today;

        if (formTitle) formTitle.textContent = "Add Transaction";
        if (submitBtn) submitBtn.textContent = "Add Transaction";
        if (cancelEditBtn) cancelEditBtn.style.display = "none";
        if (errorEl) errorEl.textContent = "";
    }

    if (cancelEditBtn) {
        cancelEditBtn.addEventListener("click", cancelEdit);
    }


    function applyFilters() {
        const queryText = searchInput ? searchInput.value.toLowerCase().trim() : "";
        const catFilterVal = filterCategory ? filterCategory.value : "all";
        const typeFilterVal = filterType ? filterType.value : "all";
        const sortVal = sortSelect ? sortSelect.value : "newest";

        let result = transactions.filter(t => {
            const matchesQuery = t.description.toLowerCase().includes(queryText) ||
                                 t.category.toLowerCase().includes(queryText);
            const matchesCat = (catFilterVal === "all" || t.category === catFilterVal);
            const matchesType = (typeFilterVal === "all" || t.type === typeFilterVal);

            return matchesQuery && matchesCat && matchesType;
        });


        if (sortVal === "high") {
            result.sort((a, b) => b.amount - a.amount);
        } else if (sortVal === "low") {
            result.sort((a, b) => a.amount - b.amount);
        } else if (sortVal === "newest") {
            result.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (sortVal === "oldest") {
            result.sort((a, b) => new Date(a.date) - new Date(b.date));
        }

        calculateTotals(result);
        display(result);
    }


    if (searchInput) searchInput.addEventListener("input", applyFilters);
    if (filterCategory) filterCategory.addEventListener("change", applyFilters);
    if (filterType) filterType.addEventListener("change", applyFilters);
    if (sortSelect) sortSelect.addEventListener("change", applyFilters);


    init();
});