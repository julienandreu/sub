function Auth() {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <form className="w-full max-w-sm card space-y-6">
          <h2 className="card-title">Sign In</h2>
          <div className="space-y-2">
            <label htmlFor="email" className="label">
              Email
            </label>
            <input
              id="email"
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
              type="password"
              className="input"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="btn-primary"
          >
            Sign In
          </button>
        </form>
      </div>
    </>
  );
}

export default Auth;
