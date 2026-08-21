// ========================================
// SwiftPay - Authentication System
// ========================================


// ========================================
// SIGN UP
// ========================================

const signupForm = document.getElementById("signupForm");

if (signupForm) {

    signupForm.addEventListener("submit", function (e) {

        e.preventDefault();


        // Get form values
        const name = document
            .getElementById("signupName")
            .value
            .trim();

        const email = document
            .getElementById("signupEmail")
            .value
            .trim()
            .toLowerCase();

        const password = document
            .getElementById("signupPassword")
            .value;

        const confirmPassword = document
            .getElementById("signupConfirmPassword")
            .value;


        // ========================================
        // VALIDATION
        // ========================================

        if (name === "") {

            alert("Please enter your name.");
            return;

        }


        if (email === "") {

            alert("Please enter your email.");
            return;

        }


        if (password === "") {

            alert("Please enter a password.");
            return;

        }


        if (password.length < 6) {

            alert("Password must be at least 6 characters.");
            return;

        }


        if (password !== confirmPassword) {

            alert("Passwords do not match!");
            return;

        }


        // ========================================
        // GET EXISTING USERS
        // ========================================

        const users = JSON.parse(
            localStorage.getItem("users")
        ) || [];


        // ========================================
        // CHECK IF USER ALREADY EXISTS
        // ========================================

        const existingUser = users.find(function (user) {

            return user.email === email;

        });


        if (existingUser) {

            alert("An account with this email already exists.");

            return;

        }


        // ========================================
        // CREATE NEW USER
        // ========================================

        const newUser = {

            id: Date.now(),

            name: name,

            email: email,

            password: password,

            balance: 0,

            transactions: []

        };


        // ========================================
        // ADD USER TO USERS ARRAY
        // ========================================

        users.push(newUser);


        // Save all users
        localStorage.setItem(
            "users",
            JSON.stringify(users)
        );


        // ========================================
        // SET CURRENT USER
        // ========================================

        localStorage.setItem(
            "currentUser",
            JSON.stringify(newUser)
        );


        // ========================================
        // SUCCESS MESSAGE
        // ========================================

        alert(
            `Account created successfully, ${name}!`
        );


        // ========================================
        // REDIRECT TO DASHBOARD
        // ========================================

        window.location.href = "dashboard.html";

    });

}



// ========================================
// LOGIN
// ========================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function (e) {

        e.preventDefault();


        // ========================================
        // GET LOGIN VALUES
        // ========================================

        const email = document
            .getElementById("loginEmail")
            .value
            .trim()
            .toLowerCase();

        const password = document
            .getElementById("loginPassword")
            .value;


        // ========================================
        // VALIDATION
        // ========================================

        if (email === "") {

            alert("Please enter your email.");

            return;

        }


        if (password === "") {

            alert("Please enter your password.");

            return;

        }


        // ========================================
        // GET USERS FROM LOCAL STORAGE
        // ========================================

        const users = JSON.parse(
            localStorage.getItem("users")
        ) || [];


        // ========================================
        // FIND USER
        // ========================================

        const user = users.find(function (user) {

            return (
                user.email === email &&
                user.password === password
            );

        });


        // ========================================
        // USER NOT FOUND
        // ========================================

        if (!user) {

            alert(
                "Invalid email or password!"
            );

            return;

        }


        // ========================================
        // SAVE CURRENT USER
        // ========================================

        localStorage.setItem(
            "currentUser",
            JSON.stringify(user)
        );


        // ========================================
        // LOGIN SUCCESS
        // ========================================

        alert(
            `Hello ${user.name}! You logged in successfully!`
        );


        // ========================================
        // REDIRECT TO DASHBOARD
        // ========================================

        window.location.href = "dashboard.html";

    });

}



// ========================================
// PROTECT DASHBOARD
// ========================================

const currentPage = window.location.pathname;


if (
    currentPage.includes("dashboard.html") ||
    currentPage.includes("banking.html")
) {

    const currentUser = JSON.parse(
        localStorage.getItem("currentUser")
    );


    // If user is not logged in
    if (!currentUser) {

        alert(
            "Please login first to access this page."
        );

        window.location.href = "login.html";

    }

}