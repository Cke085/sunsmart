import Papa from 'papaparse'

/**
 * Load and parse a CSV file.
 * NOTE: In this project the CSVs live under src/data,
 * so we point the URL there for now.
 * @param {string} filename - e.g. 'melbourne_daily_max_uv.csv'
 * @returns {Promise<Array>} parsed rows as array of objects
 */
export const parseCSV = (filename) =>
  new Promise((resolve, reject) => {
    Papa.parse(`/src/data/${filename}`, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data),
      error: (err) => reject(err),
    })
  })
