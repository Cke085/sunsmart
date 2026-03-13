/* ============================================================
   main.js — Melbourne UV & Skin Cancer Dashboard Logic
   
   Libraries used:
     - PapaParse : parse CSV files in the browser
     - Chart.js  : draw all charts
   ============================================================ */

// ---- Global Chart.js default theme (dark background) ----
Chart.defaults.color = '#8b949e';
Chart.defaults.borderColor = '#21262d';
Chart.defaults.font.family = "'Courier New', monospace";


/* ============================================================
   SECTION 1 — CSV file paths
   Change these if you rename your CSV files.
   ============================================================ */
const UV_CSV     = 'melbourne_daily_max_uv.csv';
const CANCER_CSV = 'skin_cancer_victoria.csv';


/* ============================================================
   SECTION 2 — Utility helpers
   ============================================================ */

/**
 * Round a number to 2 decimal places.
 * @param {number} n
 * @returns {number}
 */
const round2 = n => Math.round(n * 100) / 100;

/**
 * Calculate the average of an array of numbers.
 * @param {number[]} arr
 * @returns {number}
 */
const avg = arr => arr.length ? arr.reduce((s, v) => s + v, 0) / arr.length : 0;

/**
 * Map a value from [min,max] to a CSS rgba orange color.
 * Used to colour heatmap cells.
 * @param {number} value  - the UV value for this cell
 * @param {number} min    - minimum UV in the dataset
 * @param {number} max    - maximum UV in the dataset
 * @returns {string} CSS color string
 */
function uvToColor(value, min, max) {
  const t = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const r = Math.round(30  + t * (247 - 30));   // red channel
  const g = Math.round(20  + t * (100 - 20));   // green channel (stays low)
  const b = Math.round(60  + t * (10  - 60));   // blue channel (decreases)
  return `rgba(${r},${g},${b},0.85)`;
}

/**
 * Create a standard Chart.js options object for line charts.
 * @param {string} yLabel - label for the Y axis
 * @returns {object} Chart.js options
 */
function lineOptions(yLabel) {
  return {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#161b22',
        borderColor: '#30363d',
        borderWidth: 1,
        titleColor: '#e6edf3',
        bodyColor: '#8b949e',
      }
    },
    scales: {
      x: { grid: { color: '#21262d' } },
      y: {
        grid: { color: '#21262d' },
        title: { display: true, text: yLabel, color: '#8b949e' }
      }
    }
  };
}


/* ============================================================
   SECTION 3 — Load both CSV files using PapaParse,
               then hand data to chart-drawing functions.
   ============================================================ */
async function loadData() {
  // Show a simple loading message in the browser console
  console.log('Loading CSV files...');

  /**
   * Wrap PapaParse in a Promise so we can use async/await.
   * PapaParse normally uses callbacks; this converts it to a promise.
   */
  const parseCSV = (url) =>
    new Promise((resolve, reject) => {
      Papa.parse(url, {
        download: true,          // fetch the file from the server
        header: true,            // use the first row as column names
        skipEmptyLines: true,    // ignore blank rows
        complete: (results) => resolve(results.data),
        error:    (err)     => reject(err),
      });
    });

  try {
    // Load both files in parallel for speed
    const [uvRaw, cancerRaw] = await Promise.all([
      parseCSV(UV_CSV),
      parseCSV(CANCER_CSV),
    ]);

    console.log(`UV rows loaded: ${uvRaw.length}`);
    console.log(`Cancer rows loaded: ${cancerRaw.length}`);

    // DEBUG: print exact column names from cancer CSV
    if (cancerRaw.length > 0) {
      console.log('=== Cancer columns ===', JSON.stringify(Object.keys(cancerRaw[0])));
      console.log('=== Cancer row 0 ===', JSON.stringify(cancerRaw[0]));
      console.log('=== Cancer row 1 ===', JSON.stringify(cancerRaw[1]));
    }

    // Hand data off to each chart-drawing function
    buildHeaderStats(uvRaw, cancerRaw);
    buildUvTrendChart(uvRaw);
    buildUvHeatmap(uvRaw);
    buildCancerTrendCharts(cancerRaw);
    buildRateCompareChart(cancerRaw);
    buildUvHighDaysChart(uvRaw);

  } catch (err) {
    console.error('Failed to load CSV:', err);
    alert('Could not load data files. Make sure the CSV files are in the same folder as index.html.');
  }
}


/* ============================================================
   SECTION 4 — Header quick-stat pills
   ============================================================ */
function buildHeaderStats(uvRaw, cancerRaw) {
  // Calculate overall average UV across all days
  const allUV   = uvRaw.map(r => parseFloat(r['UV_Index'])).filter(v => !isNaN(v));
  const avgUV   = round2(avg(allUV));

  // Count total melanoma cases (Persons only)
  const melanoma = cancerRaw.filter(r =>
    r['Cancer group/site']?.includes('Melanoma') &&
    r['Sex']?.trim() === 'Persons'
  );
  const totalMelanoma = melanoma.reduce((s, r) => s + (parseInt((r['Count'] || '').replace(/,/g, '')) || 0), 0);

  // Inject HTML into the header stats container
  document.getElementById('headerStats').innerHTML = `
    <div class="stat-pill">
      <span class="val">${avgUV}</span>
      <span class="lbl">Avg Max UV</span>
    </div>
    <div class="stat-pill">
      <span class="val">${allUV.length.toLocaleString()}</span>
      <span class="lbl">UV Days Recorded</span>
    </div>
    <div class="stat-pill">
      <span class="val">${totalMelanoma.toLocaleString()}</span>
      <span class="lbl">Total Melanoma Cases</span>
    </div>
  `;
}


/* ============================================================
   SECTION 5 — Chart 1: Annual average UV trend line
   ============================================================ */
function buildUvTrendChart(uvRaw) {
  // Group rows by year and compute the average UV for each year
  const byYear = {};
  uvRaw.forEach(row => {
    const year = row['Year']?.trim();
    const uv   = parseFloat(row['UV_Index']);
    if (!year || isNaN(uv)) return;
    if (!byYear[year]) byYear[year] = [];
    byYear[year].push(uv);
  });

  // Sort years and compute averages
  const years  = Object.keys(byYear).sort();
  const values = years.map(y => round2(avg(byYear[y])));

  // Draw the line chart on the <canvas id="uvTrendChart">
  new Chart(document.getElementById('uvTrendChart'), {
    type: 'line',
    data: {
      labels: years,
      datasets: [{
        label: 'Avg Max UV',
        data: values,
        borderColor: '#f7931e',
        backgroundColor: 'rgba(247,147,30,0.12)',
        tension: 0.35,           // smooth curves
        fill: true,
        pointBackgroundColor: '#f7931e',
        pointRadius: 4,
        pointHoverRadius: 6,
      }]
    },
    options: lineOptions('Average Max UV Index')
  });
}


/* ============================================================
   SECTION 6 — Chart 2: Monthly UV heatmap (HTML table)
   ============================================================ */
function buildUvHeatmap(uvRaw) {
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  // DEBUG: print the actual column names from the first row so we can verify
  if (uvRaw.length > 0) console.log('UV columns:', Object.keys(uvRaw[0]));

  // Build a lookup: data[year][month] = [uv values...]
  const data = {};
  uvRaw.forEach(row => {
    // Trim all keys in this row to handle any hidden spaces in column names
    const cleanRow = {};
    Object.keys(row).forEach(k => { cleanRow[k.trim()] = row[k]; });

    const year = cleanRow['Year']?.trim();
    const date = cleanRow['Date']?.trim();
    const uv   = parseFloat(cleanRow['UV_Index']);

    // Skip rows with missing or invalid data
    if (!year || !date || isNaN(uv)) return;

    // Support both "YYYY/M/D" and "YYYY-M-D" date formats
    const parts = date.split(/[\/\-]/);
    if (parts.length < 3) return;
    const month = parseInt(parts[1]) - 1;  // 0-indexed (0=Jan)
    if (isNaN(month) || month < 0 || month > 11) return;

    // Initialise the year bucket if it doesn't exist yet
    if (!data[year]) data[year] = Array.from({length: 12}, () => []);

    // Safety check: make sure the month slot is actually an array before pushing
    if (!Array.isArray(data[year][month])) data[year][month] = [];
    data[year][month].push(uv);
  });

  const years = Object.keys(data).sort();

  // Compute all averages to find global min/max for color scaling
  const allAvgs = [];
  years.forEach(y =>
    data[y].forEach(monthArr => {
      if (monthArr.length) allAvgs.push(avg(monthArr));
    })
  );
  const minUV = Math.min(...allAvgs);
  const maxUV = Math.max(...allAvgs);

  // Build the HTML table string
  let html = '<table><thead><tr><th>Year</th>';
  MONTHS.forEach(m => { html += `<th>${m}</th>`; });
  html += '</tr></thead><tbody>';

  years.forEach(year => {
    html += `<tr><th>${year}</th>`;
    data[year].forEach((monthArr, i) => {
      if (monthArr.length === 0) {
        html += '<td>—</td>';
      } else {
        const val   = round2(avg(monthArr));
        const color = uvToColor(val, minUV, maxUV);
        // title attribute shows the value on hover
        html += `<td class="hm-cell" style="background:${color}" title="${MONTHS[i]} ${year}: UV ${val}">${val}</td>`;
      }
    });
    html += '</tr>';
  });

  html += '</tbody></table>';
  document.getElementById('uvHeatmap').innerHTML = html;
}


/* ============================================================
   SECTION 7 — Charts 3 & 4: Cancer case trends by sex
   ============================================================ */
function buildCancerTrendCharts(cancerRaw) {
  /**
   * Helper: filter cancer data for one cancer type,
   * group by year and sex, return Chart.js datasets.
   */
  function buildDatasets(cancerType) {
    const rows = cancerRaw.filter(r =>
      r['Cancer group/site']?.trim() === cancerType &&
      r['State or Territory']?.trim() === 'Victoria'
    );

    // Collect all years, sorted
    const years = [...new Set(rows.map(r => r['Year']?.trim()))].sort();

    // Helper to extract count series for one sex label
    const series = (sexLabel) =>
      years.map(y => {
        const match = rows.find(r => r['Year']?.trim() === y && r['Sex']?.trim() === sexLabel);
        return match ? (parseInt((match['Count'] || '').replace(/,/g, '')) || 0) : null;
      });

    return {
      years,
      datasets: [
        {
          label: 'Male',
          data: series('Males'),
          borderColor: '#58a6ff',
          backgroundColor: 'rgba(88,166,255,0.08)',
          tension: 0.3, fill: false, pointRadius: 3,
        },
        {
          label: 'Female',
          data: series('Females'),
          borderColor: '#f78166',
          backgroundColor: 'rgba(247,129,102,0.08)',
          tension: 0.3, fill: false, pointRadius: 3,
        },
        {
          label: 'Persons',
          data: series('Persons'),
          borderColor: '#56d364',
          backgroundColor: 'rgba(86,211,100,0.08)',
          tension: 0.3, fill: false, pointRadius: 3,
        }
      ]
    };
  }

  // Draw the Melanoma chart
  const melData = buildDatasets('Melanoma of the skin');
  new Chart(document.getElementById('melanomaTrendChart'), {
    type: 'line',
    data: { labels: melData.years, datasets: melData.datasets },
    options: {
      ...lineOptions('Case Count'),
      plugins: {
        ...lineOptions('').plugins,
        legend: {
          display: true,
          labels: { color: '#8b949e', usePointStyle: true, pointStyleWidth: 10 }
        }
      }
    }
  });

  // Draw the Non-melanoma chart
  const nonMelData = buildDatasets('Non-melanoma skin cancer (rare types)');
  new Chart(document.getElementById('nonmelanomaTrendChart'), {
    type: 'line',
    data: { labels: nonMelData.years, datasets: nonMelData.datasets },
    options: {
      ...lineOptions('Case Count'),
      plugins: {
        ...lineOptions('').plugins,
        legend: {
          display: true,
          labels: { color: '#8b949e', usePointStyle: true, pointStyleWidth: 10 }
        }
      }
    }
  });
}


/* ============================================================
   SECTION 8 — Chart 5: Age-standardised rate comparison bar chart
   ============================================================ */
function buildRateCompareChart(cancerRaw) {
  // Only use "Persons" rows for Victoria
  const rows = cancerRaw.filter(r =>
    r['Sex']?.trim() === 'Persons' &&
    r['State or Territory']?.trim() === 'Victoria'
  );

  // Collect all years, sorted
  const years = [...new Set(rows.map(r => r['Year']?.trim()))].sort();

  // The two rate column names (trim whitespace from headers just in case)
  // Find the actual column names dynamically (they may contain newlines or extra spaces)
  // This is robust against formatting differences in the CSV header
  const allKeys = Object.keys(cancerRaw[0] || {});
  const COL_2001 = allKeys.find(k => k.includes('2001')) || '';
  const COL_2023 = allKeys.find(k => k.includes('2023')) || '';
  console.log('Rate columns found:', COL_2001, '|', COL_2023);

  // Filter to only Melanoma rows (cleaner comparison)
  const melRows = rows.filter(r => r['Cancer group/site']?.trim() === 'Melanoma of the skin');

  const rates2001 = years.map(y => {
    const r = melRows.find(row => row['Year']?.trim() === y);
    return r ? (parseFloat(r[COL_2001]) || null) : null;
  });

  const rates2023 = years.map(y => {
    const r = melRows.find(row => row['Year']?.trim() === y);
    return r ? (parseFloat(r[COL_2023]) || null) : null;
  });

  new Chart(document.getElementById('rateCompareChart'), {
    type: 'bar',
    data: {
      labels: years,
      datasets: [
        {
          label: '2001 ASP Standard',
          data: rates2001,
          backgroundColor: 'rgba(88,166,255,0.7)',
          borderColor: '#58a6ff',
          borderWidth: 1,
          borderRadius: 3,
        },
        {
          label: '2023 AUS Population Standard',
          data: rates2023,
          backgroundColor: 'rgba(247,147,30,0.7)',
          borderColor: '#f7931e',
          borderWidth: 1,
          borderRadius: 3,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true,
          labels: { color: '#8b949e', usePointStyle: true }
        },
        tooltip: {
          backgroundColor: '#161b22',
          borderColor: '#30363d',
          borderWidth: 1,
        }
      },
      scales: {
        x: { grid: { color: '#21262d' } },
        y: {
          grid: { color: '#21262d' },
          title: { display: true, text: 'Rate per 100,000', color: '#8b949e' }
        }
      }
    }
  });
}


/* ============================================================
   SECTION 9 — Chart 6: Number of high UV days per year (UV >= 6)
   ============================================================ */
function buildUvHighDaysChart(uvRaw) {
  // Count how many days each year had UV >= 6 ("High" category on UV index scale)
  const byYear = {};
  uvRaw.forEach(row => {
    const year = row['Year']?.trim();
    const uv   = parseFloat(row['UV_Index']);
    if (!year || isNaN(uv)) return;
    if (!byYear[year]) byYear[year] = 0;
    if (uv >= 6) byYear[year]++;
  });

  const years  = Object.keys(byYear).sort();
  const counts = years.map(y => byYear[y]);

  new Chart(document.getElementById('uvHighDaysChart'), {
    type: 'bar',
    data: {
      labels: years,
      datasets: [{
        label: 'Days with UV ≥ 6',
        data: counts,
        backgroundColor: counts.map(v =>
          // Colour bars by intensity: more high-UV days = deeper orange/red
          v > 200 ? 'rgba(224,92,92,0.8)' :
          v > 150 ? 'rgba(247,147,30,0.8)' :
                    'rgba(247,200,80,0.7)'
        ),
        borderRadius: 4,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#161b22',
          borderColor: '#30363d',
          borderWidth: 1,
          callbacks: {
            // Add context to the tooltip
            label: ctx => ` ${ctx.parsed.y} days with UV ≥ 6`
          }
        }
      },
      scales: {
        x: { grid: { color: '#21262d' } },
        y: {
          grid: { color: '#21262d' },
          title: { display: true, text: 'Number of Days', color: '#8b949e' }
        }
      }
    }
  });
}


/* ============================================================
   SECTION 10 — Entry point: run everything when page loads
   ============================================================ */
window.addEventListener('DOMContentLoaded', () => {
  loadData();
});
