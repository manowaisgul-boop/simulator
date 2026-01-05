let processes = [];
let results = [];

// TOAST
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

// Add process
function addProcess() {
  const pid = document.getElementById("pid").value;
  const at = Number(document.getElementById("at").value);
  const bt = Number(document.getElementById("bt").value);
  const priority = document.getElementById("priority").value;

  if (!pid || isNaN(at) || isNaN(bt)) {
    showToast("Please enter valid values");
    return;
  }

  processes.push({ pid, at, bt, priority });
  showToast(`Process ${pid} added successfully`);

  document.getElementById("pid").value = "";
  document.getElementById("at").value = "";
  document.getElementById("bt").value = "";
  document.getElementById("priority").value = "1";
}

// Run FCFS
function runFCFS() {
  results = [];
  let time = 0;

  processes.sort((a, b) => a.at - b.at);

  processes.forEach(p => {
    if (time < p.at) time = p.at;

    let st = time;
    let ct = st + p.bt;
    let tat = ct - p.at;
    let wt = tat - p.bt;
    let rt = st - p.at;

    results.push({ ...p, st, ct, tat, wt, rt });
    time = ct;
  });

  renderTable();
  showToast("FCFS scheduling completed");

  // Show timeline label immediately after scheduling
  document.getElementById("timeline-label").textContent = "Execution Timeline";
}

// Render table
function renderTable() {
  const tbody = document.getElementById("resultTable");
  tbody.innerHTML = "";

  results.forEach(p => {
    tbody.innerHTML += `
      <tr>
        <td>${p.pid}</td>
        <td>${p.at}</td>
        <td>${p.bt}</td>
        <td>${p.priority}</td>
        <td>${p.st}</td>
        <td>${p.ct}</td>
        <td>${p.wt}</td>
        <td>${p.tat}</td>
        <td>${p.rt}</td>
      </tr>
    `;
  });
}

// Timeline
function animateTimeline() {
  if (results.length === 0) {
    showToast("Run FCFS first");
    return;
  }

  const timeline = document.getElementById("timeline");
  timeline.innerHTML = "";

  let index = 0;

  function drawNext() {
    if (index >= results.length) return;

    const p = results[index];
    const block = document.createElement("div");
    block.className = "timeline-block";
    block.style.width = "0px";
    block.textContent = p.pid;
    timeline.appendChild(block);

    let width = 0;
    const target = p.bt * 30;

    const interval = setInterval(() => {
      width += 4;
      block.style.width = width + "px";
      if (width >= target) {
        clearInterval(interval);
        index++;
        setTimeout(drawNext, 300);
      }
    }, 15);
  }

  drawNext();
}

// Reset
function resetAll() {
  processes = [];
  results = [];

  document.getElementById("resultTable").innerHTML = "";
  document.getElementById("timeline").innerHTML = "";
  document.getElementById("timeline-label").textContent = "";
  document.getElementById("pid").value = "";
  document.getElementById("at").value = "";
  document.getElementById("bt").value = "";
  document.getElementById("priority").value = "1";

  showToast("Reset completed");
}
