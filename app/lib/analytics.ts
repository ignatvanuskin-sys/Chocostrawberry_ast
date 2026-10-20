type Params = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: Params[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Точка подключения аналитики.
 * События уходят в window.dataLayer (GTM) и в gtag, если они подключены.
 * Никакие идентификаторы и секреты здесь не хранятся: контейнер
 * Analytics/GTM добавляется в app/layout.tsx при запуске.
 */
export function track(event: string, params: Params = {}) {
  if (typeof window === "undefined") return;

  const payload = { event, ...params };

  try {
    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push(payload);
    window.gtag?.("event", event, params);
  } catch {
    /* аналитика не должна ломать интерфейс */
  }

  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.debug("[analytics]", event, params);
  }
}
