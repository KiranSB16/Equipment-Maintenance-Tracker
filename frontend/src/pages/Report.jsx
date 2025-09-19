import { useState } from "react";
import { useSelector } from "react-redux";
import api from "../config/axios";

export default function ReportsPage() {
  const { user, token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState({
    equipment: false,
    workOrders: false,
    technician: false,
  });
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    status: "",
    startDate: "",
    endDate: "",
  });

  const downloadPDF = async (endpoint, filename, queryParams = {}) => {
    try {
      setError(null);

      const queryString = new URLSearchParams(queryParams).toString();
      const url = queryString ? `${endpoint}?${queryString}` : endpoint;

      const response = await api.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      });

      // Create blob URL and trigger download
      const blob = new Blob([response.data], { type: "application/pdf" });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${filename}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error("PDF download error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to generate report. Please try again."
      );
    }
  };

  const handleEquipmentReport = async () => {
    setLoading((prev) => ({ ...prev, equipment: true }));
    await downloadPDF("/reports/equipment-status", "Equipment-Status-Report");
    setLoading((prev) => ({ ...prev, equipment: false }));
  };

  const handleWorkOrderReport = async () => {
    setLoading((prev) => ({ ...prev, workOrders: true }));

    // Filter out empty values
    const queryParams = {};
    if (filters.status) queryParams.status = filters.status;
    if (filters.startDate) queryParams.startDate = filters.startDate;
    if (filters.endDate) queryParams.endDate = filters.endDate;

    await downloadPDF(
      "/reports/work-orders",
      "Work-Orders-Summary",
      queryParams
    );
    setLoading((prev) => ({ ...prev, workOrders: false }));
  };

  const handleTechnicianReport = async () => {
    setLoading((prev) => ({ ...prev, technician: true }));
    await downloadPDF(
      "/reports/technician-workload",
      "Technician-Workload-Report"
    );
    setLoading((prev) => ({ ...prev, technician: false }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: "",
      startDate: "",
      endDate: "",
    });
  };

  const hasPermission =
    user && (user.role === "Supervisor" || user.role === "Manager");

  if (!hasPermission) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          <h4>Access Denied</h4>
          <p>
            You don't have permission to access reports. Only Supervisors and
            Managers can generate reports.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">
            <i className="bi bi-file-text me-2"></i>
            Download Reports
          </h2>

          {error && (
            <div
              className="alert alert-danger alert-dismissible fade show"
              role="alert"
            >
              {error}
              <button
                type="button"
                className="btn-close"
                onClick={() => setError(null)}
              ></button>
            </div>
          )}

          <div className="row g-4">
            {/* Equipment Status Report */}
            <div className="col-lg-4 col-md-6">
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column">
                  <div className="mb-3">
                    <i className="bi bi-gear-fill text-primary fs-1"></i>
                  </div>
                  <h5 className="card-title">Equipment Status Report</h5>
                  <p className="card-text flex-grow-1">
                    Generate a comprehensive report of all equipment with their
                    current status, type, and last maintenance dates.
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={handleEquipmentReport}
                    disabled={loading.equipment}
                  >
                    {loading.equipment ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        ></span>
                        Generating...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-download me-2"></i>
                        Download PDF
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Work Orders Report */}
            <div className="col-lg-4 col-md-6">
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column">
                  <div className="mb-3">
                    <i className="bi bi-list-task text-success fs-1"></i>
                  </div>
                  <h5 className="card-title">Work Orders Summary</h5>
                  <p className="card-text flex-grow-1">
                    Generate work order reports with optional filtering by
                    status and date range.
                  </p>

                  {/* Filters */}
                  <div className="mb-3">
                    <div className="row g-2">
                      <div className="col-12">
                        <select
                          className="form-select form-select-sm"
                          name="status"
                          value={filters.status}
                          onChange={handleFilterChange}
                        >
                          <option value="">All Statuses</option>
                          <option value="Open">Open</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </div>
                      <div className="col-6">
                        <input
                          type="date"
                          className="form-control form-control-sm"
                          name="startDate"
                          value={filters.startDate}
                          onChange={handleFilterChange}
                          placeholder="Start Date"
                        />
                      </div>
                      <div className="col-6">
                        <input
                          type="date"
                          className="form-control form-control-sm"
                          name="endDate"
                          value={filters.endDate}
                          onChange={handleFilterChange}
                          placeholder="End Date"
                        />
                      </div>
                    </div>
                    {(filters.status ||
                      filters.startDate ||
                      filters.endDate) && (
                      <button
                        className="btn btn-sm btn-outline-secondary mt-2"
                        onClick={clearFilters}
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>

                  <button
                    className="btn btn-success"
                    onClick={handleWorkOrderReport}
                    disabled={loading.workOrders}
                  >
                    {loading.workOrders ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        ></span>
                        Generating...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-download me-2"></i>
                        Download PDF
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Technician Workload Report */}
            <div className="col-lg-4 col-md-6">
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column">
                  <div className="mb-3">
                    <i className="bi bi-people-fill text-info fs-1"></i>
                  </div>
                  <h5 className="card-title">Technician Workload</h5>
                  <p className="card-text flex-grow-1">
                    View current workload distribution across all technicians,
                    showing open work orders assigned to each.
                  </p>
                  <button
                    className="btn btn-info"
                    onClick={handleTechnicianReport}
                    disabled={loading.technician}
                  >
                    {loading.technician ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        ></span>
                        Generating...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-download me-2"></i>
                        Download PDF
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
