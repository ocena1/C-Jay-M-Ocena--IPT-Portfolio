# C-Jay-M-Ocena--IPT-Portfolio

## Project Overview
This project is a personal portfolio website created as part of a school requirement.  
The website showcases my background, skills, projects, and allows users to interact with me through contact and feedback forms.

The site is built using **HTML, CSS, and JavaScript** and integrates multiple APIs to demonstrate real-world web development concepts such as data submission, API consumption, and dynamic content rendering.

---

## APIs Used

### 1. Formspree API
**Purpose:**  
Used to handle the Contact Me form.  
It allows visitors to send messages directly to my email without the need for a backend server.

**Usage:**  
- Sends contact form data via HTTP POST
- Displays success or error messages using JavaScript

---

### 2. Google Apps Script API (Google Sheets)
**Purpose:**  
Used for the Feedback feature.  
Submitted feedback (name, rating, and comment) is stored in a Google Sheet and retrieved dynamically.

**Usage:**  
- POST request to save feedback
- GET request to fetch and display recent feedback
- Acts as a custom REST-like API endpoint

---

### 3. GitHub API
**Purpose:**  
Used to dynamically fetch and display my public GitHub repositories in the Projects/Portfolio section.

**Usage:**  
- Fetches repository data from GitHub
- Displays project name, description, and repository link
- Ensures projects stay updated automatically

---

## Transaction Features

### 1. Contact Form Transaction
- User submits name, email, subject, and message
- Data is sent to Formspree API
- User receives real-time success or error feedback
- Message is delivered to my email

---

### 2. Feedback Form Transaction
- User submits a rating and comment
- Data is sent to Google Apps Script API
- Feedback is saved in Google Sheets
- Updated feedback list is displayed instantly on the website

---

## How to Run or View the Project

### Option 1: View Locally
1. Download or clone the project folder
2. Open the folder in **VS Code**
3. Use **Live Server** to run `index.html`
   - Right-click `index.html`
   - Select **Open with Live Server**

### Option 2: View via GitHub
1. Open the GitHub repository link
2. Use GitHub Pages (if enabled) or clone the repository locally
3. Open `index.html` in a browser or via Live Server

---

## Technologies Used
- HTML5
- CSS3
- JavaScript (ES6)
- Formspree API
- Google Apps Script (Google Sheets API)
- GitHub REST API

---

## Author
**C-Jay M. Ocena**  
Bachelor of Science in Information Technology  
Camarines Norte State College
