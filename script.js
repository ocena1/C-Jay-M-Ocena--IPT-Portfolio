/*========== menu icon navbar ==========*/
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
  menuIcon.classList.toggle('bx-x');
  navbar.classList.toggle('active');
};


/*========== scroll sections active link ==========*/
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
  sections.forEach(sec => {
    let top = window.scrollY;
    let offset = sec.offsetTop - 150;
    let height = sec.offsetHeight;
    let id = sec.getAttribute('id');

    if (top >= offset && top < offset + height) {
      navLinks.forEach(links => {
        links.classList.remove('active');
        const link = document.querySelector('header nav a[href*=' + id + ']');
        if (link) link.classList.add('active');
      });
    }
  });

  let header = document.querySelector('.header');
  header.classList.toggle('sticky', window.scrollY > 100);

  menuIcon.classList.remove('bx-x');
  navbar.classList.remove('active');
};


/*========== swiper ==========*/
var swiper = new Swiper(".mySwiper", {
  slidesPerView: 1,
  spaceBetween: 50,
  loop: true,
  grabCursor: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});


/*========== dark light mode ==========*/
let darkModeIcon = document.querySelector('#darkMode-icon');

darkModeIcon.onclick = () => {
  darkModeIcon.classList.toggle('bx-sun');
  document.body.classList.toggle('dark-mode');
};


/*========== scroll reveal ==========*/
ScrollReveal({
  reset: true,
  distance: '80px',
  duration: 2000,
  delay: 200
});

ScrollReveal().reveal('.home-content, .heading', { origin: 'top' });
ScrollReveal().reveal('.home-img img, .hobbies-container, .portfolio-box, .testimonial-wrapper .contact form', { origin: 'bottom' });
ScrollReveal().reveal('.home-content h1, .about-img img', { origin: 'left' });
ScrollReveal().reveal('.home-content h3, .home-content p, .about-content', { origin: 'right' });


// ===============================
// FEEDBACK API (Google Apps Script)
// ===============================
const FEEDBACK_API_URL =
  "https://script.google.com/macros/s/AKfycbwrVr57DdprFPDaVg-hgTELBE_d7cCrlxRp7GM0IgVhnOhER7ynDrHeOaqSsQ1-Ntz5JA/exec";

// ===============================
// GITHUB API (Projects)
// ===============================
const GITHUB_USERNAME = "ocena1";
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos`;

async function loadGitHubProjects() {
  const container = document.getElementById("githubProjects");
  if (!container) return;

  container.innerHTML = `<p class="muted">Loading projects from GitHub...</p>`;

  try {
    const res = await fetch(GITHUB_API_URL);
    if (!res.ok) throw new Error("GitHub API error");

    const repos = await res.json();
    const filtered = repos.filter(repo => !repo.fork);

    if (filtered.length === 0) {
      container.innerHTML = `<p class="muted">No public repositories found.</p>`;
      return;
    }

    container.innerHTML = filtered.slice(0, 6).map(repo => `
      <div class="portfolio-box">
        <img src="https://opengraph.githubassets.com/1/${GITHUB_USERNAME}/${repo.name}" alt="${repo.name}">
        <div class="portfolio-layer">
          <h4>${repo.name}</h4>
          <p>${repo.description || "No description provided."}</p>
          <a href="${repo.html_url}" target="_blank" aria-label="View on GitHub">
            <i class='bx bx-link-external'></i>
          </a>
        </div>
      </div>
    `).join("");

  } catch (err) {
    container.innerHTML = `<p class="muted">Failed to load GitHub projects.</p>`;
  }
}


// ===============================
// DOM READY: wire up forms + load data
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  // ---------- Feedback elements ----------
  const feedbackForm = document.getElementById("feedbackForm");
  const feedbackContainer = document.getElementById("feedbackContainer");
  const ratingSelect = document.getElementById("fbRating");
  const stars = document.querySelectorAll(".star-rating .star");

  function setText(id, msg = "", isErr = false) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = msg;
    el.style.color = isErr ? "#d93025" : "green";
  }

  // ----- Stars UI -----
  function paintStars(val) {
    stars.forEach(btn => {
      const v = Number(btn.dataset.value);
      btn.classList.toggle("active", v <= val);
    });
  }

  if (stars.length && ratingSelect) {
    stars.forEach(btn => {
      btn.addEventListener("click", () => {
        const val = btn.dataset.value;
        ratingSelect.value = val;
        paintStars(Number(val));
      });
    });
  }

  // ----- Feedback API helpers -----
  async function fetchFeedbackFromAPI() {
    const res = await fetch(FEEDBACK_API_URL);
    return res.json();
  }

  async function sendFeedbackToAPI(entry) {
    const res = await fetch(FEEDBACK_API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" }, // avoids preflight
      body: JSON.stringify(entry),
    });
    return res.json();
  }

  // ----- Render feedback list -----
  async function renderFeedbackFromAPI() {
    if (!feedbackContainer) return;
    feedbackContainer.innerHTML = `<p class="muted">Loading feedback...</p>`;

    try {
      const data = await fetchFeedbackFromAPI();
      if (!data.ok) throw new Error("API error");

      const items = data.items || [];
      if (items.length === 0) {
        feedbackContainer.innerHTML = `<p class="muted">No feedback yet. Be the first to leave one!</p>`;
        return;
      }

      feedbackContainer.innerHTML = items.map(item => {
        const safeName = item.name?.trim() ? item.name.trim() : "Anonymous";
        const date = new Date(item.timestamp).toLocaleString();
        const starsTxt = "★★★★★".slice(0, Number(item.rating || 0)).padEnd(5, "☆");

        return `
          <div class="feedback-item">
            <div class="feedback-top">
              <div>
                <div class="feedback-name">${safeName}</div>
                <div class="muted">${starsTxt}</div>
              </div>
              <div class="feedback-date">${date}</div>
            </div>
            <p class="feedback-comment">${item.comment}</p>
          </div>
        `;
      }).join("");

    } catch (err) {
      feedbackContainer.innerHTML = `<p class="muted">Could not load feedback right now.</p>`;
    }
  }

  // ----- Submit handler -----
  if (feedbackForm) {
    feedbackForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      setText("fbStatus", "", false);

      const name = document.getElementById("fbName")?.value.trim() || "";
      const rating = document.getElementById("fbRating")?.value || "";
      const comment = document.getElementById("fbComment")?.value.trim() || "";

      if (!rating) return setText("fbStatus", "Please choose a rating.", true);
      if (comment.length < 5) return setText("fbStatus", "Comment must be at least 5 characters.", true);

      try {
        setText("fbStatus", "Submitting...", false);
        const result = await sendFeedbackToAPI({ name, rating, comment });

        if (result.ok) {
          setText("fbStatus", "Thanks! Your feedback was submitted.", false);
          feedbackForm.reset();
          paintStars(0);
          await renderFeedbackFromAPI();
        } else {
          setText("fbStatus", "Submission failed. Try again.", true);
        }
      } catch (err) {
        setText("fbStatus", "Network error. Try again.", true);
      }
    });
  }

  // ---------- Contact Form (Formspree + JS) ----------
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const statusEl = document.getElementById("contactStatus");
      const submitBtn = document.getElementById("contactSubmitBtn");

      const name = document.getElementById("contactName").value.trim();
      const email = document.getElementById("contactEmail").value.trim();
      const subject = document.getElementById("contactSubject").value.trim();
      const message = document.getElementById("contactMessage").value.trim();

      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      statusEl.textContent = "";
      statusEl.style.color = "inherit";

      if (name.length < 2) { statusEl.textContent = "Please enter your full name."; statusEl.style.color = "#d93025"; return; }
      if (!emailValid) { statusEl.textContent = "Please enter a valid email address."; statusEl.style.color = "#d93025"; return; }
      if (subject.length < 3) { statusEl.textContent = "Please enter a subject."; statusEl.style.color = "#d93025"; return; }
      if (message.length < 10) { statusEl.textContent = "Message must be at least 10 characters."; statusEl.style.color = "#d93025"; return; }

      try {
        submitBtn.disabled = true;
        statusEl.textContent = "Sending message...";
        statusEl.style.color = "inherit";

        const formData = new FormData(contactForm);

        const response = await fetch(contactForm.action, {
          method: "POST",
          body: formData,
          headers: { "Accept": "application/json" }
        });

        if (response.ok) {
          statusEl.textContent = "Message sent successfully! Thank you 😊";
          statusEl.style.color = "green";
          contactForm.reset();
        } else {
          statusEl.textContent = "Failed to send message. Please try again.";
          statusEl.style.color = "#d93025";
        }
      } catch (error) {
        statusEl.textContent = "Network error. Please try again later.";
        statusEl.style.color = "#d93025";
      } finally {
        submitBtn.disabled = false;
      }
    });
  }

  // ---------- Initial loads ----------
  renderFeedbackFromAPI();
  loadGitHubProjects();
});