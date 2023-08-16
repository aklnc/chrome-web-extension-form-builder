import React, { useState, useEffect } from "react";
import { InputGroup, Dropdown, Button, Table } from "react-bootstrap";

import "./SelectionView.css";

const SelectionView = () => {
  const [selectionData, setSelectionData] = useState<string[] | null>(null);
  const [fields, setFields] = useState<string[] | null>(null);
  const [selectionSet, setSelectionSet] = useState<
    { key: string; value: string }[]
  >([{ key: "", value: "" }]);
  const [changeCount, setChangeCount] = useState(0);
  const [step, setStep] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);
  const [fieldSelected, setFieldSelected] = useState(false);

  useEffect(() => {
    chrome.storage.sync.get(["selection", "fields"], (result) => {
      setSelectionData(result.selection);
      setFields(result.fields);
    });
  }, [changeCount]);

  const SelectionDataDeleteHandler = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: number
  ) => {
    e.preventDefault();

    if (selectionData) {
      let tempSelectionData = [...selectionData];

      tempSelectionData.splice(id, 1);
      setSelectionData(tempSelectionData);
      chrome.storage.sync.set({ selection: tempSelectionData });
      setChangeCount(changeCount + 1);
    }
  };

  const SelectionDataContinueHandler = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    let currentStep = step;
    setStep(currentStep + 1);

    if (currentStep === 0) {
      let tempDataset: { key: string; value: string }[] = [];
      selectionData!.map((data) => {
        tempDataset.push({ key: "", value: data });
      });
      setSelectionSet(tempDataset);
    }
    if (currentStep === 2) {
      let tempDataset = [...selectionSet];
      let notEmptyFieldData = tempDataset.filter((data) => data.key !== "");
      notEmptyFieldData.length > 0
        ? setFieldSelected(true)
        : setFieldSelected(false);
    }
  };

  const SelectionDataChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    e.preventDefault();

    if (selectionData) {
      let tempSelectionData = [...selectionData];

      tempSelectionData[id] = e.target.value;
      setSelectionData(tempSelectionData);
      chrome.storage.sync.set({ selection: tempSelectionData });
      setChangeCount(changeCount + 1);
    }
  };

  const SetFieldHandler = (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    ind: number,
    field: string
  ) => {
    e.preventDefault();

    let tempDataset: { key: string; value: string }[] = [...selectionSet];

    let attainedOldField = tempDataset.filter((data) => data.key === field)[0];

    if (attainedOldField) {
      attainedOldField.key = "";
    }

    tempDataset[ind].key = field;

    setSelectionSet(tempDataset);
  };

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

  const SaveToDatasetHandler = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setIsDisabled(true);

    chrome.storage.sync.get(["dataset"]).then((result) => {
      let dataset: { key: string; value: string }[][] = result.dataset;

      let tempDataset = [...selectionSet];

      let filteredDataset = tempDataset.filter((data) => data.key !== "");
      dataset.push(filteredDataset);

      chrome.storage.sync.set({ dataset });
      chrome.storage.sync.set({ selection: [] });
      setSelectionData(null);

      setTimeout(() => {
        setIsDisabled(false);
      }, 1000);
    });
  };

  return (
    <React.Fragment>
      {selectionData && selectionData.length !== 0 ? (
        <>
          {step === 0 ? (
            selectionData.map((data, ind) => (
              <div key={`select_data0_${ind}`} className="selection-data">
                <InputGroup className="mb-3">
                  <Button
                    variant="danger"
                    onClick={(e) => {
                      SelectionDataDeleteHandler(e, ind);
                    }}
                  >
                    <i className="fa-solid fa-x"></i>
                  </Button>
                  <input
                    className="form-control"
                    placeholder="empty"
                    value={data}
                    onChange={(e) => {
                      SelectionDataChangeHandler(e, ind);
                    }}
                  />
                </InputGroup>
              </div>
            ))
          ) : step === 1 ? (
            fields && fields[0] ? (
              fields.length !== 0 ? (
                selectionData.map((data, ind) => (
                  <div
                    key={`select_data1_${ind}`}
                    className="border m-3 p-2 text-center"
                  >
                    <Dropdown>
                      <Dropdown.Toggle variant="success">
                        {selectionSet[0].value === ""
                          ? selectionSet[0].key
                          : selectionSet[ind].key}
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        {fields.map((field, ind2) => (
                          <Dropdown.Item
                            key={`field_${ind}_${ind2}`}
                            onClick={(e) => SetFieldHandler(e, ind, field)}
                          >
                            {field}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                    <p>{data}</p>
                  </div>
                ))
              ) : (
                <p className="error-text text-danger">
                  Please add field names from options page to match fields with
                  collected data...
                </p>
              )
            ) : (
              <p className="error-text text-danger">
                Please add field names from options page to match fields with
                collected data...
              </p>
            )
          ) : step === 2 ? (
            <div className="fields text-center">
              <div className="attained-fields">
                <h4>Attained Fields</h4>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Field</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectionSet.map(
                      (data, ind) =>
                        data.key !== "" && (
                          <tr key={`tr_${ind}`}>
                            <td>{data.key}</td>
                            <td>{data.value}</td>
                          </tr>
                        )
                    )}
                  </tbody>
                </Table>
              </div>
              <div className="not-atttained-fields">
                <h4>Not Attained Fields</h4>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectionSet.map(
                      (data, ind) =>
                        data.key === "" && (
                          <tr key={`tr_${ind}`}>
                            <td>{data.value}</td>
                          </tr>
                        )
                    )}
                  </tbody>
                </Table>
              </div>
            </div>
          ) : fieldSelected ? (
            JsonBeautifier(selectionSet)
          ) : (
            <div>
              <p className="error-text text-danger">
                Please select fields to add dataset...
              </p>
            </div>
          )}
          <div className="continue-container">
            {step > 0 && (
              <Button
                id="previous"
                variant="warning"
                onClick={() => setStep(step - 1)}
                disabled={isDisabled}
              >
                Previous
              </Button>
            )}
            {step < 3 ? (
              step === 1 ? (
                fields && fields[0] && (
                  <Button
                    id="continue"
                    variant="warning"
                    onClick={(e) => {
                      SelectionDataContinueHandler(e);
                    }}
                  >
                    Continue
                  </Button>
                )
              ) : (
                <Button
                  id="continue"
                  variant="warning"
                  onClick={(e) => {
                    SelectionDataContinueHandler(e);
                  }}
                >
                  Continue
                </Button>
              )
            ) : (
              <Button
                id="continue"
                variant="success"
                onClick={(e) => {
                  SaveToDatasetHandler(e);
                }}
                disabled={isDisabled || !fieldSelected}
              >
                Save to dataset
              </Button>
            )}
          </div>
        </>
      ) : (
        <p className="error-text text-danger">
          Please push data to build a form element. You can push data with right
          click on selected text.
        </p>
      )}
    </React.Fragment>
  );
};

export default SelectionView;
