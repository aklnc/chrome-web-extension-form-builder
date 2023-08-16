import React, { useState, useEffect } from "react";
import { Accordion, ButtonGroup, Button, Modal } from "react-bootstrap";

import "./DatasetView.css";

const DatasetView = () => {
  const [dataset, setDataset] = useState<{ key: string; value: string }[][]>([
    [{ key: "", value: "" }],
  ]);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    chrome.storage.sync.get(["dataset"], (result) => {
      setDataset(result.dataset);
    });
  }, []);

  const JsonBeautifier = (
    set: {
      key: string;
      value: string;
    }[]
  ) => {
    let JSONFormattedDataset = (
      <div className="json-beautifier">
        <p>{"{"}</p>
        {set.map(
          (data) =>
            data.key !== "" && (
              <p className="text-break fw-bold key-value">
                <span className="text-success">"{data.key}"</span>:
                <span className="text-info"> "{data.value}"</span>
              </p>
            )
        )}
        <p>{"}"}</p>
      </div>
    );

    return JSONFormattedDataset;
  };

  const ClearDatabaseHandler = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setDataset([[{ key: "", value: "" }]]);
    chrome.storage.sync.set({ dataset: [] });
    handleClose();
  };

  const DeleteDataHandler = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ind: number
  ) => {
    e.preventDefault();

    let tempDataset = [...dataset];
    tempDataset.splice(ind, 1);

    chrome.storage.sync.set({ dataset: tempDataset });
    setDataset(tempDataset);
  };

  const SaveDatasetHandler = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
        JSON.stringify(dataset)
      )}`;
      const link = document.createElement("a");
      link.href = jsonString;
      link.download = "data.json";
  
      link.click();
  };

  return dataset.length > 0 && dataset[0][0].key !== "" ? (
    <div className="dataset">
      <ButtonGroup className="button-group">
        <Button variant="danger" size="sm" onClick={handleShow}>
          Clear All Dataset
        </Button>
        <Button
          variant="success"
          size="sm"
          onClick={(e) => {
            SaveDatasetHandler(e);
          }}
        >
          Save Dataset
        </Button>
      </ButtonGroup>
      {dataset.map((data, ind) => (
        <Accordion key={`data_${ind}`}>
          <Accordion.Item eventKey={"" + ind}>
            <Accordion.Header>
              "{data[0].key}": "{data[0].value}"
            </Accordion.Header>
            <Accordion.Body>
              <Button
                variant="danger"
                onClick={(e) => {
                  DeleteDataHandler(e, ind);
                }}
              >
                Delete this data
              </Button>
              {JsonBeautifier(data)}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      ))}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Upps! You're about a big deal!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Would you really like to delete all dataset you have collected?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={(e) => {
              ClearDatabaseHandler(e);
            }}
          >
            Clear All
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  ) : (
    <div className="error-div">
      <p className="text-danger">
        The dataset is empty for now! Add data to see dataset...
      </p>
    </div>
  );
};

export default DatasetView;
