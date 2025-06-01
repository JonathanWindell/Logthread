import React from 'react';

const Exporting = ({ data }) => {
  const exportToCSV = () => {
    if (!data || data.length === 0) {
      alert('No data to export');
      return;
    }

    const csvContent = [
      ["Log ID", "Level", "Message", "Timestamp"],
      ...data.map(log => [
        log.log_id, 
        log.level, 
        log.message,
        log.timestamp
      ])
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "logs_export.csv";
    link.click();
  };

  return (
    <button onClick={exportToCSV} className="export-button">
      Export to CSV
    </button>
  );
};

export default Exporting;