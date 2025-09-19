// services/reportsService.js
import api from "../config/axios";

export const reportsService = {
  // Equipment Status Report
  async downloadEquipmentReport() {
    const response = await api.get("/reports/equipment-status", {
      responseType: "blob",
    });
    return this.downloadFile(response.data, "Equipment-Status-Report.pdf");
  },

  // Work Orders Report with filters
  async downloadWorkOrderReport(filters = {}) {
    const params = new URLSearchParams();

    if (filters.status) params.append("status", filters.status);
    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);

    const response = await api.get(`/reports/work-orders?${params}`, {
      responseType: "blob",
    });
    return this.downloadFile(response.data, "Work-Orders-Summary.pdf");
  },

  // Technician Workload Report
  async downloadTechnicianReport() {
    const response = await api.get("/reports/technician-workload", {
      responseType: "blob",
    });
    return this.downloadFile(response.data, "Technician-Workload-Report.pdf");
  },

  downloadFile(blob, filename) {
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};

export default reportsService;
