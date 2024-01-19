import { Accessor, createEffect, createSignal } from "solid-js";
import { createMutationObserver } from "@solid-primitives/mutation-observer";

export const useObserveQuerySelector = (
  parentElementToQuery: Accessor<Element | null | undefined>,
  querySelector: string
) => {
  const [queriedElementResult, setQueriedElementResult] = createSignal(
    parentElementToQuery()?.querySelector(querySelector) ?? undefined
  );

  const [mutationObserverAdd, mutationObserverCtx] = createMutationObserver(
    [],
    { subtree: true, childList: true },
    (mutations) => {
      for (const mutation of mutations) {
        if (mutation.addedNodes) {
          for (const addedNode of mutation.addedNodes) {
            if (addedNode instanceof HTMLElement) {
              if (addedNode.matches(querySelector))
                setQueriedElementResult(addedNode);
              const foundElement = addedNode.querySelector(querySelector);
              if (foundElement) setQueriedElementResult(foundElement);
            }
          }
        }

        if (mutation.removedNodes) {
          for (const removedNode of mutation.removedNodes) {
            if (removedNode instanceof HTMLElement) {
              const queriedElement = queriedElementResult();
              if (
                removedNode === queriedElementResult() ||
                (queriedElement && removedNode.contains(queriedElement))
              )
                setQueriedElementResult(undefined);
            }
          }
        }
      }
    }
  );

  createEffect(() => {
    const parentEl = parentElementToQuery();
    if (!parentEl) {
      mutationObserverCtx.stop();
      setQueriedElementResult(undefined);
      return;
    }

    mutationObserverAdd(parentEl);
    setQueriedElementResult(parentEl.querySelector(querySelector) ?? undefined);
  });

  return queriedElementResult;
};
