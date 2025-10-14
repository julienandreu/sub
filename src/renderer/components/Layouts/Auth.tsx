import { useSignal } from '@preact/signals';
import { useState } from 'preact/hooks';
import { useInvoke } from '../../hooks/use-invoke';
import Logo from '../Elements/Logo';
import classNames from 'classnames';

function Auth() {
  const loadingSignal = useSignal(false);
  const [errors, setErrors] = useState<string[]>([]);
  const { user: { signIn } } = useInvoke();

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
    <div
      className={classNames(
        'h-screen',
        'w-screen',
      )}
    >
      <div
        className={classNames(
          'bg-radial-[at_25%_25%]',
          'from-[#01ADFE]',
          'from-0%',
          'via-[#0187FC]',
          'via-60%',
          'to-[#056EE4]',
          'to-100%',
          'flex',
          'items-center',
          'justify-start',
          'p-4',
          'select-none',
        )}
      >
        <Logo size="medium" variant="mono" className="pointer-events-none" />
      </div>
      <h1>
        Sign in to your account
      </h1>
      <p>
        Welcome back! Please sign in to continue.
      </p>
      <form onSubmit={handleSubmit}>
        {errors.length > 0 && (
          <>
            <h3>
              Authentication Error
            </h3>
            <ul>
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </>
        )}

        <div>
          <label htmlFor="email">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            required
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={loadingSignal.value}
          >
            {loadingSignal.value ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Auth;
