import { Accessor, createEffect, createSignal } from "solid-js";
import { createMutationObserver } from "@solid-primitives/mutation-observer";

export const useObserveAttribute = (
  element: Accessor<Element | undefined>,
  attributeName: string
) => {
  const [attributeValue, setAttributeValue] = createSignal(
    element()?.getAttribute(attributeName) ?? undefined
  );

  const [mutationObserverAdd, mutationObserverCtx] = createMutationObserver(
    [],
    { attributeFilter: [attributeName] },
    (mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === attributeName &&
          mutation.target instanceof HTMLElement) {
          setAttributeValue(
            mutation.target.getAttribute(attributeName) ?? undefined
          );
        }
      }
    }
  );

  createEffect(() => {
    const el = element();
    if (!el) {
      mutationObserverCtx.stop();
      setAttributeValue(undefined);
      return;
    }

    mutationObserverAdd(el);
    setAttributeValue(el.getAttribute(attributeName) ?? undefined);
  });

  return attributeValue;
};
