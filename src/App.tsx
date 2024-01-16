import { createSignal, For, type Component } from "solid-js";
import { Portal } from "solid-js/web";

// Preview on card hover, `previewModal--container mini-modal has-smaller-buttons`
// Card, `title-card`
// Preview big popup `previewModal--container detail-modal has-smaller-buttons`
// BIG main view preview `billboard billboard-pane billboard-originals trailer-billboard`

const OnCards = () => {
  const [cardsList, setCardsList] = createSignal(new Set<Element>());
  const obs = new MutationObserver((mutationList, observer) => {
    for (const mutation of mutationList) {
      if (mutation.type === "childList") {
        if (mutation.addedNodes) {
          mutation.addedNodes.forEach((addedNode) => {
            if (addedNode instanceof HTMLElement) {
              const cardElements = addedNode.querySelectorAll(".title-card");
              setCardsList((prev) => new Set([...prev, ...cardElements]));
            }
          });
        }
        if (mutation.removedNodes) {
          mutation.removedNodes.forEach((removedNode) => {
            if (removedNode instanceof HTMLElement) {
              setCardsList(
                (prev) =>
                  new Set([...[...prev].filter((p) => p !== removedNode)])
              );
              const cardElements = removedNode.querySelectorAll(".title-card");
              cardElements.forEach((cardElement) => {
                setCardsList(
                  (prev) =>
                    new Set([...[...prev].filter((p) => p !== cardElement)])
                );
              });
            }
          });
        }
      }
    }
  });

  obs.observe(document.body, { childList: true, subtree: true });
  const cardElements = document.body.querySelectorAll(".title-card");
  setCardsList((prev) => new Set([...prev, ...cardElements]));

  return (
    <For each={[...cardsList()]}>
      {(cardNode) => (
        <Portal mount={cardNode}>
          <div>teeest</div>
        </Portal>
      )}
    </For>
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
