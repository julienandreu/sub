import { useState } from 'preact/hooks';

function Versions() {
  const [versions] = useState(window.electron.process.versions);

  return (
    <ul className="versions">
      <li className="electron-version">Electron {'electron' in versions ? `v${versions.electron}` : 'unknown'}</li>
      <li className="chrome-version">Chromium {'chrome' in versions ? `v${versions.chrome}` : 'unknown'}</li>
      <li className="node-version">Node {'node' in versions ? `v${versions.node}` : 'unknown'}</li>
    </ul>
  );
}

export default Versions;
