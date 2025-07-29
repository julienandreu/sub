import { useEffect, useRef } from 'preact/hooks';
import { useInvoke } from '../../hooks/useInvoke';
import Icon from '../Layout/Icon';

const distanceThreshold = 5;
let start: { x: number; y: number } | null = null;

const clickThreshold = 100;
let startTime = performance.now();

function Widget() {
  const { user: { auth }, window: { move: moveWindow } } = useInvoke();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const pointerDownHandler = ({ screenX, screenY }: PointerEvent) => {
      start = { x: screenX, y: screenY };
      startTime = performance.now();

      const move = (ev: PointerEvent) => {
        if (!start) {
          return;
        }

        const distance = {
          x: ev.screenX - start.x,
          y: ev.screenY - start.y,
        };

        if (Math.hypot(distance.x, distance.y) > distanceThreshold) {
          moveWindow(distance);

          start = { x: ev.screenX, y: ev.screenY };
        }
      };

      const up = (ev: PointerEvent) => {
        document.removeEventListener('pointermove', move);
        document.removeEventListener('pointerup', up);

        if (!start) {
          return;
        }

        if (Math.hypot(ev.screenX - start.x, ev.screenY - start.y) > distanceThreshold) {
          return;
        }

        if (performance.now() - startTime > clickThreshold) {
          return;
        }

        void authHandler();
      };

      document.addEventListener('pointermove', move);
      document.addEventListener('pointerup', up, { once: true });
    };

    ref.current.addEventListener('pointerdown', pointerDownHandler);

    return () => {
      ref.current?.removeEventListener('pointerdown', pointerDownHandler);
    };
  }, [ref]);

  const authHandler = async (): Promise<void> => {
    const rst = await auth('USER', 'PASS');

    console.dir(rst, { depth: null, colors: true });
  };

  return (
    <Icon ref={ref}>
      SUB
    </Icon>
  );
}

export default Widget;
