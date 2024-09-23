// Manage user data in localStorage
const users = JSON.parse(localStorage.getItem('users')) || {};
let currentUser = null;

// Sign-up a new user
function signUp() {
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;

    if (username && password) {
        if (!users[username]) {
            users[username] = { password, jerricans: 0 };
            localStorage.setItem('users', JSON.stringify(users));
            alert('Sign-up successful! Please login.');
            showLogin();
        } else {
            alert('Username already exists.');
        }
    } else {
        alert('Please fill out all fields.');
    }
}

// Login user
function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    if (users[username] && users[username].password === password) {
        currentUser = username;
        localStorage.setItem('currentUser', currentUser);
        showDashboard();
    } else {
        alert('Invalid username or password.');
    }
}

// Logout user
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('auth-section').style.display = 'block';
}

// Show sign-up form
function showSignUp() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'block';
}

// Show login form
function showLogin() {
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
}

// Display dashboard for logged-in user
function showDashboard() {
    currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        document.getElementById('tenant-name').innerText = currentUser;
        document.getElementById('tenant-count').innerText = users[currentUser].jerricans;
        document.getElementById('auth-section').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        if (users[currentUser].jerricans >= 5) {
            document.getElementById('fetch-btn').disabled = true;
        }
    }
}

// Fetch jerrican for the logged-in user
function fetchJerrican() {
    if (currentUser && users[currentUser].jerricans < 5) {
        users[currentUser].jerricans++;
        localStorage.setItem('users', JSON.stringify(users));
        document.getElementById('tenant-count').innerText = users[currentUser].jerricans;
        if (users[currentUser].jerricans === 5) {
            document.getElementById('fetch-btn').disabled = true;
        }
    }
}

// Reset jerrican count weekly
function resetWeeklyCounts() {
    Object.keys(users).forEach(user => {
        users[user].jerricans = 0;
    });
    localStorage.setItem('users', JSON.stringify(users));
}

// Run reset check on page load
document.addEventListener('DOMContentLoaded', function () {
    const lastReset = localStorage.getItem("lastReset");
    const now = new Date();

    if (lastReset) {
        const lastResetDate = new Date(lastReset);
        const oneWeek = 7 * 24 * 60 * 60 * 1000;
        if (now - lastResetDate >= oneWeek) {
            resetWeeklyCounts();
            localStorage.setItem("lastReset", now.toISOString());
        }
    } else {
        localStorage.setItem("lastReset", now.toISOString());
    }

    if (localStorage.getItem('currentUser')) {
        showDashboard();
    }
});
