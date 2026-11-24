// @ts-check
const fs = require('fs');
const path = require('path');

/**
 * Splits one CSV line into fields, honoring double-quoted fields that may
 * contain commas or escaped quotes (`""`). Minimal on purpose — no
 * multi-line quoted fields — since the bulk merchant data this framework
 * reads is a flat, simple table.
 * @param {string} line
 */
function splitCsvLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result.map((value) => value.trim());
}

/** @param {string} content */
function parseCsv(content) {
  const lines = content.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length === 0) return [];
  const headers = splitCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const values = splitCsvLine(line);
    /** @type {Record<string, string>} */
    const record = {};
    headers.forEach((header, i) => {
      record[header] = values[i] ?? '';
    });
    return record;
  });
}

/**
 * Reads an array of flat merchant records from a `.json`, `.csv`, or
 * `.xlsx` file, picked by file extension. `.xlsx` needs the `xlsx` package
 * installed separately (`npm install xlsx`) — it's intentionally not a
 * hard dependency of this framework, since it carries known high-severity
 * advisories with no npm-registry fix (see README's npm audit section);
 * only add it if you actually need Excel input.
 * @param {string} filePath Absolute path to the data file.
 * @returns {Array<Record<string, string>>}
 */
function readBulkMerchantRecords(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.json') {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  }

  if (ext === '.csv') {
    const raw = fs.readFileSync(filePath, 'utf8');
    return parseCsv(raw);
  }

  if (ext === '.xlsx') {
    let xlsx;
    try {
      // eslint-disable-next-line import/no-extraneous-dependencies
      xlsx = require('xlsx');
    } catch {
      throw new Error(
        `Reading "${filePath}" needs the "xlsx" package, which isn't installed in this project. ` +
          'Run `npm install xlsx` first (note: xlsx has known high-severity advisories with no ' +
          'npm-registry fix — see the README\'s npm audit section before adding it).'
      );
    }
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    return xlsx.utils.sheet_to_json(sheet, { defval: '' });
  }

  throw new Error(`Unsupported bulk data file extension "${ext}" — use .json, .csv, or .xlsx.`);
}

module.exports = { readBulkMerchantRecords, parseCsv };
