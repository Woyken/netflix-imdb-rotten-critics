import { createEffect, createSignal, For, onCleanup } from "solid-js";
import { Portal } from "solid-js/web";
import { SmallCard } from "./cards/SmallCard";
import { PreviewModalBigOrSmall } from "./cards/PreviewModal";
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
  onCleanup(() => obs.disconnect());
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
    if (cardElements.length > 0)
      setQueriedElementsList((prev) => new Set([...prev, ...cardElements]));
  };
  const removedElementCallback = (removedNode: HTMLElement) => {
    if (queriedElementsList().has(removedNode))
      setQueriedElementsList(
        (prev) => new Set([...[...prev].filter((p) => p !== removedNode)])
      );
    const cardElements = new Set(removedNode.querySelectorAll(querySelector));
    if (cardElements.size > 0)
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

const queryBillboardElements = ".billboard.billboard-pane";
const queryPreviewModalElements = ".previewModal--container";
const queryCardElements = ".title-card";

const useRenderPreviewElementsLists = () => {
  const [smallCardsList, elementsListAddCb0, elementsListRemoveCb0] =
    useQuerySelectorElements(queryCardElements);
  const [previewModalList, elementsListAddCb1, elementsListRemoveCb1] =
    useQuerySelectorElements(queryPreviewModalElements);
  const [billboardList, elementsListAddCb2, elementsListRemoveCb2] =
    useQuerySelectorElements(queryBillboardElements);

  // TODO cleanup this Observer mess
  const attributeClassObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.target instanceof HTMLElement) {
        elementsListRemoveCb0(mutation.target);
        elementsListRemoveCb1(mutation.target);
        elementsListRemoveCb2(mutation.target);
        elementsListAddCb0(mutation.target);
        elementsListAddCb1(mutation.target);
        elementsListAddCb2(mutation.target);
      }
    }
  });
  createEffect(() => {
    [...smallCardsList(), ...previewModalList(), ...billboardList()].forEach(
      (el) =>
        attributeClassObserver.observe(el, {
          attributes: true,
          attributeFilter: ["class"],
        })
    );
    onCleanup(() => attributeClassObserver.disconnect());
  });
  useMutations(
    (addedNode) => {
      elementsListAddCb0(addedNode);
      elementsListAddCb1(addedNode);
      elementsListAddCb2(addedNode);
    },
    (removedNode) => {
      elementsListRemoveCb0(removedNode);
      elementsListRemoveCb1(removedNode);
      elementsListRemoveCb2(removedNode);
    }
  );

  return [smallCardsList, previewModalList, billboardList] as const;
};

export const CardsRenderer = () => {
  const [smallCardsList, previewModalList, billboardList] =
    useRenderPreviewElementsLists();

  return (
    <>
      <For each={[...smallCardsList()]}>
        {(cardNode) => (
          <Portal mount={cardNode}>
            <SmallCard />
          </Portal>
        )}
      </For>
      <For each={[...previewModalList()]}>
        {(cardNode) => (
          <Portal mount={cardNode}>
            <PreviewModalBigOrSmall previewModalElement={cardNode} />
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
