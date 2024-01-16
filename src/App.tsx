import { createSignal, For, type Component, createEffect } from "solid-js";
import { Portal } from "solid-js/web";

// Preview on card hover, `previewModal--container mini-modal has-smaller-buttons`
// Card, `title-card`
// Preview big popup `previewModal--container detail-modal has-smaller-buttons`
// BIG main view preview `billboard billboard-pane billboard-originals trailer-billboard`

const useMutations = (
  onElementAdded: (addedNode: HTMLElement) => void,
  onElementRemoved: (removedNode: HTMLElement) => void
) => {
  const obs = new MutationObserver((mutationList, observer) => {
    for (const mutation of mutationList) {
      if (mutation.type === "childList") {
        if (mutation.addedNodes) {
          mutation.addedNodes.forEach((addedNode) => {
            if (addedNode instanceof HTMLElement) {
              onElementAdded(addedNode);
            }
          });
        }
        if (mutation.removedNodes) {
          mutation.removedNodes.forEach((removedNode) => {
            if (removedNode instanceof HTMLElement) {
              onElementRemoved(removedNode);
            }
          });
        }
      }
    }
  });

  obs.observe(document.body, { childList: true, subtree: true });
};

const useQuerySelectorElements = (querySelector: string) => {
  const [queriedElementsList, setQueriedElementsList] = createSignal(
    new Set<Element>(document.body.querySelectorAll(querySelector))
  );
  const addedElementCallback = (addedNode: HTMLElement) => {
    const cardElements = [
      addedNode,
      ...addedNode.querySelectorAll(querySelector),
    ].filter((x) => x.matches(querySelector));
    setQueriedElementsList((prev) => new Set([...prev, ...cardElements]));
  };
  const removedElementCallback = (removedNode: HTMLElement) => {
    if (queriedElementsList().has(removedNode))
      setQueriedElementsList(
        (prev) => new Set([...[...prev].filter((p) => p !== removedNode)])
      );
    const cardElements = new Set(removedNode.querySelectorAll(querySelector));
    setQueriedElementsList(
      (prev) => new Set([...[...prev].filter((p) => !cardElements.has(p))])
    );
  };

  return [
    queriedElementsList,
    addedElementCallback,
    removedElementCallback,
  ] as const;
};

const useRenderPreviewElementsLists = () => {
  const [smallCardsList, elementsListAddCb0, elementsListRemoveCb0] =
    useQuerySelectorElements(".title-card");
  const [hoverPreviewCardsList, elementsListAddCb1, elementsListRemoveCb1] =
    useQuerySelectorElements(".previewModal--container.mini-modal");
  const [bigPreviewPopupList, elementsListAddCb2, elementsListRemoveCb2] =
    useQuerySelectorElements(".previewModal--container.detail-modal .ptrack-container");
  const [billboardList, elementsListAddCb3, elementsListRemoveCb3] =
    useQuerySelectorElements(".billboard.billboard-pane .logo-and-text");

  useMutations(
    (addedNode) => {
      elementsListAddCb0(addedNode);
      elementsListAddCb1(addedNode);
      elementsListAddCb2(addedNode);
      elementsListAddCb3(addedNode);
    },
    (removedNode) => {
      elementsListRemoveCb0(removedNode);
      elementsListRemoveCb1(removedNode);
      elementsListRemoveCb2(removedNode);
      elementsListRemoveCb3(removedNode);
    }
  );

  return [
    smallCardsList,
    hoverPreviewCardsList,
    bigPreviewPopupList,
    billboardList,
  ] as const;
};

const OnCards = () => {
  const [
    smallCardsList,
    hoverPreviewCardsList,
    bigPreviewPopupList,
    billboardList,
  ] = useRenderPreviewElementsLists();

  return (
    <>
      <For each={[...smallCardsList()]}>
        {(cardNode) => (
          <Portal mount={cardNode}>
            <div style={{color: 'red'}}>small card!</div>
          </Portal>
        )}
      </For>
      <For each={[...hoverPreviewCardsList()]}>
        {(cardNode) => (
          <Portal mount={cardNode}>
            <div style={{color: 'red'}}>Hover small card!</div>
          </Portal>
        )}
      </For>
      <For each={[...bigPreviewPopupList()]}>
        {(cardNode) => (
          <Portal mount={cardNode}>
            <div style={{color: 'red'}}>Big card preview!</div>
          </Portal>
        )}
      </For>
      <For each={[...billboardList()]}>
        {(cardNode) => (
          <Portal mount={cardNode}>
            <div style={{color: 'red'}}>Billboard card!</div>
          </Portal>
        )}
      </For>
    </>
  );
};

const App: Component = () => {
  return (
    <div>
      <OnCards />
    </div>
  );
};

export default App;
