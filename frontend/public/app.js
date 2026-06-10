const apiBase = "/api";
const tokenKey = "healthTrackerToken";

// UI Elements
const registerForm = document.getElementById("register-form");
const loginForm = document.getElementById("login-form");
const logoutButton = document.getElementById("logout-button");
const authStatus = document.getElementById("auth-status");
const dailyButton = document.getElementById("daily-button");
const dailyOutput = document.getElementById("daily-output");
const analyzeForm = document.getElementById("analyze-form");
const analysisResult = document.getElementById("analysis-result");
const uploadZone = document.getElementById("upload-zone");
const mealFile = document.getElementById("meal-file");
const authSection = document.getElementById("auth-section");
const appSection = document.getElementById("app-section");
const toast = document.getElementById("toast");

// Toast notifications
function showToast(text, type = "info", duration = 3000) {
  toast.textContent = text;
  toast.className = `toast ${type} show`;
  setTimeout(() => {
    toast.classList.remove("show");
  }, duration);
}

// Token management
function getToken() {
  return localStorage.getItem(tokenKey);
}

function setToken(token) {
  localStorage.setItem(tokenKey, token);
  updateAuthState();
}

function clearToken() {
  localStorage.removeItem(tokenKey);
  updateAuthState();
}

// UI state
function updateAuthState() {
  const token = getToken();
  if (token) {
    authStatus.textContent = "✓ Signed in";
    authStatus.classList.add("signed-in");
    authSection.classList.remove("active");
    appSection.classList.add("active");
    logoutButton.style.display = "block";
  } else {
    authStatus.textContent = "Not signed in";
    authStatus.classList.remove("signed-in");
    authSection.classList.add("active");
    appSection.classList.remove("active");
    logoutButton.style.display = "none";
  }
}

// API calls
async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = options.headers || {};

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${apiBase}${path}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type") || "";
  const body = contentType.includes("application/json") ? await response.json() : await response.text();

  if (!response.ok) {
    const message = typeof body === "object" ? body.detail || JSON.stringify(body) : body;
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return body;
}

// Register
registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const username = document.getElementById("reg-username").value;
  const password = document.getElementById("reg-password").value;

  try {
    const result = await apiFetch("/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    showToast(`Welcome ${result.username}! Now sign in.`, "success");
    registerForm.reset();
  } catch (error) {
    showToast(error.message, "error");
  }
});

// Login
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;
  const body = new URLSearchParams();
  body.append("username", username);
  body.append("password", password);

  try {
    const result = await apiFetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });
    setToken(result.access_token);
    showToast("Login successful!", "success");
    loginForm.reset();
  } catch (error) {
    showToast(error.message, "error");
  }
});

// Logout
logoutButton.addEventListener("click", () => {
  clearToken();
  showToast("Logged out.", "info");
});

// Upload zone drag & drop
uploadZone.addEventListener("click", () => mealFile.click());
uploadZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  uploadZone.style.borderColor = "var(--primary)";
  uploadZone.style.background = "rgba(59, 130, 246, 0.1)";
});
uploadZone.addEventListener("dragleave", () => {
  uploadZone.style.borderColor = "var(--border)";
  uploadZone.style.background = "rgba(59, 130, 246, 0.02)";
});
uploadZone.addEventListener("drop", (e) => {
  e.preventDefault();
  uploadZone.style.borderColor = "var(--border)";
  uploadZone.style.background = "rgba(59, 130, 246, 0.02)";
  if (e.dataTransfer.files.length) {
    mealFile.files = e.dataTransfer.files;
    updateUploadZoneLabel();
  }
});

mealFile.addEventListener("change", updateUploadZoneLabel);

function updateUploadZoneLabel() {
  if (mealFile.files.length > 0) {
    const fileName = mealFile.files[0].name;
    uploadZone.querySelector(".upload-prompt").innerHTML = `
      <span class="upload-icon">✓</span>
      <p><strong>${fileName}</strong></p>
      <small>Ready to analyze</small>
    `;
  }
}

// Analyze image
analyzeForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!mealFile.files.length) {
    showToast("Please choose an image file.", "error");
    return;
  }

  const formData = new FormData();
  formData.append("file", mealFile.files[0]);
  const userPrompt = document.getElementById("user-prompt").value.trim();
  if (userPrompt) {
    formData.append("user_prompt", userPrompt);
  }

  analysisResult.innerHTML = '<div class="loading"></div> Analyzing your meal...';

  try {
    const result = await apiFetch("/analyze-image", {
      method: "POST",
      body: formData,
    });

    renderFoodAnalysis(result.foods);
    showToast("Meal analyzed successfully!", "success");
    analyzeForm.reset();
    mealFile.files = new FileList();
    updateUploadZoneLabel();
  } catch (error) {
    analysisResult.innerHTML = `<p style="color: var(--danger);">❌ Analysis failed: ${error.message}</p>`;
    showToast(error.message, "error");
  }
});

function renderFoodAnalysis(foods) {
  if (!foods || foods.length === 0) {
    analysisResult.innerHTML = "<p>No foods detected.</p>";
    return;
  }

  let html = "<h4>📋 Analyzed Foods</h4><div class='foods-grid'>";
  foods.forEach((food) => {
    const caloriesColor = food.calories > 500 ? "#f5576c" : food.calories > 300 ? "#f59e0b" : "#10b981";
    html += `
      <div class="food-card">
        <h4>${food.food_name}</h4>
        <div class="qty">${food.qty}</div>
        <div class="macro-row">
          <span class="macro-label">Calories</span>
          <span class="macro-value">${Math.round(food.calories)}</span>
        </div>
        <div class="macro-row">
          <span class="macro-label">Protein</span>
          <span class="macro-value">${food.protein.toFixed(1)}g</span>
        </div>
        <div class="macro-row">
          <span class="macro-label">Carbs</span>
          <span class="macro-value">${food.carbs.toFixed(1)}g</span>
        </div>
        <div class="macro-row">
          <span class="macro-label">Fat</span>
          <span class="macro-value">${food.fat.toFixed(1)}g</span>
        </div>
      </div>
    `;
  });
  html += "</div>";
  analysisResult.innerHTML = html;
}

// Daily macros
dailyButton.addEventListener("click", async () => {
  dailyOutput.innerHTML = '<div class="loading"></div> Loading your daily nutrition...';

  try {
    const result = await apiFetch("/daily-macros");
    renderDailyMacros(result.total_macros);
    showToast("Daily macros loaded!", "success");
  } catch (error) {
    dailyOutput.innerHTML = `<p style="color: var(--danger);">❌ Failed to load: ${error.message}</p>`;
    showToast(error.message, "error");
  }
});

function renderDailyMacros(macros) {
  if (!macros) {
    dailyOutput.innerHTML = "<p>No meals logged today.</p>";
    return;
  }

  const totalCalories = macros.total_calories || 0;
  const totalProtein = macros.total_protein || 0;
  const totalCarbs = macros.total_carbs || 0;
  const totalFat = macros.total_fat || 0;

  dailyOutput.innerHTML = `
    <div class="macros-grid">
      <div class="macro-item">
        <div class="label">Calories</div>
        <div class="value">${Math.round(totalCalories)}</div>
        <div class="unit">kcal</div>
      </div>
      <div class="macro-item protein">
        <div class="label">Protein</div>
        <div class="value">${totalProtein.toFixed(1)}</div>
        <div class="unit">g</div>
      </div>
      <div class="macro-item carbs">
        <div class="label">Carbs</div>
        <div class="value">${totalCarbs.toFixed(1)}</div>
        <div class="unit">g</div>
      </div>
      <div class="macro-item fat">
        <div class="label">Fat</div>
        <div class="value">${totalFat.toFixed(1)}</div>
        <div class="unit">g</div>
      </div>
    </div>
  `;
}

// Initialize
updateAuthState();

