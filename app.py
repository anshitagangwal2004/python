from flask import Flask, render_template, request, redirect, url_for, jsonify
from datetime import datetime
import re
import random
import string

app = Flask(__name__)

# Simulated history data (in a real-world application, this should be stored in a database)
password_history = []

# Function to check password strength
def check_password_strength(password):
    strength = "Weak"
    suggestions = ""
    score = 0
    
    if len(password) >= 8:
        score += 1
    if re.search(r'[A-Z]', password):
        score += 1
    if re.search(r'[0-9]', password):
        score += 1
    if re.search(r'[@$!%*?&]', password):
        score += 1
    
    # Assign strength based on score
    if score == 4:
        strength = "Strong"
    elif score == 3:
        strength = "Moderate"
    else:
        strength = "Weak"

    # Provide feedback
    if strength == "Weak":
        suggestions = "Try adding a mix of upper case, lower case, digits, and special characters."
    elif strength == "Moderate":
        suggestions = "Good, but adding more complexity could improve security."
    elif strength == "Strong":
        suggestions = "Great! This password is strong."

    return strength, score * 25, suggestions

# Route for the main page
@app.route("/", methods=["GET", "POST"])
def index():
    strength = "Weak"
    suggestions = ""
    if request.method == "POST":
        password = request.form["password"]
        strength, score, suggestions = check_password_strength(password)
        
        # Add password to history
        password_history.append({
            "password": password,
            "strength": strength,
            "score": score,
            "timestamp": datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        })
    
    return render_template("index.html", strength=strength, suggestions=suggestions)

# Route for the password check history
@app.route("/history")
def history():
    return render_template("history.html", history=password_history)

# Route for checking password strength via API (AJAX)
@app.route("/check", methods=["POST"])
def check():
    data = request.get_json()
    password = data.get("password")
    strength, score, suggestions = check_password_strength(password)
    
    return jsonify({
        "strength": strength,
        "score": score,
        "suggestions": suggestions
    })

# Route for generating a strong password
@app.route("/generate_password", methods=["GET"])
def generate_password():
    password = generate_strong_password()
    return jsonify({"password": password})

# Function to generate a strong password
def generate_strong_password():
    length = 12
    charset = string.ascii_letters + string.digits + "!@#$%^&*()"
    return ''.join(random.choice(charset) for _ in range(length))

# Run the application
if __name__ == "__main__":
    app.run(debug=True)
