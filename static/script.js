let expenses = [];
let budget = 0;

document.getElementById("expense-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const date = document.getElementById("date").value;
  const desc = document.getElementById("description").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const category = document.getElementById("category").value;

  if (!date || !desc || !amount || !category) return;

  expenses.push({ date, desc, amount, category });
  updateUI();
  this.reset();
});

function updateUI() {
  const list = document.getElementById("expense-list");
  list.innerHTML = "";
  let total = 0;
  const categoryMap = {};

  expenses.forEach((exp, index) => {
    total += exp.amount;
    categoryMap[exp.category] = (categoryMap[exp.category] || 0) + exp.amount;

    const li = document.createElement("li");
    li.innerHTML = `${exp.date} - ${exp.desc} - $${exp.amount.toFixed(2)} (${exp.category})
      <button onclick="deleteExpense(${index})">🗑</button>`;
    list.appendChild(li);
  });

  document.getElementById("total").textContent = total.toFixed(2);
  updateBudgetStatus(total);
  drawChart(categoryMap);
}

function deleteExpense(index) {
  expenses.splice(index, 1);
  updateUI();
}

function setBudget() {
  const value = parseFloat(document.getElementById("budget").value);
  if (isNaN(value) || value <= 0) return;
  budget = value;
  updateUI();
}

function updateBudgetStatus(total) {
  const statusEl = document.getElementById("budget-status");

  if (budget <= 0) {
    statusEl.textContent = "No budget set";
    statusEl.className = "status-box";
    return;
  }

  const diff = budget - total;
  if (diff > 50) {
    statusEl.textContent = `✅ Under Budget by $${diff.toFixed(2)}`;
    statusEl.className = "status-box status-green";
  } else if (diff >= 0) {
    statusEl.textContent = `⚠️ Close to Budget: $${diff.toFixed(2)} left`;
    statusEl.className = "status-box status-yellow";
  } else {
    statusEl.textContent = `❌ Over Budget by $${Math.abs(diff).toFixed(2)}`;
    statusEl.className = "status-box status-red";
  }
}

function drawChart(data) {
  const ctx = document.getElementById("expense-chart").getContext("2d");
  if (window.expenseChart) window.expenseChart.destroy();

  window.expenseChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: Object.keys(data),
      datasets: [{
        data: Object.values(data),
        backgroundColor: [
          "#4caf50", "#2196f3", "#ff9800", "#f44336", "#9c27b0", "#00bcd4"
        ]
      }]
    }
  });
}
