const logout = async () => {
    const userId = localStorage.getItem("userId"); 
    const API_BASE_URL = `https://www.shorten-url-api.infobrains.club/api/private/users/${userId}`;
    const token = localStorage.getItem("token");

    if (!userId) {
        showAlert("User ID not found. Unable to delete account.", "error");
        return;
    }


    const { isConfirmed } = await Swal.fire({
        title: "Are you sure?",
        text: "This will permanently delete your account and all URLs!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ff9603",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete my account",
        cancelButtonText: "Cancel",
        background: "#fffed2",
        color: "#e35f01",
        customClass: {
            popup: "container",
            confirmButton: "container button",
            cancelButton: "container button hidden"
        }
    });

    if (!isConfirmed) return; 

    try {
        const response = await fetch(API_BASE_URL, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const contentType = response.headers.get("content-type");
        if (!response.ok) {
            if (contentType && contentType.includes("application/json")) {
                const errorData = await response.json();
                showAlert(`Error: ${errorData.message || response.statusText}`, "error");
            } else {
                showAlert(`Error: ${response.statusText}`, "error");
            }
            return;
        }


        await Swal.fire({
            title: "Account Deleted",
            text: "Your account and all URLs have been removed.",
            icon: "success",
            confirmButtonColor: "#ff9603",
            confirmButtonText: "OK",
            background: "#fffed2",
            color: "#e35f01",
            customClass: {
                popup: "container",
                confirmButton: "container button"
            }
        });


        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        window.location.href = "/index.html";

    } catch (error) {
        console.error("Logout failed:", error);
        showAlert("Failed to delete account. Try again.", "error");
    }
};


document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.querySelector(".logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", logout);
    } else {
        console.error("Logout button not found!");
    }
});
