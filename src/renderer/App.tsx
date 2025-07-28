import Versions from './components/Versions';
import electronLogo from './assets/electron.svg';
import { useInvoke } from './hooks/useInvoke';

function App() {
  const { user: { auth } } = useInvoke();

  const authHandler = async (): Promise<void> => {
    const rst = await auth('USER', 'PASS');

    alert(JSON.stringify(rst, null, 2));
  };

  return (
    <>
      <img alt="logo" className="logo" src={String(electronLogo)} />
      <div className="creator">Powered by electron-vite</div>
      <div className="text">
        Build an Electron app with <span className="react">React</span>
        &nbsp;and <span className="ts">TypeScript</span>
      </div>
      <p className="tip">
        Please try pressing <code>F12</code> to open the devTool
      </p>
      <div className="actions">
        <div className="action">
          <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">
            Documentation
          </a>
        </div>
        <div className="action">
          <a target="_blank" rel="noreferrer" onClick={() => void authHandler()}>
            Authenticate
          </a>
        </div>
      </div>
      <Versions></Versions>
    </>
  );
}

export default App;
