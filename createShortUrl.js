const shortenForm = document.getElementById('shorten-form');
const shortenResult = document.getElementById('shorten-result');

shortenForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const url = shortenForm.querySelector('input[name="url"]').value;
    const token = localStorage.getItem('token');
    const shortenUrl = 'https://www.shorten-url-api.infobrains.club/api/private/urls';

    shortenResult.textContent = "Processing...";
    shortenResult.style.color = "#333";

    try {
        const response = await fetch(shortenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ url })
        });

        const jsonResponse = await response.json();

        if (response.status === 201) {
            const shortUrl = jsonResponse.data.shortUrl;
            shortenResult.innerHTML = `
                <p>Shortened URL:</p>
                <a href="${shortUrl}" target="_blank">${shortUrl}</a>
                <button id="copyButton">Copy</button>`;

            document.getElementById("copyButton").addEventListener("click", () => {
                navigator.clipboard.writeText(shortUrl).then(() => {
                    Swal.fire({
                        title: "Copied!",
                        text: "The URL was copied to clipboard.",
                        icon: "success",
                        confirmButtonColor: "#6200ea",
                        confirmButtonText: "OK"
                    });
                });
            });
        } else {
            shortenResult.textContent = "Error: Unable to shorten URL.";
            shortenResult.style.color = "#ff4444";
        }
    } catch (error) {
        console.error("Error:", error);
        shortenResult.textContent = "An error occurred. Please try again.";
        shortenResult.style.color = "#ff4444";
    }
});