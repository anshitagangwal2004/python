document.addEventListener("DOMContentLoaded", function () {
    const passwordInput = document.getElementById("password");
    const strengthBar = document.getElementById("strengthBar");
    const strengthLabel = document.getElementById("strengthLabel");
    const strengthSuggestions = document.getElementById("strengthSuggestions");
    const showPassword = document.getElementById("showPassword");
    const generatePasswordButton = document.getElementById("generatePassword");
    const generatedPasswordInput = document.getElementById("generatedPassword");
    const copyPasswordButton = document.getElementById("copyPassword");

    passwordInput.addEventListener("input", () => {
        const currentPassword = passwordInput.value;

        fetch("/check", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password: currentPassword })
        })
        .then(res => res.json())
        .then(data => {
            const { strength, score, suggestions } = data;
            strengthLabel.textContent = `Strength: ${strength}`;
            strengthBar.style.width = `${score}%`;

            if (strength === "Weak") {
                strengthBar.style.backgroundColor = "red";
                strengthSuggestions.textContent = suggestions || "Try adding a mix of upper case, lower case, digits, and special characters.";
            } else if (strength === "Moderate") {
                strengthBar.style.backgroundColor = "orange";
                strengthSuggestions.textContent = suggestions || "Good, but adding more complexity could improve security.";
            } else {
                strengthBar.style.backgroundColor = "green";
                strengthSuggestions.textContent = suggestions || "Great! This password is strong.";
            }
        });
    });

    showPassword.addEventListener("change", () => {
        passwordInput.type = showPassword.checked ? "text" : "password";
    });

    generatePasswordButton.addEventListener("click", function() {
        const generatedPassword = generateStrongPassword();
        generatedPasswordInput.value = generatedPassword;
    });

    copyPasswordButton.addEventListener("click", function() {
        navigator.clipboard.writeText(generatedPasswordInput.value).then(() => {
            alert("Password copied to clipboard!");
        });
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
