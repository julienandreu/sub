import { LocationProvider, Route, Router } from 'preact-iso';
import Widget from './components/View/Widget';
import Auth from './components/View/Auth';
import Error from './components/View/Error';

function App() {
  return (
    <LocationProvider>
      <Router>
        <Route path="/auth" component={Auth} />
        <Route path="/widget" component={Widget} />
        {/* @ts-expect-error - Path is a derived property from the router */}
        <Error default />
      </Router>
    </LocationProvider>
  );
}

export default App;
