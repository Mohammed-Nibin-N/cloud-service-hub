import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import gyLogo from '../assets/GY Logo.png';

interface RequestItem {
  id: number;
  requestId: string;
  projectName: string;
  awsAccountNumber: string;
  environment: string;
  accessTarget: string;
  notificationEmails: string;
  justification: string;
  filePath: string | null;
  status: string;
  createdAt: string;
  awsConsoleUrl: string | null;
  iamUsername: string | null;
  region: string | null;
  provisioningMessage: string | null;
  temporaryPassword: string | null;
  awsConsoleSigninUrl: string | null;
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  pending: { label: 'Pending Approval', bg: 'bg-amber-500/10 border-amber-500/30', text: 'text-amber-400' },
  approved: { label: 'Approved', bg: 'bg-green-500/10 border-green-500/30', text: 'text-green-400' },
  rejected: { label: 'Rejected', bg: 'bg-red-500/10 border-red-500/30', text: 'text-red-400' },
  provisioning: { label: 'Provisioning', bg: 'bg-blue-500/10 border-blue-500/30', text: 'text-blue-400' },
  completed: { label: 'Completed', bg: 'bg-green-500/10 border-green-500/30', text: 'text-green-400' },
  failed: { label: 'Failed', bg: 'bg-red-500/10 border-red-500/30', text: 'text-red-400' },
};

function StatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max) + '...';
}

function DetailModal({ request, onClose }: { request: RequestItem; onClose: () => void }) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-2xl max-h-[85vh] bg-navy-800 border border-navy-700/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-navy-700/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent-400/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Request Details</h2>
              <p className="text-xs text-slate-400 font-mono">{request.requestId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-navy-700/50 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-8 py-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <DetailField label="Request ID" value={request.requestId} mono />
            <DetailField label="Status">
              <StatusBadge status={request.status} />
            </DetailField>
            <DetailField label="AWS Account" value={request.awsAccountNumber} mono />
            <DetailField label="Environment" value={request.environment} />
            <DetailField label="Access Target" value={request.accessTarget} mono />
            <DetailField label="Notification Emails" value={request.notificationEmails} />
            <DetailField label="Created At" value={formatDate(request.createdAt)} />
          </div>

          {request.filePath && (
            <DetailField label="Requested File Path" value={request.filePath} mono fullWidth />
          )}

          <DetailField label="Business Justification" value={request.justification} fullWidth />

          {/* Provisioning Details — shown when completed */}
          {(request.status === 'completed' || request.status === 'provisioning') && (
            <div className="mt-4 pt-5 border-t border-navy-700/30">
              <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Provisioning Details
              </h3>
              {request.status === 'provisioning' ? (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                  <svg className="w-5 h-5 animate-spin text-blue-400" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="text-sm text-blue-300">Provisioning in progress...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <DetailField label="IAM Username" value={request.iamUsername || '—'} mono />
                  <DetailField label="Temporary Password (must be changed at first login)" value={request.temporaryPassword || '—'} mono />
                  <DetailField label="AWS Console Sign-In URL">
                    {request.awsConsoleSigninUrl ? (
                      <a
                        href={request.awsConsoleSigninUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-accent-400 hover:underline break-all"
                      >
                        {request.awsConsoleSigninUrl}
                      </a>
                    ) : (
                      <span className="text-sm text-slate-500">—</span>
                    )}
                  </DetailField>
                  <DetailField label="Bucket Name" value={request.accessTarget} mono />
                  <DetailField label="AWS Console URL">
                    {request.awsConsoleUrl ? (
                      <a
                        href={request.awsConsoleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-accent-400 hover:underline break-all"
                      >
                        {request.awsConsoleUrl}
                      </a>
                    ) : (
                      <span className="text-sm text-slate-500">—</span>
                    )}
                  </DetailField>
                  <DetailField label="Region" value={request.region || '—'} />
                  <DetailField label="Provisioning Message" value={request.provisioningMessage || '—'} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailField({
  label,
  value,
  mono,
  fullWidth,
  children,
}: {
  label: string;
  value?: string;
  mono?: boolean;
  fullWidth?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className={fullWidth ? 'col-span-full' : ''}>
      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1.5">{label}</p>
      {children ? (
        children
      ) : (
        <p className={`text-sm text-white whitespace-pre-wrap break-words ${mono ? 'font-mono' : ''}`}>
          {value || '—'}
        </p>
      )}
    </div>
  );
}

function AdminDashboardPage() {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<RequestItem | null>(null);
  const autoRefreshRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchRequests = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3001/api/requests');
      if (!response.ok) throw new Error('Failed to fetch requests');
      const data = await response.json();
      setRequests(data.requests);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Auto-refresh when any request is in provisioning state
  useEffect(() => {
    const hasProvisioning = requests.some((r) => r.status === 'provisioning');

    if (hasProvisioning) {
      autoRefreshRef.current = setInterval(() => {
        fetchRequests();
      }, 3000);
    } else if (autoRefreshRef.current) {
      clearInterval(autoRefreshRef.current);
      autoRefreshRef.current = null;
    }

    return () => {
      if (autoRefreshRef.current) {
        clearInterval(autoRefreshRef.current);
      }
    };
  }, [requests, fetchRequests]);

  // Keep modal data in sync with refreshed requests
  useEffect(() => {
    if (selectedRequest) {
      const updated = requests.find((r) => r.requestId === selectedRequest.requestId);
      if (updated && updated.status !== selectedRequest.status) {
        setSelectedRequest(updated);
      }
    }
  }, [requests, selectedRequest]);

  const handleStatusUpdate = async (requestId: string, newStatus: string) => {
    setActionLoading(requestId);
    try {
      const response = await fetch(`http://localhost:3001/api/requests/${requestId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error('Failed to update status');
      await fetchRequests();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update request');
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-navy-900">
      {/* Navigation Bar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-navy-800/80 backdrop-blur-sm border-b border-navy-700/50">
        <div className="flex items-center gap-5">
          <img
            src={gyLogo}
            alt="Goodyear"
            className="h-[42px] w-auto object-contain transition-transform duration-200 hover:scale-105"
          />
          <div className="h-6 w-px bg-navy-700/70" />
          <span className="text-lg font-semibold text-white">Cloud Service Hub</span>
        </div>
        <Link
          to="/"
          className="flex items-center gap-2 text-sm text-slate-300 hover:text-accent-400 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Hub
        </Link>
      </nav>

      {/* Page Content */}
      <section className="px-6 py-12 max-w-7xl mx-auto animate-fade-in-up">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Admin Dashboard
            </h1>
            <p className="text-lg text-slate-300">
              Review and manage access requests
            </p>
            <div className="mt-3 h-1 w-16 bg-accent-400 rounded-full" />
          </div>
          <div className="flex items-center gap-3">
            {requests.some((r) => r.status === 'provisioning') && (
              <span className="flex items-center gap-1.5 text-xs text-blue-400">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                Auto-refreshing
              </span>
            )}
            <span className="text-sm text-slate-400">{requests.length} request{requests.length !== 1 ? 's' : ''}</span>
            <button
              onClick={() => { setLoading(true); fetchRequests(); }}
              className="p-2 rounded-lg bg-navy-800 border border-navy-700/50 hover:border-accent-400/30 transition-colors"
              aria-label="Refresh"
            >
              <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <svg className="w-8 h-8 animate-spin text-accent-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-navy-800 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-slate-400 text-lg">No requests yet</p>
            <p className="text-slate-500 text-sm mt-1">Requests will appear here once submitted</p>
          </div>
        ) : (
          <div className="bg-navy-800 border border-navy-700/50 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-navy-700/50">
                    <th className="text-left px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Request ID</th>
                    <th className="text-left px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">AWS Account</th>
                    <th className="text-left px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Environment</th>
                    <th className="text-left px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Access Target</th>
                    <th className="text-left px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Justification</th>
                    <th className="text-left px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="text-left px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Created</th>
                    <th className="text-left px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-700/30">
                  {requests.map((req) => (
                    <tr key={req.requestId} className="hover:bg-navy-700/20 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-sm font-mono text-accent-400">{req.requestId}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-mono text-white">{req.awsAccountNumber}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-300">{req.environment}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-mono text-slate-300">{req.accessTarget}</span>
                      </td>
                      <td className="px-6 py-4 max-w-[200px]">
                        <span className="text-sm text-slate-400" title={req.justification}>
                          {truncate(req.justification, 80)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={req.status} />
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-400">{formatDate(req.createdAt)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedRequest(req)}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-navy-700/50 border border-navy-700/50 text-slate-300 hover:border-accent-400/30 hover:text-accent-400 transition-colors"
                          >
                            View Details
                          </button>
                          {req.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleStatusUpdate(req.requestId, 'approved')}
                                disabled={actionLoading === req.requestId}
                                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 transition-colors disabled:opacity-50"
                              >
                                {actionLoading === req.requestId ? '...' : 'Approve'}
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(req.requestId, 'rejected')}
                                disabled={actionLoading === req.requestId}
                                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                              >
                                {actionLoading === req.requestId ? '...' : 'Reject'}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* Detail Modal */}
      {selectedRequest && (
        <DetailModal request={selectedRequest} onClose={() => setSelectedRequest(null)} />
      )}
    </div>
  );
}

export default AdminDashboardPage;
