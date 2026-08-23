type Listener = () => void;

const listeners = new Set<Listener>();

export function notifyAiDraftsChanged(): void {
  for (const listener of listeners) listener();
}

export function subscribeAiDraftsChanged(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
