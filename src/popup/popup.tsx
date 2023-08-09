import React from "react";
import { createRoot } from "react-dom/client";

import "./popup.css";

import App from "./App";

/// <reference types="chrome"/>

const app = document.createElement("div");
app.id = "root";
document.body.appendChild(app);

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(<App />);
