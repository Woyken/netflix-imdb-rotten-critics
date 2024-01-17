import { Show, createMemo } from "solid-js";
import { Portal } from "solid-js/web";
import { useImdbSearch } from "../queries/imdbQuery";

export const PreviewModalBig = (props: { previewModalElement: Element }) => {
  const title = createMemo(
    () =>
      props.previewModalElement
        .querySelector(".previewModal--player-titleTreatment-logo")
        ?.getAttribute("title") ?? undefined
  );
  const year = createMemo(
    () => props.previewModalElement.querySelector(".year")?.innerHTML
  );

  const el = createMemo(() =>
    props.previewModalElement.querySelector(".previewModal--detailsMetadata")
  );

  const isSeries = createMemo(
    () => !!props.previewModalElement.querySelector(".episodeSelector")
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
        <Show when={searchQuery.data?.type === "unknownError"}>
          <div style={{ color: "red" }}>
            IMDB:{" "}
            {searchQuery.data?.type === "unknownError" &&
              searchQuery.data.error}
          </div>
        </Show>
        <Show when={searchQuery.data?.type === "ratingNotFound"}>
          <div style={{ color: "red" }}>IMDB: N/A</div>
        </Show>
        <Show when={searchQuery.data?.type === "movieNotFound"}>
          <div style={{ color: "red" }}>IMDB: 404</div>
        </Show>
        <Show when={searchQuery.data?.type === "ratingFound"}>
          <div style={{ color: "orange" }}>
            IMDB:{" "}
            {searchQuery.data?.type === "ratingFound" &&
              searchQuery.data.imdbRating}
          </div>
        </Show>
        <Show when={searchQuery.isFetching}>
          <p style={{ color: "yellow" }}>...</p>
        </Show>
      </Show>
    </Portal>
  );
};
