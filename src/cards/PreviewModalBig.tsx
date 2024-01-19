import { Match, Show, Switch, createMemo } from "solid-js";
import { Portal } from "solid-js/web";
import { useImdbSearch } from "../queries/imdbQuery";
import { useObserveQuerySelector } from "../hooks/useObserveQuerySelector";

// Probably should rely more on constant attributes like `data-uia="videoMetadata--container"`
// Netflix uses react, so we get placeholder view rendered without any data
// Then it renders all the data inside, reusing some elements, and re-attaching some classes to already existing elements.
export const PreviewModalBig = (props: { previewModalElement: Element }) => {
  const aboutTitleElement = useObserveQuerySelector(
    () => props.previewModalElement,
    ".about-header .previewModal--section-header strong"
  );
  const title = createMemo(() => aboutTitleElement()?.innerHTML);

  const yearElement = useObserveQuerySelector(
    () => props.previewModalElement,
    ".previewModal--detailsMetadata .year"
  );
  const year = createMemo(() => {
    if (!title()) return undefined;
    return yearElement()?.innerHTML;
  });

  const el = createMemo(() => {
    if (!title()) return undefined;
    return props.previewModalElement.querySelector(
      ".previewModal--detailsMetadata"
    );
  });

  const isSeries = createMemo(
    () =>
      !!title() && !!props.previewModalElement.querySelector(".episodeSelector")
  );
  const searchQuery = useImdbSearch(title, year, isSeries);

  return (
    <Portal mount={el() ?? undefined}>
      <Show when={searchQuery.isLoading}>
        <div style={{ color: "orange" }}>IMDB: Loading...</div>
      </Show>
      <Show when={searchQuery.isError}>
        <div style={{ color: "red" }}>
          IMDB: Error {searchQuery.error?.message}
        </div>
      </Show>

      <Show when={!!searchQuery.data}>
        <Switch fallback={<div>Imdb: Unknown state</div>}>
          <Match when={searchQuery.data?.type === "unknownError"}>
            <div style={{ color: "red" }}>
              IMDB:{" "}
              {searchQuery.data?.type === "unknownError" &&
                searchQuery.data.error}
            </div>
          </Match>
          <Match when={searchQuery.data?.type === "ratingNotFound"}>
            <div style={{ color: "red" }}>IMDB: N/A</div>
          </Match>
          <Match when={searchQuery.data?.type === "movieNotFound"}>
            <div style={{ color: "red" }}>IMDB: 404</div>
          </Match>
          <Match when={searchQuery.data?.type === "ratingFound"}>
            <div style={{ color: "orange" }}>
              IMDB:{" "}
              {searchQuery.data?.type === "ratingFound" &&
                searchQuery.data.imdbRating}
            </div>
          </Match>
        </Switch>

        <Show when={searchQuery.isFetching}>
          <p style={{ color: "yellow" }}>...</p>
        </Show>
      </Show>
    </Portal>
  );
};
