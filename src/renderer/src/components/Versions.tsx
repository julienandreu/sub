import { useState } from 'preact/hooks';

function Versions() {
  const [versions] = useState<{ electron: string; chrome: string; node: string }>(
    // @ts-expect-error (define in dts)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    window.electron?.process?.versions ?? {
      electron: 'unknown',
      chrome: 'unknown',
      node: 'unknown',
    });

  return (
    <ul className="versions">
      <li className="electron-version">Electron v{'electron' in versions ? versions.electron : 'unknown'}</li>
      <li className="chrome-version">Chromium v{'chrome' in versions ? versions.chrome : 'unknown'}</li>
      <li className="node-version">Node v{'node' in versions ? versions.node : 'unknown'}</li>
    </ul>
  );
}

export default Versions;
