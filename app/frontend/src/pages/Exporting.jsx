import React from 'react';

/**
 * Exporting
 *
 * Renders export controls that allow the user to download the current log dataset
 * as either a CSV or JSON file. Supports two download strategies depending on
 * browser capability.
 *
 * The component performs the following steps:
 * 1. Receives the log dataset as a prop from the parent (Dashboard).
 * 2. On button click, validates that data exists before attempting an export.
 * 3. Formats the data into the selected format (CSV or JSON).
 * 4. Attempts to save the file using the modern File System Access API.
 * 5. Falls back to a programmatic anchor-tag download if the API is unavailable
 *    or the user cancels the save dialog.
 * 6. Catches and surfaces any unexpected export errors via a browser alert.
 *
 * Props:
 *   data {Array} - List of log objects to export. Each object is expected to
 *                  contain log_id, level, message, and timestamp fields.
 *
 * Returns:
 *   JSX.Element - A div containing an "Export as CSV" and an "Export as JSON" button.
 */
const Exporting = ({ data }) => {

  /**
   * exportToFile
   *
   * Handles the full export lifecycle for a given file format.
   *
   * Steps:
   * 1. Guards against empty or missing data by alerting the user and returning early.
   * 2. Builds the file content string based on the requested format:
   *    - CSV: constructs a header row followed by one comma-separated row per log entry.
   *    - JSON: serialises the full data array with 2-space indentation via JSON.stringify.
   * 3. Sets the appropriate MIME type and file extension for the chosen format.
   * 4. Attempts to open the browser's native Save File dialog via window.showSaveFilePicker.
   * 5. Writes the formatted content to the chosen file handle and closes the writable stream.
   * 6. If showSaveFilePicker is unsupported or the user dismisses the dialog (AbortError),
   *    falls back to creating a Blob URL and triggering a download via a hidden <a> element.
   * 7. Catches any outer errors (formatting failures, etc.) and alerts the user.
   *
   * Args:
   *   format {string} - The target export format. Accepted values: 'csv' | 'json'.
   *
   * Returns:
   *   Promise<void>
   */
  const exportToFile = async (format) => {

    // Guard — abort early if there is no data available to export.
    if (!data || data.length === 0) {
      alert('No data to export');
      return;
    }

    try {
      let content, mimeType, extension;

      // Format the data into the requested export type.
      if (format === 'csv') {
        // Build a CSV string: first row is the header, subsequent rows are log entries.
        content = [
          ["Log ID", "Level", "Message", "Timestamp"],
          ...data.map(log => [log.log_id, log.level, log.message, log.timestamp])
        ].map(e => e.join(",")).join("\n");
        mimeType = 'text/csv';
        extension = 'csv';
      } else {
        // Serialise the full log array as pretty-printed JSON (2-space indent).
        content = JSON.stringify(data, null, 2);
        mimeType = 'application/json';
        extension = 'json';
      }

      try {
        /*
         * Primary strategy — File System Access API.
         * Opens the browser's native Save File dialog, allowing the user to choose
         * the save location. Writes the content to the selected file handle.
         * Only available in modern Chromium-based browsers.
         */
        const fileHandle = await window.showSaveFilePicker({
          suggestedName: `logs_export.${extension}`,
          types: [{
            description: `${format.toUpperCase()} Files`,
            accept: { [mimeType]: [`.${extension}`] }
          }]
        });
        const writable = await fileHandle.createWritable();
        await writable.write(content);
        await writable.close();

      } catch (err) {
        /*
         * Fallback strategy — Blob URL download.
         * Triggered when showSaveFilePicker is unsupported by the browser,
         * or when the user cancels the Save dialog (err.name === 'AbortError').
         * A cancel is not treated as an error — the fallback is skipped in that case.
         * For all other errors, creates a temporary Blob URL and triggers a download
         * via a programmatically clicked hidden anchor element.
         */
        if (err.name !== 'AbortError') {
          const blob = new Blob([content], { type: mimeType });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `logs_export.${extension}`;
          link.click();
        }
      }

    } catch (error) {
      // Catch-all for unexpected failures (e.g. formatting errors) — alert the user.
      console.error('Export failed:', error);
      alert('Export failed: ' + error.message);
    }
  };

  /* ── Main render ───────────────────────────────────────────────────────── */

  return (
    <div className="export-options">
      {/* CSV export button — triggers exportToFile with 'csv' format */}
      <button onClick={() => exportToFile('csv')} className="export-button">
        Export as CSV
      </button>

      {/* JSON export button — triggers exportToFile with 'json' format */}
      <button onClick={() => exportToFile('json')} className="export-button">
        Export as JSON
      </button>
    </div>
  );
};

export default Exporting;