import React, { useState, useEffect } from "react";
import { InputGroup, Dropdown, Button } from "react-bootstrap";

import "./SelectionView.css";

const SelectionView = () => {
  const [selectionData, setSelectionData] = useState<string[] | null>(null);
  const [fields, setFields] = useState<string[] | null>(null);
  const [dataset, setDataset] = useState<{ key: string; value: string }[]>([
    { key: "", value: "" },
  ]);
  const [changeCount, setChangeCount] = useState(0);
  const [step, setStep] = useState(0);

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

    let tempDataset: { key: string; value: string }[] = [...dataset];
    tempDataset[ind].key = field;

    setDataset(tempDataset);
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
            fields ? (
              fields.length !== 0 ? (
                selectionData.map((data, ind) => (
                  <div key={`select_data1_${ind}`} className="border m-3 p-2 text-center">
                    <Dropdown>
                      <Dropdown.Toggle variant="success">
                        {dataset[0].value === ""
                          ? dataset[0].key
                          : dataset[ind].key}
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
          ) : (
            <p>step2</p>
          )}
          <div className="continue-container">
            {step > 0 && (
              <Button
                id="previous"
                variant="warning"
                onClick={() => setStep(step - 1)}
              >
                Previous
              </Button>
            )}
            <Button
              id="continue"
              variant="warning"
              onClick={() => {
                setStep(step + 1);
                let tempDataset: { key: string; value: string }[] = [];
                selectionData!.map((data) => {
                  tempDataset.push({ key: "", value: data });
                });
                setDataset(tempDataset);
              }}
            >
              Continue
            </Button>
          </div>
        </>
      ) : (
        <p>
          Please push data to build a form element. You can push data with right
          click on selected text.
        </p>
      )}
    </React.Fragment>
  );
};

export default SelectionView;

/*

<div key={`select_data_${ind}`} className="row selection-data">
            <Button
              className="col-2"
              variant="danger"
              onClick={(e) => {
                SelectionDataDeleteHandler(e, ind);
              }}
            >
              <i className="fa-solid fa-x"></i>
            </Button>
            <input
              className="col-10"
              value={data}
              onChange={(e) => {
                SelectionDataChangeHandler(e, ind);
              }}
            ></input>
          </div>

*/
