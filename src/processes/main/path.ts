import { join } from 'path';

export function getRendererPath(): string {
  return join(
    __dirname,
    '..',
    'renderer',
  );
}
