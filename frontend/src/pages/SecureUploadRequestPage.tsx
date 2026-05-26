import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gyLogo from '../assets/GY Logo.png';

const PROJECTS = [
  'Dealer Analytics',
  'Sales Portal',
  'GoodyearCare',
  'Warranty Platform',
] as const;

const AWS_ACCOUNT_MAP: Record<string, string> = {
  'Dealer Analytics': '123456789012',
  'Sales Portal': '234567890123',
  'GoodyearCare': '345678901234',
  'Warranty Platform': '456789012345',
};

const BUCKET_MAP: Record<string, string[]> = {
  'Dealer Analytics': ['dealer-dev-data', 'dealer-prod-data'],
  'Sales Portal': ['sales-dev-data', 'sales-prod-data'],
  'GoodyearCare': ['gycare-dev-files', 'gycare-prod-files'],
  'Warranty Platform': ['warranty-dev-files', 'warranty-prod-files'],
};

const ENVIRONMENTS = ['DEV', 'QA', 'PROD'] as const;

interface FormErrors {
  projectName?: string;
  environment?: string;
  bucketName?: string;
  justification?: string;
  notificationEmails?: string;
}

function SecureUploadRequestPage() {
  const navigate = useNavigate();

  const [projectName, setProjectName] = useState('');
  const [environment, setEnvironment] = useState('');
  const [bucketName, setBucketName] = useState('');
  const [filePath, setFilePath] = useState('');
  const [justification, setJustification] = useState('');
  const [notificationEmails, setNotificationEmails] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const awsAccount = useMemo(() => {
    return projectName ? AWS_ACCOUNT_MAP[projectName] || '' : '';
  }, [projectName]);

  const availableBuckets = useMemo(() => {
    return projectName ? BUCKET_MAP[projectName] || [] : [];
  }, [projectName]);

  const handleProjectChange = (value: string) => {
    setProjectName(value);
    setBucketName('');
    setTouched((prev) => ({ ...prev, projectName: true }));
  };

  const validateGoodyearEmail = (email: string): boolean => {
    return /^[^\s@]+@goodyear\.com$/i.test(email.trim());
  };

  const validateAllEmails = (input: string): { valid: boolean; message?: string } => {
    if (!input.trim()) return { valid: false, message: 'Notification Emails is required' };
    const emails = input.split(',').map((e) => e.trim()).filter((e) => e !== '');
    if (emails.length === 0) return { valid: false, message: 'Notification Emails is required' };
    const invalid = emails.filter((e) => !validateGoodyearEmail(e));
    if (invalid.length > 0) {
      return { valid: false, message: 'Please enter valid Goodyear email addresses' };
    }
    return { valid: true };
  };

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!projectName) newErrors.projectName = 'Project Name is required';
    if (!environment) newErrors.environment = 'Environment is required';
    if (!bucketName) newErrors.bucketName = 'S3 Bucket Name is required';
    if (!justification.trim()) newErrors.justification = 'Business Justification is required';
    const emailValidation = validateAllEmails(notificationEmails);
    if (!emailValidation.valid) {
      newErrors.notificationEmails = emailValidation.message;
    }
    return newErrors;
  };

  const isFormValid = useMemo(() => {
    return (
      projectName !== '' &&
      environment !== '' &&
      bucketName !== '' &&
      justification.trim() !== '' &&
      validateAllEmails(notificationEmails).valid
    );
  }, [projectName, environment, bucketName, justification, notificationEmails]);

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    setTouched({
      projectName: true,
      environment: true,
      bucketName: true,
      justification: true,
      notificationEmails: true,
    });

    if (Object.keys(validationErrors).length === 0) {
      navigate('/request-success', {
        state: {
          projectName,
          awsAccount,
          environment,
          bucketName,
        },
      });
    }
  };

  const fieldClass = (field: keyof FormErrors) =>
    `w-full px-4 py-3 rounded-xl bg-navy-900/60 border ${
      touched[field] && errors[field]
        ? 'border-red-500 focus:ring-red-500/30'
        : 'border-navy-700/50 focus:ring-accent-400/30'
    } text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-200`;

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
      <section className="px-6 py-12 max-w-3xl mx-auto animate-fade-in-up">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Secure Upload Access Request
          </h1>
          <p className="text-lg text-slate-300">
            Complete the form below to request secure file upload access
          </p>
          <div className="mt-4 h-1 w-16 bg-accent-400 rounded-full" />
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="bg-navy-800 border border-navy-700/50 rounded-2xl p-8 space-y-6">
            {/* Project Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Project Name <span className="text-accent-400">*</span>
              </label>
              <select
                value={projectName}
                onChange={(e) => handleProjectChange(e.target.value)}
                onBlur={() => handleBlur('projectName')}
                className={fieldClass('projectName')}
              >
                <option value="" className="bg-navy-900">Select a project</option>
                {PROJECTS.map((p) => (
                  <option key={p} value={p} className="bg-navy-900">{p}</option>
                ))}
              </select>
              {touched.projectName && errors.projectName && (
                <p className="mt-1.5 text-sm text-red-400">{errors.projectName}</p>
              )}
            </div>

            {/* AWS Account Number */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                AWS Account Number <span className="text-accent-400">*</span>
              </label>
              <input
                type="text"
                value={awsAccount}
                readOnly
                className="w-full px-4 py-3 rounded-xl bg-navy-900/30 border border-navy-700/30 text-slate-400 cursor-not-allowed"
                placeholder="Auto-populated based on project"
              />
            </div>

            {/* Environment */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Environment <span className="text-accent-400">*</span>
              </label>
              <select
                value={environment}
                onChange={(e) => setEnvironment(e.target.value)}
                onBlur={() => handleBlur('environment')}
                className={fieldClass('environment')}
              >
                <option value="" className="bg-navy-900">Select environment</option>
                {ENVIRONMENTS.map((env) => (
                  <option key={env} value={env} className="bg-navy-900">{env}</option>
                ))}
              </select>
              {touched.environment && errors.environment && (
                <p className="mt-1.5 text-sm text-red-400">{errors.environment}</p>
              )}
            </div>

            {/* S3 Bucket Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                S3 Bucket Name <span className="text-accent-400">*</span>
              </label>
              <select
                value={bucketName}
                onChange={(e) => setBucketName(e.target.value)}
                onBlur={() => handleBlur('bucketName')}
                disabled={!projectName}
                className={`${fieldClass('bucketName')} ${!projectName ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <option value="" className="bg-navy-900">
                  {projectName ? 'Select a bucket' : 'Select a project first'}
                </option>
                {availableBuckets.map((b) => (
                  <option key={b} value={b} className="bg-navy-900">{b}</option>
                ))}
              </select>
              {touched.bucketName && errors.bucketName && (
                <p className="mt-1.5 text-sm text-red-400">{errors.bucketName}</p>
              )}
            </div>

            {/* File Path / Prefix */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                File Path / Prefix <span className="text-slate-500 text-xs">(Optional)</span>
              </label>
              <input
                type="text"
                value={filePath}
                onChange={(e) => setFilePath(e.target.value)}
                placeholder="e.g., uploads/2024/"
                className="w-full px-4 py-3 rounded-xl bg-navy-900/60 border border-navy-700/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-400/30 transition-all duration-200"
              />
            </div>

            {/* Business Justification */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Business Justification <span className="text-accent-400">*</span>
              </label>
              <textarea
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                onBlur={() => handleBlur('justification')}
                rows={4}
                placeholder="Describe why you need this access..."
                className={fieldClass('justification')}
              />
              {touched.justification && errors.justification && (
                <p className="mt-1.5 text-sm text-red-400">{errors.justification}</p>
              )}
            </div>

            {/* Notification Emails */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Notification Emails <span className="text-accent-400">*</span>
              </label>
              <p className="text-xs text-slate-500 mb-2">Receive request updates and status notifications</p>
              <input
                type="text"
                value={notificationEmails}
                onChange={(e) => setNotificationEmails(e.target.value)}
                onBlur={() => handleBlur('notificationEmails')}
                placeholder="john.doe@goodyear.com, team@goodyear.com"
                className={fieldClass('notificationEmails')}
              />
              {touched.notificationEmails && errors.notificationEmails && (
                <p className="mt-1.5 text-sm text-red-400">{errors.notificationEmails}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={!isFormValid}
                className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  isFormValid
                    ? 'bg-accent-400 hover:bg-accent-500 text-navy-900 cursor-pointer shadow-lg shadow-accent-400/20'
                    : 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
                }`}
              >
                Submit Request
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}

export default SecureUploadRequestPage;
