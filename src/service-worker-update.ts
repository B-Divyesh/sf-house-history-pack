export interface UpdateRegistration extends EventTarget {
  installing: (EventTarget & { state: string }) | null;
  waiting: unknown;
}

/** Attach update listeners while retaining the worker that raised updatefound. */
export function watchForServiceWorkerUpdate(
  registration: UpdateRegistration,
  hasController: () => boolean,
  notify: () => void
): void {
  if (registration.waiting) notify();
  registration.addEventListener('updatefound', () => {
    const worker = registration.installing;
    if (!worker) return;
    worker.addEventListener('statechange', () => {
      if (worker.state === 'installed' && hasController()) notify();
    });
  });
}
