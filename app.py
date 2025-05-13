from flask import Flask, render_template, request

import string

app = Flask(__name__)

def check_password_strength(password):
    length = len(password)
    lower = any(c in string.ascii_lowercase for c in password)
    upper = any(c in string.ascii_uppercase for c in password)
    digit = any(c.isdigit() for c in password)
    special = any(c in string.punctuation for c in password)

    score = sum([lower, upper, digit, special])

    if length < 6:
        return "Weak"
    elif score == 4 and length >= 10:
        return "Strong"
    elif score >= 3:
        return "Moderate"
    else:
        return "Weak"

@app.route('/', methods=['GET', 'POST'])
def index():
    strength = None
    if request.method == 'POST':
        password = request.form['password']
        strength = check_password_strength(password)
    return render_template('index.html', strength=strength)

if __name__ == '__main__':
    app.run(debug=True)
