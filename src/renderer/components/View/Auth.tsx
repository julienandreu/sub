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

  const handleSubmit = async (e: preact.JSX.TargetedEvent<HTMLFormElement>) => {
    const submitErrors: string[] = [];
    try {
      e.preventDefault();
      loadingSignal.value = true;
      const formData = new FormData(e.currentTarget);
      const email = formData.get('email');
      const password = formData.get('password');

      if (typeof email !== 'string') {
        submitErrors.push('Email is required');
      }

      if (typeof password !== 'string') {
        submitErrors.push('Password is required');
      }

      if (submitErrors.length > 0) {
        throw new Error('Invalid authentication credentials');
      }

      await signIn(email as string, password as string);
      setErrors([]);
    } catch (errorCaught) {
      setErrors([String(errorCaught), ...submitErrors]);
    } finally {
      loadingSignal.value = false;
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <form className="w-full max-w-sm card space-y-6" onSubmit={(e) => void handleSubmit(e)}>
          <h2 className="card-title">Sign In</h2>
          {errors.length > 0 && (
            <div className="alert alert-error">
              {errors.map((error) => (
                <div key={error}>{error}</div>
              ))}
            </div>
          )}
          <div className="space-y-2">
            <label htmlFor="email" className="label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="input"
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="input"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="btn-primary"
            disabled={loadingSignal.value}
          >
            {loadingSignal.value ? 'Loading...' : 'Sign In'}
          </button>
        </form>
        <button
          type="button"
          className="btn-error"
          disabled={loadingSignal.value}
          onClick={() => void handleSignOut()}
        >
          Sign Out
        </button>
      </div>
    </>
  );
}

export default Auth;
