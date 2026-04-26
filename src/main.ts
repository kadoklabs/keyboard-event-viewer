import { mount } from "svelte";
import "./app.css";
import App from "./App.svelte";

// Force dark mode by default
document.documentElement.classList.add("dark");

const app = mount(App, {
  target: document.getElementById("app")!,
});

export default app;
