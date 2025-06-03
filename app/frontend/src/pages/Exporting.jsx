import React from 'react';

const Exporting = ({ data }) => {
  const exportToFile = async (format) => {
    if (!data || data.length === 0) {
      alert('No data to export');
      return;
    }

    try {
      let content, mimeType, extension;
      
      if (format === 'csv') {
        content = [
          ["Log ID", "Level", "Message", "Timestamp"],
          ...data.map(log => [log.log_id, log.level, log.message, log.timestamp])
        ].map(e => e.join(",")).join("\n");
        mimeType = 'text/csv';
        extension = 'csv';
      } else { 
        content = JSON.stringify(data, null, 2);
        mimeType = 'application/json';
        extension = 'json';
      }

      try {
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
      console.error('Export failed:', error);
      alert('Export failed: ' + error.message);
    }
  };

  return (
    <div className="export-options">
      <button onClick={() => exportToFile('csv')} className="export-button">
        Export as CSV
      </button>
      <button onClick={() => exportToFile('json')} className="export-button">
        Export as JSON
      </button>
    </div>
  );
};

export default Exporting;