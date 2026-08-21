// ========================================
// SWIFTPAY TRANSACTIONS
// ========================================


// ========================================
// GET LOGGED-IN USER
// ========================================

function getTransactionUser() {

    const sessionData =
        localStorage.getItem("currentUser");


    if (!sessionData) {

        return null;

    }


    const sessionUser =
        JSON.parse(sessionData);


    const usersData =
        localStorage.getItem("users");


    const users =
        usersData
            ? JSON.parse(usersData)
            : [];


    const user =
        users.find(function (user) {

            return user.id === sessionUser.id;

        });


    if (!user) {

        return null;

    }


    // Make sure transactions exists

    if (!Array.isArray(user.transactions)) {

        user.transactions = [];

    }


    // Make sure balance exists

    if (typeof user.balance !== "number") {

        user.balance =
            Number(user.balance) || 0;

    }


    return user;

}


// ========================================
// RENDER TRANSACTIONS
// ========================================

function renderTransactions() {

    const transactionList =
        document.getElementById(
            "transactionList"
        );


    if (!transactionList) {

        return;

    }


    const user =
        getTransactionUser();


    if (!user) {

        transactionList.innerHTML = `

            <div class="empty-state">

                <i class="fa-solid fa-user"></i>

                <h5>
                    Please login
                </h5>

                <p>
                    Login to view your transactions.
                </p>

            </div>

        `;

        return;

    }


    // Copy transactions

    let transactions =
        [...user.transactions];


    // ========================================
    // SEARCH
    // ========================================

    const searchInput =
        document.getElementById(
            "transactionSearch"
        );


    const search =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    if (search) {

        transactions =
            transactions.filter(
                function (transaction) {

                    const description =
                        transaction.description
                            ? transaction.description
                                .toLowerCase()
                            : "";


                    return description.includes(
                        search
                    );

                }
            );

    }


    // ========================================
    // FILTER
    // ========================================

    const transactionFilter =
        document.getElementById(
            "transactionFilter"
        );


    const filterValue =
        transactionFilter
            ? transactionFilter.value
            : "all";


    if (filterValue !== "all") {

        transactions =
            transactions.filter(
                function (transaction) {

                    return (
                        transaction.type ===
                        filterValue
                    );

                }
            );

    }


    // ========================================
    // SORT
    // ========================================

    transactions.sort(
        function (a, b) {

            return (
                new Date(b.date) -
                new Date(a.date)
            );

        }
    );


    // ========================================
    // EMPTY
    // ========================================

    if (transactions.length === 0) {

        transactionList.innerHTML = `

            <div class="empty-state">

                <i class="fa-solid fa-receipt"></i>

                <h5>
                    No transactions found
                </h5>

                <p>
                    Your transaction history will appear here.
                </p>

            </div>

        `;

        return;

    }


    // ========================================
    // DISPLAY TRANSACTIONS
    // ========================================

    transactionList.innerHTML =
        transactions
            .map(function (transaction) {

                const isCredit =
                    transaction.type === "credit";


                return `

                    <div class="transaction-item">

                        <div class="transaction-left">

                            <div class="
                                transaction-icon
                                ${isCredit
                                    ? "credit"
                                    : "debit"
                                }
                            ">

                                <i class="
                                    fa-solid
                                    ${isCredit
                                        ? "fa-arrow-down"
                                        : "fa-arrow-up"
                                    }
                                "></i>

                            </div>


                            <div>

                                <strong>
                                    ${transaction.description}
                                </strong>

                                <div class="transaction-date">

                                    ${formatDate(
                                        transaction.date
                                    )}

                                </div>

                            </div>

                        </div>


                        <div class="
                            ${isCredit
                                ? "amount-credit"
                                : "amount-debit"
                            }
                        ">

                            ${isCredit ? "+" : "-"}

                            ${formatCurrency(
                                transaction.amount
                            )}

                        </div>

                    </div>

                `;

            })
            .join("");

}


// ========================================
// RECENT TRANSACTIONS
// ========================================

function renderRecentTransactions() {

    const container =
        document.getElementById(
            "recentTransactions"
        );


    if (!container) {

        return;

    }


    const user =
        getTransactionUser();


    if (!user) {

        return;

    }


    const transactions =
        [...user.transactions]
            .sort(function (a, b) {

                return (
                    new Date(b.date) -
                    new Date(a.date)
                );

            })
            .slice(0, 5);


    // ========================================
    // EMPTY STATE
    // ========================================

    if (transactions.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <i class="fa-solid fa-clock-rotate-left"></i>

                <h5>
                    No transactions yet
                </h5>

                <p>
                    Start by depositing money.
                </p>

            </div>

        `;

        return;

    }


    // ========================================
    // DISPLAY
    // ========================================

    container.innerHTML =
        transactions
            .map(function (transaction) {

                const isCredit =
                    transaction.type === "credit";


                return `

                    <div class="transaction-item">

                        <div class="transaction-left">

                            <div class="
                                transaction-icon
                                ${isCredit
                                    ? "credit"
                                    : "debit"
                                }
                            ">

                                <i class="
                                    fa-solid
                                    ${isCredit
                                        ? "fa-arrow-down"
                                        : "fa-arrow-up"
                                    }
                                "></i>

                            </div>


                            <div>

                                <strong>
                                    ${transaction.description}
                                </strong>

                                <div class="transaction-date">

                                    ${formatDate(
                                        transaction.date
                                    )}

                                </div>

                            </div>

                        </div>


                        <div class="
                            ${isCredit
                                ? "amount-credit"
                                : "amount-debit"
                            }
                        ">

                            ${isCredit ? "+" : "-"}

                            ${formatCurrency(
                                transaction.amount
                            )}

                        </div>

                    </div>

                `;

            })
            .join("");

}


// ========================================
// DASHBOARD STATISTICS
// ========================================

function updateDashboardStats() {

    const user =
        getTransactionUser();


    if (!user) {

        return;

    }


    const transactions =
        user.transactions || [];


    // ========================================
    // TOTAL DEPOSITS
    // ========================================

    const totalDeposits =
        transactions
            .filter(function (transaction) {

                return transaction.type === "credit";

            })
            .reduce(function (total, transaction) {

                return (
                    total +
                    Number(transaction.amount)
                );

            }, 0);


    // ========================================
    // TOTAL WITHDRAWALS
    // ========================================

    const totalWithdrawals =
        transactions
            .filter(function (transaction) {

                return transaction.type === "debit";

            })
            .reduce(function (total, transaction) {

                return (
                    total +
                    Number(transaction.amount)
                );

            }, 0);


    // ========================================
    // ELEMENTS
    // ========================================

    const balance =
        document.getElementById(
            "balanceAmount"
        );


    const deposits =
        document.getElementById(
            "totalDeposits"
        );


    const withdrawals =
        document.getElementById(
            "totalWithdrawals"
        );


    const count =
        document.getElementById(
            "transactionCount"
        );


    const welcomeUser =
        document.getElementById(
            "welcomeUser"
        );


    const navUserName =
        document.getElementById(
            "navUserName"
        );


    // ========================================
    // BALANCE
    // ========================================

    if (balance) {

        balance.textContent =
            formatCurrency(
                user.balance
            );

    }


    // ========================================
    // DEPOSITS
    // ========================================

    if (deposits) {

        deposits.textContent =
            formatCurrency(
                totalDeposits
            );

    }


    // ========================================
    // WITHDRAWALS
    // ========================================

    if (withdrawals) {

        withdrawals.textContent =
            formatCurrency(
                totalWithdrawals
            );

    }


    // ========================================
    // TRANSACTION COUNT
    // ========================================

    if (count) {

        count.textContent =
            transactions.length;

    }


    // ========================================
    // WELCOME USER
    // ========================================

    if (welcomeUser) {

        welcomeUser.textContent =
            `Hello, ${user.name} 👋`;

    }


    // ========================================
    // NAVBAR USER
    // ========================================

    if (navUserName) {

        navUserName.textContent =
            user.name;

    }

}


// ========================================
// SEARCH
// ========================================

const transactionSearch =
    document.getElementById(
        "transactionSearch"
    );


if (transactionSearch) {

    transactionSearch.addEventListener(
        "input",
        function () {

            renderTransactions();

        }
    );

}


// ========================================
// FILTER
// ========================================

const transactionFilter =
    document.getElementById(
        "transactionFilter"
    );


if (transactionFilter) {

    transactionFilter.addEventListener(
        "change",
        function () {

            renderTransactions();

        }
    );

}


// ========================================
// CLEAR FILTERS
// ========================================

const clearFilters =
    document.getElementById(
        "clearFilters"
    );


if (clearFilters) {

    clearFilters.addEventListener(
        "click",
        function () {

            if (transactionSearch) {

                transactionSearch.value = "";

            }


            if (transactionFilter) {

                transactionFilter.value = "all";

            }


            renderTransactions();

        }
    );

}


// ========================================
// INITIAL LOAD
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        renderTransactions();

        renderRecentTransactions();

        updateDashboardStats();

    }
);