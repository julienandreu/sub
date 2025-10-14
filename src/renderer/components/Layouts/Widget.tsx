import { useEffect, useRef } from 'preact/hooks';
import { useInvoke } from '../../hooks/use-invoke';
import WidgetIcon from '../Elements/WidgetIcon';
import Badge from '../Elements/Badge';
import Logo from '../Elements/Logo';

const distanceThreshold = 5;
let start: { x: number; y: number } | null = null;

const clickThreshold = 100;
let startTime = performance.now();

function Widget() {
  const { window: { move, open } } = useInvoke();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const pointerDownHandler = ({ screenX, screenY }: PointerEvent) => {
      start = { x: screenX, y: screenY };
      startTime = performance.now();

      const _move = (ev: PointerEvent) => {
        if (!start) {
          return;
        }

        const distance = {
          x: ev.screenX - start.x,
          y: ev.screenY - start.y,
        };

        if (Math.hypot(distance.x, distance.y) > distanceThreshold) {
          move(distance);

          start = { x: ev.screenX, y: ev.screenY };
        }
      };

      const up = (ev: PointerEvent): void => {
        document.removeEventListener('pointermove', _move);
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

        authHandler();
      };

      document.addEventListener('pointermove', _move);
      document.addEventListener('pointerup', up, { once: true });
    };

    ref.current.addEventListener('pointerdown', pointerDownHandler);

    return () => {
      ref.current?.removeEventListener('pointerdown', pointerDownHandler);
    };
  }, [ref]);

  const authHandler = (): void => {
    void open('auth');
  };

  return (
    <>
      <WidgetIcon ref={ref}>
        <Logo size="medium" variant="regular" className="pointer-events-none" />
      </WidgetIcon>
      <Badge variant="error" count={0} />
    </>
  );
}

export default Widget;
