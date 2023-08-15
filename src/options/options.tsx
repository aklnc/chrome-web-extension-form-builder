import React from "react";
import { createRoot } from "react-dom/client";

import "bootstrap/dist/css/bootstrap.min.css";

import App from "./App";
import './options.css'

const fontAwesomeLink = document.createElement("link");
fontAwesomeLink.rel = "stylesheet";
fontAwesomeLink.href =
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css";
fontAwesomeLink.integrity =
  "sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA==";
fontAwesomeLink.crossOrigin = "anonymous";
fontAwesomeLink.referrerPolicy = "no-referrer";

document.head.appendChild(fontAwesomeLink);

const app = document.createElement("div");
app.id = "root";
document.body.appendChild(app);

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(<App />);
