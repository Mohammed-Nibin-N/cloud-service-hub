import { Link } from 'react-router-dom';
import gyLogo from '../assets/GY Logo.png';

function DataUploadAccessPage() {
  return (
    <div className="min-h-screen bg-navy-900">
      {/* Navigation Bar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-navy-800/80 backdrop-blur-sm border-b border-navy-700/50">
        <div className="flex items-center gap-5">
          {/* Goodyear Logo */}
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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Hub
        </Link>
      </nav>

      {/* Page Content */}
      <section className="px-6 py-16 max-w-4xl mx-auto animate-fade-in-up">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Data Upload Access Request
          </h1>
          <p className="text-lg text-slate-300">
            Configure upload access and processing requirements
          </p>
          <div className="mt-4 h-1 w-16 bg-accent-400 rounded-full" />
        </div>

        {/* Placeholder form area */}
        <div className="bg-navy-800 border border-navy-700/50 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-accent-400/10 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-accent-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white">
              Request Secure Access for File Uploads
            </h2>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Submit a request to gain secure file upload access across cloud environments.
            Your request will be reviewed and processed by the cloud operations team.
          </p>
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <svg className="w-4 h-4 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Form functionality coming in a future release</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default DataUploadAccessPage;
