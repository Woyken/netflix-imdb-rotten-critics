import { Show, createEffect, createMemo } from "solid-js";
import { Portal } from "solid-js/web";
import { useOmdbSearch } from "../queries/imdbQuery";

export const PreviewModal = (props: { previewModalElement: Element }) => {
  createEffect(() => {
    console.log('preview element changed', props.previewModalElement)
  })
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
      <Show when={!!searchQuery.data && searchQuery.data?.imdbRating !== 'N/A'}>
        <div style={{ color: "red" }}>IMDB {searchQuery.data?.imdbRating}</div>
      </Show>
    </Portal>
  );
};
