document.addEventListener("DOMContentLoaded", function () {
    const passwordInput = document.getElementById("password");
    const strengthBar = document.getElementById("strengthBar");
    const strengthLabel = document.getElementById("strengthLabel");
    const showPassword = document.getElementById("showPassword");

    // Check if password is reused
    let passwordHistory = JSON.parse(localStorage.getItem("passwordHistory")) || [];

    passwordInput.addEventListener("input", () => {
        const currentPassword = passwordInput.value;

        // Check if password is reused
        if (passwordHistory.includes(currentPassword)) {
            strengthLabel.textContent = "Warning: This password was used before!";
            strengthBar.style.backgroundColor = "yellow";
            strengthBar.style.width = "100%";
            return;
        }

        // Check password strength
        fetch("/check", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ password: currentPassword })
        })
        .then(res => res.json())
        .then(data => {
            const { strength, score } = data;
            strengthLabel.textContent = `Strength: ${strength}`;
            strengthBar.style.width = `${score}%`;

            // Set color based on strength
            if (strength === "Weak") {
                strengthBar.style.backgroundColor = "red";
            } else if (strength === "Moderate") {
                strengthBar.style.backgroundColor = "orange";
            } else {
                strengthBar.style.backgroundColor = "green";
            }
        });
    });

    // Store password in history when the form is submitted
    passwordInput.addEventListener("blur", () => {
        const currentPassword = passwordInput.value;
        if (currentPassword && !passwordHistory.includes(currentPassword)) {
            passwordHistory.push(currentPassword);
            localStorage.setItem("passwordHistory", JSON.stringify(passwordHistory));
        }
    });

    showPassword.addEventListener("change", () => {
        passwordInput.type = showPassword.checked ? "text" : "password";
    });

    // Generate strong password
    document.getElementById("generatePassword").addEventListener("click", function() {
        const generatedPassword = generateStrongPassword();
        document.getElementById("generatedPassword").value = generatedPassword;
    });

    function generateStrongPassword() {
        const length = 12; // Define password length
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
        let password = "";
        for (let i = 0; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        return password;
    }
});
