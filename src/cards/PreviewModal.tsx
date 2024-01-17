import { Show } from "solid-js";
import { PreviewModalBig } from "./PreviewModalBig";
import { PreviewModalSmall } from "./PreviewModalSmall";

export const PreviewModalBigOrSmall = (props: {
  previewModalElement: Element;
}) => {
  return (
    <>
      <Show when={props.previewModalElement.matches(".detail-modal")}>
        <PreviewModalBig previewModalElement={props.previewModalElement} />
      </Show>
      <Show when={props.previewModalElement.matches(".mini-modal")}>
        <PreviewModalSmall previewModalElement={props.previewModalElement} />
      </Show>
    </>
  );
};
