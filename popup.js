
// // === popup.js ===
// let timeComplexityChart = null;
// let spaceComplexityChart = null;
// const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// document.addEventListener('DOMContentLoaded', () => {
//   // Load saved API key
//   chrome.storage.sync.get('apiKey', ({ apiKey }) => {
//     if (apiKey) {
//       document.getElementById('apiKeyInput').value = apiKey;
//     }
//   });

//   // Save API key
//   document.getElementById('saveKeyBtn').addEventListener('click', () => {
//     const key = document.getElementById('apiKeyInput').value.trim();
//     if (!key) {
//       alert('Please enter a valid API Key.');
//       return;
//     }
//     chrome.storage.sync.set({ apiKey: key }, () => {
//       alert('API Key saved successfully!');
//     });
//   });
// });

// document.addEventListener("DOMContentLoaded", () => {
//   const toggle = document.getElementById("darkModeToggle");

//   // Load saved preference
//   const darkMode = localStorage.getItem("darkMode") === "true";
//   toggle.checked = darkMode;
//   document.body.classList.toggle("dark-mode", darkMode);

//   // Toggle listener
//   toggle.addEventListener("change", () => {
//     document.body.classList.toggle("dark-mode", toggle.checked);
//     localStorage.setItem("darkMode", toggle.checked);
//   });
// });


// document.getElementById('analyzeBtn').addEventListener('click', async () => {
//   const analyzeBtn = document.getElementById('analyzeBtn');
//   const originalText = analyzeBtn.textContent;

//   const code = document.getElementById('codeInput').value.trim();
//   if (!code) return;

//   // Disable button and show loading state
//   analyzeBtn.disabled = true;
//   analyzeBtn.textContent = 'Loading…';
//   analyzeBtn.style.cursor = 'not-allowed';

//   try {
//     // Retrieve API key
//     const apiKey = await new Promise(resolve => {
//       chrome.storage.sync.get('apiKey', ({ apiKey }) => resolve(apiKey));
//     });
//     if (!apiKey) {
//       const confirmMsg = 'No API Key found.\nClick OK to get your API key from AI Studio.';
//       if (confirm(confirmMsg)) {
//         window.open('https://aistudio.google.com/app/apikey', '_blank');
//       }
//       return;
//     }

//     // Build prompt
//     const promptText = `Analyze the following code and respond with only Big O notation for time and space complexity in JSON format like this:\n{\n  "time_complexity": {\n    "best_case": "O(n)",\n    "average_case": "O(n log n)",\n    "worst_case": "O(n^2)"\n  },\n  "space_complexity": "O(n)"\n}\nCode:\n${code}`;

//     // Call API
//     const response = await fetch(`${API_URL}?key=${apiKey}`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }] })
//     });
//     const data = await response.json();
//     if (data.error) throw new Error(data.error.message);

//     // Extract and clean response text
//     let responseText = (data.candidates?.[0]?.content?.parts || [])
//       .map(p => p.text || '')
//       .join('').trim();
//     if (responseText.startsWith('```')) {
//       const lines = responseText.split('\n');
//       if (lines[0].startsWith('```')) lines.shift();
//       if (lines[lines.length - 1].startsWith('```')) lines.pop();
//       responseText = lines.join('\n').trim();
//     }

//     // Parse and render
//     const analysis = JSON.parse(responseText);
//     updateCharts(analysis);

//   } catch (err) {
//     console.error(err);
//     alert("ensures that the entered text is a piece of code :)  " + 'Analysis failed [ (or change api key here -> https://aistudio.google.com/app/apikey) ]');
//   } finally {
//     // Re-enable button
//     analyzeBtn.disabled = false;
//     analyzeBtn.textContent = originalText;
//     analyzeBtn.style.cursor = 'pointer';
//   }
// });

// // Big O curve generator
// function generateBigOCurve(type, nValues) {
//   switch (type) {
//     case 'O(1)':       return nValues.map(() => 1);
//     case 'O(log n)':   return nValues.map(n => Math.log2(n));
//     case 'O(n)':       return [...nValues];
//     case 'O(n log n)': return nValues.map(n => n * Math.log2(n));
//     case 'O(n^2)':     return nValues.map(n => n * n);
//     case 'O(2^n)':     return nValues.map(n => Math.pow(2, n));
//     default:           return [...nValues];
//   }
// }

// // Chart rendering
// function updateCharts(analysis) {
//   const nValues = Array.from({ length: 20 }, (_, i) => i + 1);
//   const timeCtx = document.getElementById('timeComplexityChart').getContext('2d');
//   const spaceCtx = document.getElementById('spaceComplexityChart').getContext('2d');

//   if (timeComplexityChart) timeComplexityChart.destroy();
//   if (spaceComplexityChart) spaceComplexityChart.destroy();

//   timeComplexityChart = new Chart(timeCtx, {
//     type: 'line',
//     data: {
//       labels: nValues,
//       datasets: [
//         {
//           label: `Best (${analysis.time_complexity.best_case})`,
//           data: generateBigOCurve(analysis.time_complexity.best_case, nValues),
//           tension: 0.3
//         },
//         {
//           label: `Avg (${analysis.time_complexity.average_case})`,
//           data: generateBigOCurve(analysis.time_complexity.average_case, nValues),
//           tension: 0.3
//         },
//         {
//           label: `Worst (${analysis.time_complexity.worst_case})`,
//           data: generateBigOCurve(analysis.time_complexity.worst_case, nValues),
//           tension: 0.3
//         }
//       ]
//     },
//     options: {
//       responsive: true,
//       plugins: {
//         title: { display: true, text: 'Time Complexity (Big O)' }
//       }
//     }
//   });

//   spaceComplexityChart = new Chart(spaceCtx, {
//     type: 'line',
//     data: {
//       labels: nValues,
//       datasets: [
//         {
//           label: `Space (${analysis.space_complexity})`,
//           data: generateBigOCurve(analysis.space_complexity, nValues),
//           tension: 0.3
//         }
//       ]
//     },
//     options: {
//       responsive: true,
//       plugins: {
//         title: { display: true, text: 'Space Complexity (Big O)' }
//       }
//     }
//   });
// }


// === popup.js ===
let timeComplexityChart = null;
let spaceComplexityChart = null;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

document.addEventListener('DOMContentLoaded', () => {
  // Load saved API key
  chrome.storage.sync.get('apiKey', ({ apiKey }) => {
    if (apiKey) {
      document.getElementById('apiKeyInput').value = apiKey;
    }
  });

  // Save API key
  document.getElementById('saveKeyBtn').addEventListener('click', () => {
    const key = document.getElementById('apiKeyInput').value.trim();
    if (!key) {
      alert('Please enter a valid API Key.');
      return;
    }
    chrome.storage.sync.set({ apiKey: key }, () => {
      alert('API Key saved successfully!');
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("darkModeToggle");

  // Load saved preference
  const darkMode = localStorage.getItem("darkMode") === "true";
  toggle.checked = darkMode;
  document.body.classList.toggle("dark-mode", darkMode);

  // Toggle listener
  toggle.addEventListener("change", () => {
    document.body.classList.toggle("dark-mode", toggle.checked);
    localStorage.setItem("darkMode", toggle.checked);
  });
});


document.getElementById('analyzeBtn').addEventListener('click', async () => {
  const analyzeBtn = document.getElementById('analyzeBtn');
  const originalText = analyzeBtn.textContent;

  const code = document.getElementById('codeInput').value.trim();
  if (!code) return;

  // Disable button and show loading state
  analyzeBtn.disabled = true;
  analyzeBtn.textContent = 'Loading…';
  analyzeBtn.style.cursor = 'not-allowed';

  try {
    // Retrieve API key
    const apiKey = await new Promise(resolve => {
      chrome.storage.sync.get('apiKey', ({ apiKey }) => resolve(apiKey));
    });
    if (!apiKey) {
      const confirmMsg = 'No API Key found.\nClick OK to get your API key from AI Studio.';
      if (confirm(confirmMsg)) {
        window.open('https://aistudio.google.com/app/apikey', '_blank');
      }
      return;
    }

    // Build prompt
    const promptText = `Analyze the following code and respond with only Big O notation for time and space complexity in JSON format like this:\n{\n  "time_complexity": {\n    "best_case": "O(n)",\n    "average_case": "O(n log n)",\n    "worst_case": "O(n^2)"\n  },\n  "space_complexity": "O(n)"\n}\nCode:\n${code}`;

    // Call API
    const response = await fetch(`${API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }] })
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);

    // Extract and clean response text
    let responseText = (data.candidates?.[0]?.content?.parts || [])
      .map(p => p.text || '')
      .join('').trim();
    if (responseText.startsWith('```')) {
      const lines = responseText.split('\n');
      if (lines[0].startsWith('```')) lines.shift();
      if (lines[lines.length - 1].startsWith('```')) lines.pop();
      responseText = lines.join('\n').trim();
    }

    // Parse and render
    const analysis = JSON.parse(responseText);
    updateCharts(analysis);

  } catch (err) {
    console.error(err);
    alert("ensures that the entered text is a piece of code :)  " + 'Analysis failed [ (or change api key here -> https://aistudio.google.com/app/apikey) ]');
  } finally {
    // Re-enable button
    analyzeBtn.disabled = false;
    analyzeBtn.textContent = originalText;
    analyzeBtn.style.cursor = 'pointer';
  }
});

// Big O curve generator
function generateBigOCurve(type, nValues) {
  switch (type) {
    case 'O(1)':       return nValues.map(() => 1);
    case 'O(log n)':   return nValues.map(n => Math.log2(n));
    case 'O(n)':       return [...nValues];
    case 'O(n log n)': return nValues.map(n => n * Math.log2(n));
    case 'O(n^2)':     return nValues.map(n => n * n);
    case 'O(2^n)':     return nValues.map(n => Math.pow(2, n));
    default:           return [...nValues];
  }
}

// Chart rendering
function updateCharts(analysis) {
  const nValues = Array.from({ length: 20 }, (_, i) => i + 1);
  const timeCtx = document.getElementById('timeComplexityChart').getContext('2d');
  const spaceCtx = document.getElementById('spaceComplexityChart').getContext('2d');

  if (timeComplexityChart) timeComplexityChart.destroy();
  if (spaceComplexityChart) spaceComplexityChart.destroy();

  // Time Complexity Chart
  timeComplexityChart = new Chart(timeCtx, {
    type: 'line',
    data: {
      labels: nValues,
      datasets: [
        {
          label: `Best (${analysis.time_complexity.best_case})`,
          data: generateBigOCurve(analysis.time_complexity.best_case, nValues),
          tension: 0.3
        },
        {
          label: `Avg (${analysis.time_complexity.average_case})`,
          data: generateBigOCurve(analysis.time_complexity.average_case, nValues),
          tension: 0.3
        },
        {
          label: `Worst (${analysis.time_complexity.worst_case})`,
          data: generateBigOCurve(analysis.time_complexity.worst_case, nValues),
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            font: { size: 16 }
          }
        }
      },
      plugins: {
        title: { display: true, text: 'Time Complexity (Big O)' }
      }
    }
  });

  // Space Complexity Chart
  spaceComplexityChart = new Chart(spaceCtx, {
    type: 'line',
    data: {
      labels: nValues,
      datasets: [
        {
          label: `Space (${analysis.space_complexity})`,
          data: generateBigOCurve(analysis.space_complexity, nValues),
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            font: { size: 16 }
          }
        }
      },
      plugins: {
        title: { display: true, text: 'Space Complexity (Big O)' }
      }
    }
  });
}
