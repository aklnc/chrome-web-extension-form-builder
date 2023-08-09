import React from "react";
import { createRoot } from "react-dom/client";

import './options.css'

const test = <p>Hello World!</p>;

const app = document.createElement('div')
app.id = 'root'
document.body.appendChild(app)

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(test);
