// TechSpark 2026: interactive features
// 1. Countdown timer   2. Event filter   3. Fee calculator   4. Form validation

// ---------- 1. Countdown to the event ----------
const eventDate = new Date("2026-11-20T09:00:00");

function updateCountdown() {
  let diff = eventDate - new Date();
  if (diff < 0) diff = 0;                       // event has started

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  document.getElementById("days").textContent = days;
  document.getElementById("hours").textContent = hours;
  document.getElementById("minutes").textContent = minutes;
  document.getElementById("seconds").textContent = seconds;
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ---------- 2. Filter events by category ----------
const filterButtons = document.querySelectorAll(".filter");
const cards = document.querySelectorAll(".card");
const eventCount = document.getElementById("eventCount");

function showCount() {
  const visible = document.querySelectorAll(".card:not(.hidden)").length;
  eventCount.textContent = "Showing " + visible + " of " + cards.length + " events";
}

filterButtons.forEach(function (btn) {
  btn.addEventListener("click", function () {
    const chosen = btn.dataset.filter;

    filterButtons.forEach(function (b) { b.classList.remove("active"); });
    btn.classList.add("active");

    cards.forEach(function (card) {
      const match = chosen === "all" || card.dataset.category === chosen;
      card.classList.toggle("hidden", !match);
    });
    showCount();
  });
});
showCount();

// ---------- 3. Fee calculator ----------
const form = document.getElementById("regForm");
const checkboxes = document.querySelectorAll('input[name="event"]');
const totalEl = document.getElementById("total");

function calculateTotal() {
  let total = 0;
  checkboxes.forEach(function (box) {
    if (box.checked) total += Number(box.value);
  });
  totalEl.textContent = "Rs. " + total;
  return total;
}
checkboxes.forEach(function (box) { box.addEventListener("change", calculateTotal); });

// ---------- 4. Form validation ----------
function setError(fieldId, message) {
  const input = document.getElementById(fieldId);
  const wrapper = input ? input.closest(".field") : null;
  document.getElementById(fieldId + "Error").textContent = message;
  if (wrapper) wrapper.classList.toggle("invalid", message !== "");
}

function validateForm() {
  let ok = true;
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const year = document.getElementById("year").value;

  if (name.length < 3) { setError("name", "Enter your full name (at least 3 characters)."); ok = false; }
  else setError("name", "");

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("email", "Enter a valid email address."); ok = false; }
  else setError("email", "");

  if (!/^[6-9]\d{9}$/.test(phone)) { setError("phone", "Enter a 10-digit mobile number starting with 6-9."); ok = false; }
  else setError("phone", "");

  if (year === "") { setError("year", "Select your year of study."); ok = false; }
  else setError("year", "");

  const eventError = document.getElementById("eventError");
  if (calculateTotal() === 0) { eventError.textContent = "Select at least one event."; ok = false; }
  else eventError.textContent = "";

  return ok;
}

form.addEventListener("submit", function (e) {
  e.preventDefault();                           // stay on the page
  const box = document.getElementById("confirmation");

  if (!validateForm()) { box.hidden = true; return; }

  const chosen = [];
  checkboxes.forEach(function (c) {
    if (c.checked) chosen.push(c.parentElement.textContent.trim());
  });

  box.hidden = false;
  box.innerHTML = "<strong>Thank you, " + document.getElementById("name").value.trim() +
    "!</strong><br>You registered for: " + chosen.join(", ") +
    ".<br>Total fee: Rs. " + calculateTotal() + ". Confirmation sent to " +
    document.getElementById("email").value.trim() + ".";
  form.reset();
  calculateTotal();
});

form.addEventListener("reset", function () {
  setTimeout(function () {
    ["name", "email", "phone", "year"].forEach(function (id) { setError(id, ""); });
    document.getElementById("eventError").textContent = "";
    document.getElementById("confirmation").hidden = true;
    calculateTotal();
  }, 0);
});
