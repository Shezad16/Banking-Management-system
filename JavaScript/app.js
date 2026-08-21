// ========================================
// SWIFTPAY - APP.JS
// ========================================


// ========================================
// FORMAT CURRENCY
// ========================================

function formatCurrency(amount) {

    return new Intl.NumberFormat("en-IN", {

        style: "currency",

        currency: "INR",

        minimumFractionDigits: 2

    }).format(Number(amount) || 0);

}


// ========================================
// GENERATE UNIQUE ID
// ========================================

function generateId() {

    return Date.now() + Math.floor(Math.random() * 1000);

}


// ========================================
// FORMAT DATE
// ========================================

function formatDate(date) {

    return new Date(date).toLocaleString("en-IN", {

        day: "2-digit",

        month: "short",

        year: "numeric",

        hour: "2-digit",

        minute: "2-digit"

    });

}


// ========================================
// SHOW TOAST
// ========================================

function showToast(message, type = "success") {

    const toastContainer =
        document.getElementById("toastContainer");


    // If toast container doesn't exist
    if (!toastContainer) {

        alert(message);

        return;

    }


    const toast =
        document.createElement("div");


    toast.className =
        `custom-toast ${type}`;


    toast.textContent =
        message;


    toastContainer.appendChild(toast);


    setTimeout(function () {

        toast.remove();

    }, 3000);

}


// ========================================
// LOGOUT
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const logoutBtn =
            document.getElementById("logoutBtn");


        if (logoutBtn) {

            logoutBtn.addEventListener(
                "click",
                function () {

                    const confirmLogout =
                        confirm(
                            "Are you sure you want to logout?"
                        );


                    if (!confirmLogout) {

                        return;

                    }


                    localStorage.removeItem(
                        "currentUser"
                    );


                    alert(
                        "You have been logged out successfully!"
                    );


                    window.location.href =
                        "login.html";

                }
            );

        }

    }
);