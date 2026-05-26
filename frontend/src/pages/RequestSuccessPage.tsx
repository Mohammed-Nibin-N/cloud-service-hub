import { Link, useLocation } from 'react-router-dom';
import gyLogo from '../assets/GY Logo.png';

interface RequestState {
  projectName: string;
  awsAccount: string;
  environment: string;
  bucketName: string;
}

function RequestSuccessPage() {
  const location = useLocation();
  const state = location.state as RequestState | null;

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
      </nav>

      {/* Success Content */}
      <section className="px-6 py-16 max-w-3xl mx-auto animate-fade-in-up">
        {/* Success Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center">
            <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-3">
          Request Submitted Successfully
        </h1>
        <p className="text-lg text-slate-300 text-center mb-10">
          Your secure upload access request has been received
        </p>

        {/* Request Summary Card */}
        <div className="bg-navy-800 border border-navy-700/50 rounded-2xl p-8 mb-8">
          {/* Request ID */}
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-navy-700/30">
            <div className="w-10 h-10 rounded-xl bg-accent-400/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">Request ID</p>
              <p className="text-lg font-semibold text-accent-400">CSH-1001</p>
            </div>
          </div>

          {/* Request Details */}
          <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">
            Request Summary
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-slate-400">Project</span>
              <span className="text-sm font-medium text-white">{state?.projectName || '—'}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-t border-navy-700/20">
              <span className="text-sm text-slate-400">AWS Account Number</span>
              <span className="text-sm font-mono text-white">{state?.awsAccount || '—'}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-t border-navy-700/20">
              <span className="text-sm text-slate-400">Environment</span>
              <span className="text-sm font-medium text-white">{state?.environment || '—'}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-t border-navy-700/20">
              <span className="text-sm text-slate-400">Bucket Name</span>
              <span className="text-sm font-mono text-white">{state?.bucketName || '—'}</span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-navy-800/60 border border-navy-700/30 rounded-2xl p-8 mb-8">
          <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-5">
            Next Steps
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-accent-400/10 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-bold text-accent-400">1</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">Request captured</p>
                <p className="text-xs text-slate-500 mt-0.5">Your request has been logged in the system</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-accent-400/10 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-bold text-accent-400">2</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">Approval workflow will be triggered</p>
                <p className="text-xs text-slate-500 mt-0.5">Relevant approvers will be notified</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-accent-400/10 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-bold text-accent-400">3</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">Configuration process will begin</p>
                <p className="text-xs text-slate-500 mt-0.5">Access and configuration will be completed after approval</p>
              </div>
            </div>
          </div>
        </div>

        {/* Keep these handy */}
        <div className="bg-navy-800/60 border border-navy-700/30 rounded-2xl p-8 mb-8">
          <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-1">
            Keep these handy
          </h3>
          <p className="text-xs text-slate-500 mb-6">Helpful resources and next actions</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* AWS Portal */}
            <a
              href="#"
              className="group flex flex-col items-center gap-3 p-5 rounded-xl bg-navy-900/40 border border-navy-700/30 hover:border-accent-400/30 hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-xl bg-accent-400/10 flex items-center justify-center group-hover:bg-accent-400/20 transition-colors">
                <svg className="w-5 h-5 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-white">AWS Portal</p>
                <p className="text-xs text-slate-500 mt-0.5">Access the AWS console</p>
              </div>
            </a>
            {/* User Guide */}
            <a
              href="#"
              className="group flex flex-col items-center gap-3 p-5 rounded-xl bg-navy-900/40 border border-navy-700/30 hover:border-accent-400/30 hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-xl bg-accent-400/10 flex items-center justify-center group-hover:bg-accent-400/20 transition-colors">
                <svg className="w-5 h-5 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-white">User Guide</p>
                <p className="text-xs text-slate-500 mt-0.5">Step-by-step setup instructions</p>
              </div>
            </a>
            {/* Video Walkthrough */}
            <a
              href="#"
              className="group flex flex-col items-center gap-3 p-5 rounded-xl bg-navy-900/40 border border-navy-700/30 hover:border-accent-400/30 hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-xl bg-accent-400/10 flex items-center justify-center group-hover:bg-accent-400/20 transition-colors">
                <svg className="w-5 h-5 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-white">Video Walkthrough</p>
                <p className="text-xs text-slate-500 mt-0.5">Watch the setup process</p>
              </div>
            </a>
          </div>
        </div>

        {/* Return Button */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-accent-400 hover:bg-accent-500 text-navy-900 font-semibold text-sm rounded-xl transition-colors duration-200 shadow-lg shadow-accent-400/20"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Return to Home
          </Link>
        </div>
      </section>
    </div>
  );
}

export default RequestSuccessPage;
