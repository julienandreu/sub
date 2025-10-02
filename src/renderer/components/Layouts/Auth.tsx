import { useSignal } from '@preact/signals';
import { useInvoke } from '../../hooks/use-invoke';
import { useState } from 'preact/hooks';

function Auth() {
  const loadingSignal = useSignal(false);
  const [errors, setErrors] = useState<string[]>([]);
  const { user: { signIn, signOut } } = useInvoke();

  const handleSignOut = async () => {
    try {
      const signOutDone = await signOut();

      console.log('signOutDone', signOutDone);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      // No-op
    }
  };

  const handleSubmit = (event: SubmitEvent) => {
    const submitErrors: string[] = [];
    try {
      event.preventDefault();

      loadingSignal.value = true;
      const formData = new FormData(event.currentTarget as HTMLFormElement);
      const email = formData.get('email');
      const password = formData.get('password');

      if (typeof email !== 'string' || !email) {
        submitErrors.push('Email is required');
      }

      if (typeof password !== 'string' || !password) {
        submitErrors.push('Password is required');
      }

      if (submitErrors.length > 0) {
        throw new Error('Invalid authentication credentials');
      }

      void signIn(email as string, password as string);
      setErrors([]);
    } catch (errorCaught) {
      setErrors([String(errorCaught), ...submitErrors]);
    } finally {
      loadingSignal.value = false;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-2 sm:p-4" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="w-full max-w-sm sm:max-w-md">
        {/* Mobile and Tablet Layout */}
        <div className="lg:hidden">
          <div className="text-center mb-4 sm:mb-6">
            <div className="flex justify-center mb-4">
              <div
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg"
                style={{ backgroundColor: 'var(--color-text-info)' }}
              >
                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--color-background)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 px-2" style={{ color: 'var(--color-text)' }}>
              Sign in to your account
            </h1>
            <p className="text-xs sm:text-sm px-4" style={{ color: 'var(--color-text-secondary)' }}>
              Welcome back! Please sign in to continue.
            </p>
          </div>

          <div
            className="rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl border"
            style={{
              backgroundColor: 'var(--color-background-secondary)',
              borderColor: 'var(--color-border)'
            }}
          >
            <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
              {errors.length > 0 && (
                <div
                  className="rounded-lg p-3 sm:p-4 border"
                  style={{
                    backgroundColor: 'var(--color-surface-error)',
                    borderColor: 'var(--color-text-error)'
                  }}
                >
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor" style={{ color: 'var(--color-text-error)' }}>
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-2 sm:ml-3">
                      <h3 className="text-xs sm:text-sm font-medium" style={{ color: 'var(--color-text-error)' }}>
                        Authentication Error
                      </h3>
                      <div className="mt-1 sm:mt-2 text-xs sm:text-sm" style={{ color: 'var(--color-text-error)' }}>
                        <ul className="list-disc space-y-0.5 sm:space-y-1 pl-4 sm:pl-5">
                          {errors.map((error) => (
                            <li key={error}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2" style={{ color: 'var(--color-text)' }}>
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="w-full rounded-lg border-0 py-2.5 sm:py-3 px-3 sm:px-4 text-sm shadow-sm transition-all duration-200 focus:ring-2 focus:ring-inset"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    color: 'var(--color-text)',
                    borderColor: errors.length > 0 ? 'var(--color-text-error)' : 'var(--color-border)',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    '--tw-ring-color': errors.length > 0 ? 'var(--color-text-error)' : 'var(--color-text-info)'
                  }}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2" style={{ color: 'var(--color-text)' }}>
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  className="w-full rounded-lg border-0 py-2.5 sm:py-3 px-3 sm:px-4 text-sm shadow-sm transition-all duration-200 focus:ring-2 focus:ring-inset"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    color: 'var(--color-text)',
                    borderColor: errors.length > 0 ? 'var(--color-text-error)' : 'var(--color-border)',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    '--tw-ring-color': errors.length > 0 ? 'var(--color-text-error)' : 'var(--color-text-info)'
                  }}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="space-y-2 sm:space-y-3">
                <button
                  type="submit"
                  disabled={loadingSignal.value}
                  className="w-full rounded-lg py-2.5 sm:py-3 px-4 text-xs sm:text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                  style={{
                    backgroundColor: 'var(--color-text-info)',
                    color: 'var(--color-background)',
                    '--tw-ring-color': 'var(--color-text-info)'
                  }}
                >
                  {loadingSignal.value ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="hidden xs:inline">Signing in...</span>
                      <span className="xs:hidden">Signing in...</span>
                    </div>
                  ) : (
                    'Sign in'
                  )}
                </button>

                <button
                  type="button"
                  disabled={loadingSignal.value}
                  onClick={() => void handleSignOut()}
                  className="w-full rounded-lg py-2.5 sm:py-3 px-4 text-xs sm:text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                  style={{
                    backgroundColor: 'var(--color-text-error)',
                    color: 'var(--color-background)',
                    '--tw-ring-color': 'var(--color-text-error)'
                  }}
                >
                  Sign Out
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block w-full max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left side - Branding */}
            <div className="text-center lg:text-left">
              <div className="flex justify-center lg:justify-start mb-8">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl"
                  style={{ backgroundColor: 'var(--color-text-info)' }}
                >
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--color-background)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                Welcome back
              </h1>
              <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>
                Sign in to your account to continue. Your secure authentication gateway to all your applications.
              </p>
            </div>

            {/* Right side - Form */}
            <div>
              <div
                className="rounded-2xl p-8 shadow-xl border"
                style={{
                  backgroundColor: 'var(--color-background-secondary)',
                  borderColor: 'var(--color-border)'
                }}
              >
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                    Sign in
                  </h2>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    Don't have an account? Contact your administrator.
                  </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                  {errors.length > 0 && (
                    <div
                      className="rounded-lg p-4 border"
                      style={{
                        backgroundColor: 'var(--color-surface-error)',
                        borderColor: 'var(--color-text-error)'
                      }}
                    >
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" style={{ color: 'var(--color-text-error)' }}>
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium" style={{ color: 'var(--color-text-error)' }}>
                            Authentication Error
                          </h3>
                          <div className="mt-2 text-sm" style={{ color: 'var(--color-text-error)' }}>
                            <ul className="list-disc space-y-1 pl-5">
                              {errors.map((error) => (
                                <li key={error}>{error}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                      Email address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className="w-full rounded-lg border-0 py-3 px-4 text-sm shadow-sm transition-all duration-200 focus:ring-2 focus:ring-inset"
                      style={{
                        backgroundColor: 'var(--color-background)',
                        color: 'var(--color-text)',
                        borderColor: errors.length > 0 ? 'var(--color-text-error)' : 'var(--color-border)',
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        '--tw-ring-color': errors.length > 0 ? 'var(--color-text-error)' : 'var(--color-text-info)'
                      }}
                      placeholder="you@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      className="w-full rounded-lg border-0 py-3 px-4 text-sm shadow-sm transition-all duration-200 focus:ring-2 focus:ring-inset"
                      style={{
                        backgroundColor: 'var(--color-background)',
                        color: 'var(--color-text)',
                        borderColor: errors.length > 0 ? 'var(--color-text-error)' : 'var(--color-border)',
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        '--tw-ring-color': errors.length > 0 ? 'var(--color-text-error)' : 'var(--color-text-info)'
                      }}
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <button
                      type="submit"
                      disabled={loadingSignal.value}
                      className="w-full rounded-lg py-3 px-4 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        backgroundColor: 'var(--color-text-info)',
                        color: 'var(--color-background)',
                        '--tw-ring-color': 'var(--color-text-info)'
                      }}
                    >
                      {loadingSignal.value ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Signing in...
                        </div>
                      ) : (
                        'Sign in'
                      )}
                    </button>

                    <button
                      type="button"
                      disabled={loadingSignal.value}
                      onClick={() => void handleSignOut()}
                      className="w-full rounded-lg py-3 px-4 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        backgroundColor: 'var(--color-text-error)',
                        color: 'var(--color-background)',
                        '--tw-ring-color': 'var(--color-text-error)'
                      }}
                    >
                      Sign Out
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
