/**
 * CSV PARSER UTILITY
 * 
 * Handles parsing and validation of CSV files using the data schemas.
 * Requires: papaparse library (npm install papaparse)
 */

import { validateObject, transformCSVRow, Schemas } from '../models/dataSchemas.js';

/**
 * Parse a CSV file and validate against a schema
 * 
 * @param {File|string} csvFile - File object or CSV string
 * @param {string} dataType - Type of data ('staff', 'table', 'menuItem', etc.)
 * @returns {Promise<{data: Array, errors: Array, warnings: Array}>}
 */
export async function parseCSV(csvFile, dataType) {
  // Dynamic import of papaparse (in case it's not installed yet)
  let Papa;
  try {
    Papa = (await import('papaparse')).default;
  } catch (error) {
    throw new Error('papaparse library is required. Install with: npm install papaparse');
  }

  const schema = Schemas[dataType];
  if (!schema) {
    throw new Error(`Unknown data type: ${dataType}. Available types: ${Object.keys(Schemas).join(', ')}`);
  }

  return new Promise((resolve, reject) => {
    const config = {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => {
        // Normalize header names (handle spaces, case variations)
        return header.trim().toLowerCase().replace(/\s+/g, '');
      },
      complete: (results) => {
        const data = [];
        const errors = [];
        const warnings = [];

        // Check for parse errors
        if (results.errors && results.errors.length > 0) {
          results.errors.forEach(error => {
            errors.push(`Row ${error.row}: ${error.message}`);
          });
        }

        // Validate and transform each row
        results.data.forEach((row, index) => {
          // Skip completely empty rows
          if (Object.keys(row).every(key => !row[key] || row[key].trim() === '')) {
            return;
          }

          try {
            // Transform CSV row to match schema
            const transformed = transformCSVRow(row, schema);
            
            // Validate the transformed object
            const validation = validateObject(transformed, schema);
            
            if (validation.valid) {
              data.push(transformed);
              if (validation.warnings.length > 0) {
                warnings.push(`Row ${index + 2}: ${validation.warnings.join(', ')}`);
              }
            } else {
              errors.push(`Row ${index + 2}: ${validation.errors.join(', ')}`);
            }
          } catch (error) {
            errors.push(`Row ${index + 2}: ${error.message}`);
          }
        });

        resolve({
          data,
          errors,
          warnings,
          totalRows: results.data.length,
          validRows: data.length,
          invalidRows: errors.length
        });
      },
      error: (error) => {
        reject(new Error(`CSV parsing failed: ${error.message}`));
      }
    };

    // Handle File object or string
    if (csvFile instanceof File) {
      Papa.parse(csvFile, config);
    } else if (typeof csvFile === 'string') {
      Papa.parse(csvFile, config);
    } else {
      reject(new Error('Invalid CSV input. Expected File object or string.'));
    }
  });
}

/**
 * Parse multiple CSV files (for scenario import)
 * 
 * @param {Object} csvFiles - Object mapping data types to CSV files
 * @returns {Promise<Object>} Parsed and validated data for each type
 */
export async function parseMultipleCSVs(csvFiles) {
  const results = {};
  const allErrors = [];
  const allWarnings = [];

  for (const [dataType, file] of Object.entries(csvFiles)) {
    if (!file) continue;

    try {
      const result = await parseCSV(file, dataType);
      results[dataType] = result.data;
      allErrors.push(...result.errors.map(err => `[${dataType}] ${err}`));
      allWarnings.push(...result.warnings.map(warn => `[${dataType}] ${warn}`));
    } catch (error) {
      allErrors.push(`[${dataType}] ${error.message}`);
    }
  }

  return {
    data: results,
    errors: allErrors,
    warnings: allWarnings
  };
}

/**
 * Convert data array to CSV string
 * 
 * @param {Array} data - Array of objects
 * @param {Array} columns - Optional array of column names (uses all keys if not provided)
 * @returns {string} CSV string
 */
export async function arrayToCSV(data, columns = null) {
  let Papa;
  try {
    Papa = (await import('papaparse')).default;
  } catch (error) {
    throw new Error('papaparse library is required. Install with: npm install papaparse');
  }

  if (!data || data.length === 0) {
    return '';
  }

  // Determine columns
  const cols = columns || Object.keys(data[0]);

  return Papa.unparse(data, {
    columns: cols,
    header: true
  });
}

/**
 * Download data as CSV file
 * 
 * @param {Array} data - Data to export
 * @param {string} filename - Filename for download
 * @param {Array} columns - Optional column order
 */
export async function downloadCSV(data, filename, columns = null) {
  const csv = await arrayToCSV(data, columns);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}
