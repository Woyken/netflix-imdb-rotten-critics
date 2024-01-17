import { Show, createMemo } from "solid-js";
import { Portal } from "solid-js/web";
import { useOmdbSearch } from "../queries/imdbQuery";

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

  const searchQuery = useOmdbSearch(title, year);

  const el = createMemo(() =>
    props.previewModalElement.querySelector(".previewModal--detailsMetadata")
  );

  return (
    <Portal mount={el() ?? undefined}>
      <Show when={searchQuery.isLoading}>
        <div style={{ color: "orange" }}>IMDB: Loading...</div>
      </Show>
      <Show when={!!searchQuery.data}>
        <Show
          when={searchQuery.data?.imdbRating !== "N/A"}
          fallback={<div style={{ color: "red" }}>IMDB: N/A</div>}
        >
          <div style={{ color: "red" }}>
            IMDB: {searchQuery.data?.imdbRating}
          </div>
        </Show>
        <Show when={searchQuery.isFetching}>
          <p style={{ color: "yellow" }}>...</p>
        </Show>
      </Show>
    </Portal>
  );
};
