// =====================================
// SWIFTPAY BANKING
// =====================================


// =====================================
// GET CURRENT USER
// =====================================

function getBankingUser() {

    const currentUser =
        localStorage.getItem("currentUser");


    if (!currentUser) {

        return null;

    }


    return JSON.parse(currentUser);

}


// =====================================
// GET ALL USERS
// =====================================

function getBankingUsers() {

    const users =
        localStorage.getItem("users");


    if (!users) {

        return [];

    }


    return JSON.parse(users);

}


// =====================================
// SAVE USERS
// =====================================

function saveBankingUsers(users) {

    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );

}


// =====================================
// UPDATE USER DATA
// =====================================

function updateUserData(updatedUser) {

    const users =
        getBankingUsers();


    const index =
        users.findIndex(function (user) {

            return user.id === updatedUser.id;

        });


    if (index === -1) {

        console.error("User not found.");

        return false;

    }


    users[index] = updatedUser;


    saveBankingUsers(users);


    return true;

}


// =====================================
// GET LOGGED USER COMPLETE DATA
// =====================================

function getLoggedUserData() {

    const sessionUser =
        getBankingUser();


    if (!sessionUser) {

        return null;

    }


    const users =
        getBankingUsers();


    const user =
        users.find(function (user) {

            return user.id === sessionUser.id;

        });


    if (!user) {

        console.error(
            "Logged-in user does not exist."
        );

        return null;

    }


    // Make sure transactions exists

    if (!Array.isArray(user.transactions)) {

        user.transactions = [];

    }


    // Make sure balance is number

    if (typeof user.balance !== "number") {

        user.balance =
            Number(user.balance) || 0;

    }


    return user;

}


// =====================================
// UPDATE BALANCE UI
// =====================================

function updateBalanceUI() {

    const user =
        getLoggedUserData();


    if (!user) {

        return;

    }


    const bankBalance =
        document.getElementById(
            "bankBalance"
        );


    if (bankBalance) {

        bankBalance.textContent =
            formatCurrency(
                user.balance
            );

    }

}


// =====================================
// DEPOSIT
// =====================================

const depositForm =
    document.getElementById(
        "depositForm"
    );


if (depositForm) {

    depositForm.addEventListener(
        "submit",
        function (e) {

            e.preventDefault();


            const amountInput =
                document.getElementById(
                    "depositAmount"
                );


            const amount =
                Number(
                    amountInput.value
                );


            // Validate amount

            if (
                !Number.isFinite(amount) ||
                amount <= 0
            ) {

                showToast(
                    "Enter a valid deposit amount.",
                    "error"
                );

                return;

            }


            const user =
                getLoggedUserData();


            if (!user) {

                showToast(
                    "Please login first.",
                    "error"
                );

                return;

            }


            // =================================
            // UPDATE BALANCE
            // =================================

            user.balance =
                Number(user.balance) + amount;


            // =================================
            // CREATE TRANSACTION
            // =================================

            user.transactions.push({

                id: generateId(),

                type: "credit",

                amount: amount,

                description: "Money Deposited",

                date: new Date().toISOString()

            });


            // =================================
            // SAVE USER
            // =================================

            const saved =
                updateUserData(user);


            if (!saved) {

                showToast(
                    "Unable to save transaction.",
                    "error"
                );

                return;

            }


            // =================================
            // RESET FORM
            // =================================

            depositForm.reset();


            // =================================
            // UPDATE BALANCE
            // =================================

            updateBalanceUI();


            // =================================
            // SUCCESS MESSAGE
            // =================================

            showToast(
                `${formatCurrency(amount)} deposited successfully!`,
                "success"
            );


            // =================================
            // UPDATE TRANSACTIONS
            // =================================

            if (
                typeof renderTransactions ===
                "function"
            ) {

                renderTransactions();

            }


            if (
                typeof renderRecentTransactions ===
                "function"
            ) {

                renderRecentTransactions();

            }


            if (
                typeof updateDashboardStats ===
                "function"
            ) {

                updateDashboardStats();

            }

        }
    );

}


// =====================================
// WITHDRAW
// =====================================

const withdrawForm =
    document.getElementById(
        "withdrawForm"
    );


if (withdrawForm) {

    withdrawForm.addEventListener(
        "submit",
        function (e) {

            e.preventDefault();


            const amountInput =
                document.getElementById(
                    "withdrawAmount"
                );


            const amount =
                Number(
                    amountInput.value
                );


            // Validate

            if (
                !Number.isFinite(amount) ||
                amount <= 0
            ) {

                showToast(
                    "Enter a valid withdrawal amount.",
                    "error"
                );

                return;

            }


            const user =
                getLoggedUserData();


            if (!user) {

                showToast(
                    "Please login first.",
                    "error"
                );

                return;

            }


            // =================================
            // CHECK BALANCE
            // =================================

            if (
                amount > Number(user.balance)
            ) {

                showToast(
                    "Insufficient balance.",
                    "error"
                );

                return;

            }


            // =================================
            // CONFIRM
            // =================================

            const confirmed =
                confirm(
                    `Withdraw ${formatCurrency(amount)}?`
                );


            if (!confirmed) {

                return;

            }


            // =================================
            // UPDATE BALANCE
            // =================================

            user.balance =
                Number(user.balance) - amount;


            // =================================
            // ADD TRANSACTION
            // =================================

            user.transactions.push({

                id: generateId(),

                type: "debit",

                amount: amount,

                description: "Money Withdrawn",

                date: new Date().toISOString()

            });


            // =================================
            // SAVE
            // =================================

            const saved =
                updateUserData(user);


            if (!saved) {

                showToast(
                    "Unable to save transaction.",
                    "error"
                );

                return;

            }


            // =================================
            // RESET
            // =================================

            withdrawForm.reset();


            // =================================
            // UPDATE UI
            // =================================

            updateBalanceUI();


            showToast(
                `${formatCurrency(amount)} withdrawn successfully!`,
                "success"
            );


            // =================================
            // UPDATE TRANSACTIONS
            // =================================

            if (
                typeof renderTransactions ===
                "function"
            ) {

                renderTransactions();

            }


            if (
                typeof renderRecentTransactions ===
                "function"
            ) {

                renderRecentTransactions();

            }


            if (
                typeof updateDashboardStats ===
                "function"
            ) {

                updateDashboardStats();

            }

        }
    );

}


// =====================================
// INITIAL LOAD
// =====================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateBalanceUI();

    }
);