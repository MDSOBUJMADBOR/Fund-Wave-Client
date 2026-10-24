"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ShieldAlert,
  Ban,
  Trash2,
  CheckCircle2,
  Search,
  User,
  ExternalLink,
  Calendar,
  Loader2,
  RotateCw,
  PlusCircle,
  Flag,
} from "lucide-react";

interface Report {
  _id: string;
  campaign_id: string;
  campaign_title: string;
  reporter_name: string;
  reporter_email?: string;
  reason: string;
  status: "pending" | "resolved" | "dismissed" | string;
  resolvedAction?: string;
  date?: string;
  createdAt?: string;
}

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // New report modal state for testing/demo
  const [showNewReportModal, setShowNewReportModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newReporter, setNewReporter] = useState("");
  const [newReason, setNewReason] = useState("");
  const [submittingReport, setSubmittingReport] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // ==========================================
  // FETCH REPORTS
  // ==========================================
  useEffect(() => {
    let ignore = false;

    async function fetchReports() {
      try {
        setLoading(true);

        const res = await fetch(`${API_BASE}/reports`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to load campaign reports");
        }

        const json = await res.json();
        const dataList: Report[] = Array.isArray(json)
          ? json
          : Array.isArray(json?.data)
          ? json.data
          : [];

        if (!ignore) {
          setReports(dataList);
          setLoading(false);
        }
      } catch (err: unknown) {
        console.error("Admin fetch reports error:", err);
        if (!ignore) {
          setReports([]);
          setLoading(false);
        }
      }
    }

    fetchReports();

    return () => {
      ignore = true;
    };
  }, [refreshTrigger, API_BASE]);

  // ==========================================
  // SUSPEND REPORTED CAMPAIGN
  // ==========================================
  const handleSuspendCampaign = async (report: Report) => {
    const confirmSuspend = window.confirm(
      `Suspend campaign "${report.campaign_title}"?\n\nThis will take the campaign offline and mark its status as "suspended".`
    );

    if (!confirmSuspend) return;

    try {
      setActionLoadingId(`suspend-${report._id}`);

      // Call suspend endpoint
      const res = await fetch(`${API_BASE}/campaigns/suspend/${report.campaign_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok && res.status !== 404) {
        throw new Error(data.message || "Failed to suspend campaign");
      }

      // Update report status locally
      setReports((prev) =>
        prev.map((r) =>
          r._id === report._id
            ? { ...r, status: "resolved", resolvedAction: "suspended" }
            : r
        )
      );

      alert(`Campaign "${report.campaign_title}" has been suspended.`);
    } catch (err: unknown) {
      console.error("Suspend error:", err);
      alert(err instanceof Error ? err.message : "Failed to suspend campaign");
    } finally {
      setActionLoadingId(null);
    }
  };

  // ==========================================
  // DELETE REPORTED CAMPAIGN
  // ==========================================
  const handleDeleteCampaign = async (report: Report) => {
    const confirmDelete = window.confirm(
      `PERMANENTLY DELETE campaign "${report.campaign_title}" from database?\n\nThis action cannot be undone.`
    );

    if (!confirmDelete) return;

    try {
      setActionLoadingId(`delete-${report._id}`);

      // Delete from campaigns collection
      const res = await fetch(`${API_BASE}/campaigns/${report.campaign_id}`, {
        method: "DELETE",
      });

      if (!res.ok && res.status !== 404) {
        throw new Error("Failed to delete campaign from database");
      }

      // Update report status
      setReports((prev) =>
        prev.map((r) =>
          r._id === report._id
            ? { ...r, status: "resolved", resolvedAction: "deleted" }
            : r
        )
      );

      alert(`Campaign "${report.campaign_title}" has been deleted from the database.`);
    } catch (err: unknown) {
      console.error("Delete campaign error:", err);
      alert(err instanceof Error ? err.message : "Failed to delete campaign");
    } finally {
      setActionLoadingId(null);
    }
  };

  // ==========================================
  // DISMISS / REMOVE REPORT
  // ==========================================
  const handleDismissReport = async (reportId: string) => {
    try {
      setActionLoadingId(`dismiss-${reportId}`);

      const res = await fetch(`${API_BASE}/reports/${reportId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to dismiss report");
      }

      setReports((prev) => prev.filter((r) => r._id !== reportId));
    } catch (err: unknown) {
      console.error("Dismiss report error:", err);
      alert(err instanceof Error ? err.message : "Failed to dismiss report");
    } finally {
      setActionLoadingId(null);
    }
  };

  // ==========================================
  // SUBMIT TEST REPORT
  // ==========================================
  const handleSubmitNewReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newReason.trim()) return;

    try {
      setSubmittingReport(true);

      const res = await fetch(`${API_BASE}/reports`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaign_title: newTitle.trim(),
          reporter_name: newReporter.trim() || "Anonymous Supporter",
          reason: newReason.trim(),
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to submit report");
      }

      if (json.data) {
        setReports((prev) => [json.data, ...prev]);
      }

      setShowNewReportModal(false);
      setNewTitle("");
      setNewReporter("");
      setNewReason("");
      alert("New suspicious campaign report logged successfully!");
    } catch (err: unknown) {
      console.error("Create report error:", err);
      alert(err instanceof Error ? err.message : "Failed to log report");
    } finally {
      setSubmittingReport(false);
    }
  };

  // Filtered reports
  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const term = searchTerm.toLowerCase();
      const title = (r.campaign_title || "").toLowerCase();
      const reporter = (r.reporter_name || "").toLowerCase();
      const reason = (r.reason || "").toLowerCase();

      return title.includes(term) || reporter.includes(term) || reason.includes(term);
    });
  }, [reports, searchTerm]);

  const pendingReportsCount = useMemo(() => {
    return reports.filter((r) => (r.status || "pending").toLowerCase() === "pending").length;
  }, [reports]);

  return (
    <div className="space-y-8 pb-12">
      {/* ==================================================== */}
      {/* HEADER BANNER */}
      {/* ==================================================== */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-950 via-red-900 to-amber-900 p-6 md:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-md border border-white/15">
              <ShieldAlert className="h-3.5 w-3.5 text-rose-300" />
              Trust & Safety Moderation
            </div>
            <h1 className="mt-3 text-2xl md:text-3xl font-extrabold tracking-tight">
              Fraud & Suspicious Reports
            </h1>
            <p className="mt-1 text-sm md:text-base text-rose-100 max-w-xl">
              Campaigns flagged by Supporters for review. Investigate suspicious claims and suspend or delete verified fraudulent campaigns.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowNewReportModal(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-rose-900 shadow-md transition hover:bg-rose-50 active:scale-95"
            >
              <PlusCircle className="h-4 w-4" />
              File New Incident
            </button>
            <button
              onClick={() => {
                setLoading(true);
                setRefreshTrigger((k) => k + 1);
              }}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-xs font-semibold text-white border border-white/20 hover:bg-white/20 transition active:scale-95"
            >
              <RotateCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>

        <div className="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-12 -left-12 h-44 w-44 rounded-full bg-black/20 blur-2xl" />
      </div>

      {/* ==================================================== */}
      {/* KPI METRIC CARDS */}
      {/* ==================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Pending Incident Reports
              </p>
              <h3 className="mt-2 text-3xl font-extrabold text-rose-600">
                {loading ? <Loader2 className="h-7 w-7 animate-spin text-rose-600" /> : pendingReportsCount}
              </h3>
              <p className="mt-1 text-xs text-gray-400">Flagged campaigns awaiting action</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-100">
              <Flag className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Total Flagged Inquiries
              </p>
              <h3 className="mt-2 text-3xl font-extrabold text-gray-900">
                {loading ? <Loader2 className="h-7 w-7 animate-spin text-gray-400" /> : reports.length}
              </h3>
              <p className="mt-1 text-xs text-gray-400">Historical supporter flags</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-100">
              <AlertTriangle className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Resolved Action Count
              </p>
              <h3 className="mt-2 text-3xl font-extrabold text-emerald-600">
                {loading ? (
                  <Loader2 className="h-7 w-7 animate-spin text-emerald-600" />
                ) : (
                  reports.filter((r) => r.status === "resolved").length
                )}
              </h3>
              <p className="mt-1 text-xs text-gray-400">Suspended or deleted campaigns</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* REPORTS TABLE */}
      {/* ==================================================== */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900">Reported Campaigns Table</h2>
              <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-800">
                {filteredReports.length} Reports
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Review supporter claims, reasons, and take appropriate action by suspending or deleting flagged campaigns.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search campaign, reporter..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-9 pr-3 py-2 text-xs text-gray-800 outline-none focus:bg-white focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition"
            />
          </div>
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="flex min-h-[220px] flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-rose-600" />
            <p className="text-sm text-gray-500 font-medium">Checking security reports...</p>
          </div>
        ) : filteredReports.length === 0 ? (
          /* EMPTY STATE */
          <div className="flex min-h-[200px] flex-col items-center justify-center py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-3 border border-emerald-100">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Platform Trust Score Normal</h3>
            <p className="mt-1 text-sm text-gray-500 max-w-sm">
              No active fraud or suspicious campaign reports match your criteria.
            </p>
          </div>
        ) : (
          /* TABULAR FORMAT */
          <div className="overflow-x-auto mt-4">
            <table className="w-full min-w-[850px] text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70 text-xs font-bold uppercase tracking-wider text-gray-500">
                  <th className="py-3.5 px-4 rounded-l-xl">Campaign Title</th>
                  <th className="py-3.5 px-4">Reporter Name</th>
                  <th className="py-3.5 px-4">Report Reason</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 rounded-r-xl text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredReports.map((report) => {
                  const isSuspending = actionLoadingId === `suspend-${report._id}`;
                  const isDeleting = actionLoadingId === `delete-${report._id}`;
                  const isDismissing = actionLoadingId === `dismiss-${report._id}`;
                  const isResolved = report.status === "resolved";

                  const dateFormatted = report.date || report.createdAt
                    ? new Date(report.date || report.createdAt || "").toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Recent";

                  return (
                    <tr key={report._id} className="hover:bg-rose-50/20 transition-colors">
                      {/* Campaign Title */}
                      <td className="py-4 px-4 font-semibold text-gray-900">
                        <span className="block max-w-[220px] truncate font-bold text-gray-900" title={report.campaign_title}>
                          {report.campaign_title}
                        </span>
                        {report.campaign_id && !report.campaign_id.startsWith("seed_") && (
                          <Link
                            href={`/campaigns/${report.campaign_id}`}
                            target="_blank"
                            className="text-xs text-rose-600 hover:underline inline-flex items-center gap-1 font-normal"
                          >
                            Inspect campaign <ExternalLink className="h-3 w-3" />
                          </Link>
                        )}
                      </td>

                      {/* Reporter's Name */}
                      <td className="py-4 px-4 text-gray-800">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-500 text-xs font-bold">
                            <User className="h-3.5 w-3.5" />
                          </div>
                          <div>
                            <span className="font-semibold block text-gray-900">
                              {report.reporter_name}
                            </span>
                            {report.reporter_email && (
                              <span className="text-[11px] text-gray-400">
                                {report.reporter_email}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Reason */}
                      <td className="py-4 px-4 max-w-xs">
                        <div className="rounded-xl bg-gray-50 p-2.5 text-xs text-gray-700 border border-gray-100">
                          {report.reason}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 text-xs text-gray-500 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-gray-400" />
                          <span>{dateFormatted}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        {isResolved ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800 capitalize">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                            {report.resolvedAction || "Resolved"}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-800">
                            <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
                            Active Flag
                          </span>
                        )}
                      </td>

                      {/* Actions: Suspend or Delete Campaign */}
                      <td className="py-4 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          {/* Suspend Campaign Button */}
                          <button
                            onClick={() => handleSuspendCampaign(report)}
                            disabled={isSuspending || isDeleting || isDismissing}
                            className="inline-flex items-center gap-1 rounded-xl bg-amber-500 hover:bg-amber-600 px-3 py-1.5 text-xs font-bold text-gray-950 shadow-sm active:scale-95 transition disabled:opacity-50"
                            title="Take campaign offline"
                          >
                            {isSuspending ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Ban className="h-3.5 w-3.5" />
                            )}
                            Suspend
                          </button>

                          {/* Delete Campaign Button */}
                          <button
                            onClick={() => handleDeleteCampaign(report)}
                            disabled={isSuspending || isDeleting || isDismissing}
                            className="inline-flex items-center gap-1 rounded-xl bg-rose-600 hover:bg-rose-700 px-3 py-1.5 text-xs font-bold text-white shadow-sm active:scale-95 transition disabled:opacity-50"
                            title="Delete campaign permanently"
                          >
                            {isDeleting ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="h-3.5 w-3.5" />
                            )}
                            Delete
                          </button>

                          {/* Dismiss Button */}
                          <button
                            onClick={() => handleDismissReport(report._id)}
                            disabled={isSuspending || isDeleting || isDismissing}
                            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
                            title="Dismiss report"
                          >
                            ✕
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ==================================================== */}
      {/* MODAL: SUBMIT SUSPICIOUS CAMPAIGN REPORT */}
      {/* ==================================================== */}
      {showNewReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Log Fraud Report</h3>
              </div>
              <button
                onClick={() => setShowNewReportModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitNewReport} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Campaign Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI Miracle Device"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Reporter Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Concerned Supporter"
                  value={newReporter}
                  onChange={(e) => setNewReporter(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Reason for Suspicion / Fraud Claim
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe evidence of fraud, misleading claims, or stolen photos..."
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewReportModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReport}
                  className="rounded-xl bg-rose-600 hover:bg-rose-700 px-5 py-2 text-xs font-bold text-white shadow-md transition disabled:opacity-50"
                >
                  {submittingReport ? "Submitting..." : "Submit Report"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}