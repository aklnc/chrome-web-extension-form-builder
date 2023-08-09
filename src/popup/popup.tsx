import React from "react";
import { createRoot } from "react-dom/client";

import "./popup.css";

/// <reference types="chrome"/>

const test = <img src="icon.png" />;

const app = document.createElement("div");
app.id = "root";
document.body.appendChild(app);

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(test);

