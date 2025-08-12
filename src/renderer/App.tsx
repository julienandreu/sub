import { LocationProvider, Route, Router } from 'preact-iso';
import { type ComponentChildren } from 'preact';
import Widget from './components/View/Widget';
import Auth from './components/View/Auth';
import Error from './components/View/Error';

import { useTheme } from './hooks/use-theme';

function ThemeProvider({ children }: { children: ComponentChildren }) {
  // Initialize theme system-wide; consumers can read context if needed later
  useTheme();
  return <>{children}</>;
}

function App() {
  return (
    <ThemeProvider>
      <LocationProvider>
        <Router>
          <Route path="/auth" component={Auth} />
          <Route path="/widget" component={Widget} />
          {/* @ts-expect-error - Path is a derived property from the router */}
          <Error default />
        </Router>
      </LocationProvider>
    </ThemeProvider>
  );
}

export default App;
