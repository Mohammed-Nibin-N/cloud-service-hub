import { Link } from 'react-router-dom';
import gyLogo from '../assets/GY Logo.png';

function HomePage() {
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
        {/* Search icon */}
        <button
          className="p-2 rounded-lg hover:bg-navy-700/50 transition-colors"
          aria-label="Search"
        >
          <svg
            className="w-5 h-5 text-slate-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-16 max-w-6xl mx-auto animate-fade-in-up">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Cloud Service Hub
        </h1>
        <p className="text-lg md:text-xl text-slate-300 max-w-2xl">
          Request secure access and manage cloud services
        </p>
        <div className="mt-4 h-1 w-20 bg-accent-400 rounded-full" />
      </section>

      {/* Service Cards Grid */}
      <section className="px-6 pb-16 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up-delay">
          {/* Card 1: Data Upload Access */}
          <div className="group relative bg-navy-800 border border-navy-700/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/10 hover:-translate-y-1 hover:border-accent-400/30">
            <div className="flex items-center gap-3 mb-4">
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
              <div className="h-6 px-2 rounded-full bg-accent-400/10 flex items-center">
                <span className="text-xs font-medium text-accent-400">Available</span>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Request Secure Access for File Uploads
            </h3>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              Request access for secure file upload functionality across cloud environments
            </p>
            <Link
              to="/secure-upload-request"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-400 hover:bg-accent-500 text-navy-900 font-semibold text-sm rounded-lg transition-colors duration-200"
            >
              Request Access
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>

          {/* Card 2: Coming Soon */}
          <div className="relative bg-navy-800/60 border border-navy-700/30 rounded-2xl p-6 opacity-70">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-slate-600/20 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-slate-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <div className="h-6 px-2 rounded-full bg-slate-600/20 flex items-center">
                <span className="text-xs font-medium text-slate-500">Coming Soon</span>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-slate-400 mb-2">
              Coming Soon
            </h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Additional cloud services will be added here
            </p>
            <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-700/50 text-slate-500 font-semibold text-sm rounded-lg cursor-not-allowed">
              Coming Soon
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
