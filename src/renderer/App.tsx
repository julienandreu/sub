import { LocationProvider, Router } from 'preact-iso';
import Widget from './components/View/Widget';

function App() {
  return (
    <LocationProvider>
      <Router>
        {/* @ts-expect-error - Path is a derived property from the router */}
        <Widget path="/" />
      </Router>
    </LocationProvider>
  );
}

export default App;
