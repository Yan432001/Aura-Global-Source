import { unstableSetRender } from 'antd';
import { createRoot } from 'react-dom/client';

// Patch Ant Design v5 render behavior for React 19 compatibility
if (typeof unstableSetRender === 'function') {
  try {
    unstableSetRender((node, container) => {
      container._reactRoot = container._reactRoot || createRoot(container);
      const root = container._reactRoot;
      root.render(node);
      return () =>
        new Promise((resolve) => {
          setTimeout(() => {
            try {
              root.unmount();
            } catch (_) {}
            resolve();
          }, 0);
        });
    });
  } catch (err) {
    console.warn('[Aura] Ant Design React 19 patch skipped:', err);
  }
}

export default {};
