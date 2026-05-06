import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";   // The root component that contains all pages
import "./styles.css";          // Global CSS — imported here so it applies site-wide

// ReactDOM.createRoot() creates a React "root" attached to the <div id="root">
// element in index.html. Everything React renders goes inside that div.
//
// TYPESCRIPT CONCEPT: Non-null assertion (`!`)
//   document.getElementById() returns `HTMLElement | null` because the element
//   might not exist. But we KNOW "root" exists (it's hardcoded in index.html),
//   so the `!` after the call tells TypeScript: "This will never be null."
//   Without `!`, TypeScript would error: "null is not assignable to Container."
//
// React.StrictMode is a development-only wrapper that:
//   - Warns about deprecated patterns in the console
//   - Double-invokes some lifecycle methods to catch side-effect bugs
//   - Has NO effect in production builds (zero performance cost)
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
