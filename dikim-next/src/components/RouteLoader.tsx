import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import BrandLoader from '@/components/BrandLoader';

export default function RouteLoader() {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }

    setVisible(true);
    const hide = window.setTimeout(() => setVisible(false), 750);
    return () => window.clearTimeout(hide);
  }, [pathname]);

  if (!visible) return null;

  return (
    <div className="route-loader-overlay">
      <BrandLoader fullScreen={false} />
    </div>
  );
}
