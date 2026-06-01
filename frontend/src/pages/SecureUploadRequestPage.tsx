import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gyLogo from '../assets/GY Logo.png';

interface AwsAccount {
  accountName: string;
  accountNumber: string;
  environment: string;
  buckets: string[];
}

interface FormErrors {
  awsAccount?: string;
  bucketName?: string;
  justification?: string;
  notificationEmails?: string;
}

function SecureUploadRequestPage() {
  const navigate = useNavigate();

  const [awsAccounts, setAwsAccounts] = useState<AwsAccount[]>([]);
  const [selectedAccountName, setSelectedAccountName] = useState('');
  const [bucketName, setBucketName] = useState('');
  const [filePath, setFilePath] = useState('');
  const [justification, setJustification] = useState('');
  const [notificationEmails, setNotificationEmails] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Fetch AWS accounts from backend config
  useEffect(() => {
    fetch('http://localhost:3001/api/aws-accounts')
      .then((res) => res.json())
      .then((data) => setAwsAccounts(data.accounts || []))
      .catch(() => setSubmitError('Failed to load AWS accounts configuration'));
  }, []);

  const selectedAccount = useMemo(() => {
    return awsAccounts.find((a) => a.accountName === selectedAccountName) || null;
  }, [awsAccounts, selectedAccountName]);

  const availableBuckets = useMemo(() => {
    return selectedAccount?.buckets || [];
  }, [selectedAccount]);

  const handleAccountChange = (value: string) => {
    setSelectedAccountName(value);
    setBucketName('');
    setTouched((prev) => ({ ...prev, awsAccount: true }));
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
    if (!selectedAccountName) newErrors.awsAccount = 'AWS Account is required';
    if (!bucketName) newErrors.bucketName = 'S3 Bucket is required';
    if (!justification.trim()) newErrors.justification = 'Business Justification is required';
    const emailValidation = validateAllEmails(notificationEmails);
    if (!emailValidation.valid) {
      newErrors.notificationEmails = emailValidation.message;
    }
    return newErrors;
  };

  const isFormValid = useMemo(() => {
    return (
      selectedAccountName !== '' &&
      bucketName !== '' &&
      justification.trim() !== '' &&
      validateAllEmails(notificationEmails).valid
    );
  }, [selectedAccountName, bucketName, justification, notificationEmails]);

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    setSubmitError('');
    setTouched({
      awsAccount: true,
      bucketName: true,
      justification: true,
      notificationEmails: true,
    });

    if (Object.keys(validationErrors).length === 0 && selectedAccount) {
      setIsSubmitting(true);
      try {
        const emails = notificationEmails.split(',').map((e) => e.trim()).filter((e) => e !== '');
        const response = await fetch('http://localhost:3001/api/requests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            accountName: selectedAccount.accountName,
            awsAccount: selectedAccount.accountNumber,
            environment: selectedAccount.environment,
            bucketName,
            filePath: filePath || undefined,
            justification,
            notificationEmails: emails,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.message || `Request failed with status ${response.status}`);
        }

        const data = await response.json();

        navigate('/request-success', {
          state: {
            requestId: data.requestId,
            accountName: selectedAccount.accountName,
            awsAccount: selectedAccount.accountNumber,
            environment: selectedAccount.environment,
            bucketName,
          },
        });
      } catch (err) {
        setSubmitError(
          err instanceof Error
            ? err.message
            : 'Something went wrong. Please try again.'
        );
      } finally {
        setIsSubmitting(false);
      }
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
            {/* AWS Account */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                AWS Account <span className="text-accent-400">*</span>
              </label>
              <select
                value={selectedAccountName}
                onChange={(e) => handleAccountChange(e.target.value)}
                onBlur={() => handleBlur('awsAccount')}
                className={fieldClass('awsAccount')}
              >
                <option value="" className="bg-navy-900">Select an AWS account</option>
                {awsAccounts.map((acc) => (
                  <option key={acc.accountNumber} value={acc.accountName} className="bg-navy-900">
                    {acc.accountName} ({acc.accountNumber})
                  </option>
                ))}
              </select>
              {touched.awsAccount && errors.awsAccount && (
                <p className="mt-1.5 text-sm text-red-400">{errors.awsAccount}</p>
              )}
            </div>

            {/* Auto-populated account details */}
            {selectedAccount && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={selectedAccount.accountNumber}
                    readOnly
                    className="w-full px-4 py-3 rounded-xl bg-navy-900/30 border border-navy-700/30 text-slate-400 cursor-not-allowed text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Environment
                  </label>
                  <input
                    type="text"
                    value={selectedAccount.environment}
                    readOnly
                    className="w-full px-4 py-3 rounded-xl bg-navy-900/30 border border-navy-700/30 text-slate-400 cursor-not-allowed text-sm"
                  />
                </div>
              </div>
            )}

            {/* S3 Bucket */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                S3 Bucket <span className="text-accent-400">*</span>
              </label>
              <select
                value={bucketName}
                onChange={(e) => setBucketName(e.target.value)}
                onBlur={() => handleBlur('bucketName')}
                disabled={!selectedAccountName}
                className={`${fieldClass('bucketName')} ${!selectedAccountName ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <option value="" className="bg-navy-900">
                  {selectedAccountName ? 'Select a bucket' : 'Select an AWS account first'}
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

            {/* Submit Error */}
            {submitError && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-red-400">{submitError}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                  isFormValid && !isSubmitting
                    ? 'bg-accent-400 hover:bg-accent-500 text-navy-900 cursor-pointer shadow-lg shadow-accent-400/20'
                    : 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  'Submit Request'
                )}
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}

export default SecureUploadRequestPage;
