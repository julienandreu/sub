import { LocationProvider, Route, Router } from 'preact-iso';
import Widget from './components/View/Widget';

function App() {
  return (
    <LocationProvider>
      <Router>
        <Route path="/" component={Widget} />
        {/* @ts-expect-error - Path is a derived property from the router */}
        <Widget default />
      </Router>
    </LocationProvider>
  );
}

export default App;
