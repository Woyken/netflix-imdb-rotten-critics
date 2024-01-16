/* @refresh reload */
import { render } from "solid-js/web";
import App from "./App";

render(
  () => <App />,
  (() => {
    const app = document.createElement("div");
    app.style.position = "fixed";
    app.style.top = "0px";
    app.style.right = "0px";
    document.body.append(app);
    return app;
  })()
);
