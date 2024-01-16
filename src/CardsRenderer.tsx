import { createSignal, For } from "solid-js";
import { Portal } from "solid-js/web";
import { SmallCard } from "./cards/SmallCard";
import { HoverSmallCard } from "./cards/HoverSmallCard";
import { PreviewModal } from "./cards/PreviewModal";
import { Billboard } from "./cards/Billboard";

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
    useQuerySelectorElements(
      ".previewModal--container.mini-modal .previewModal--info"
    );
  const [bigPreviewPopupList, elementsListAddCb2, elementsListRemoveCb2] =
    useQuerySelectorElements(
      ".previewModal--container.detail-modal .previewModal--detailsMetadata"
    );
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

export const CardsRenderer = () => {
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
            <SmallCard />
          </Portal>
        )}
      </For>
      <For each={[...hoverPreviewCardsList()]}>
        {(cardNode) => (
          <Portal mount={cardNode}>
            <HoverSmallCard />
          </Portal>
        )}
      </For>
      <For each={[...bigPreviewPopupList()]}>
        {(cardNode) => (
          <Portal mount={cardNode}>
            <PreviewModal />
          </Portal>
        )}
      </For>
      <For each={[...billboardList()]}>
        {(cardNode) => (
          <Portal mount={cardNode}>
            <Billboard />
          </Portal>
        )}
      </For>
    </>
  );
};
