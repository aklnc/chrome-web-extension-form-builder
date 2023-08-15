import React, { useState, useEffect } from "react";
import { Button, ButtonGroup } from "react-bootstrap";

import "./App.css";

import SelectionView from "./SelectionView";
import DatasetView from "./DatasetView";

const App = () => {
  const [view, setView] = useState("selection");

  return (
    <div className="app">
      <ButtonGroup className="row btn-group" aria-label="Basic example">
        <Button
          className="col-6"
          variant={view === "selection" ? "primary" : "secondary"}
          onClick={(e) => {
            e.preventDefault();
            setView("selection");
          }}
        >
          Selection
        </Button>
        <Button
          className="col-6"
          variant={view === "selection" ? "secondary" : "primary"}
          onClick={(e) => {
            e.preventDefault();
            setView("dataset");
          }}
        >
          Dataset
        </Button>
      </ButtonGroup>

      {view === "selection" ? <SelectionView /> : <DatasetView />}
    </div>
  );
};

export default App;
