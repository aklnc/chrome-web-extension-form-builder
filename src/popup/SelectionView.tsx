import React, { useState, useEffect } from "react";

const SelectionView = () => {
  const [selectionData, setSelectionData] = useState([""]);
  const [changeCount, setChangeCount] = useState(0);

  useEffect(() => {
    chrome.storage.sync.get(["selection"], (result) => {
      setSelectionData(result.selection);
    });
  }, [changeCount]);

  const SelectionDataDeleteHandler = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: number
  ) => {
    e.preventDefault();

    let tempSelectionData = [...selectionData];

    tempSelectionData.splice(id, 1);
    setSelectionData(tempSelectionData);
    chrome.storage.sync.set({ selection: tempSelectionData });
    setChangeCount(changeCount + 1);
  };

  const SelectionDataChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    e.preventDefault();
    let tempSelectionData = [...selectionData];

    tempSelectionData[id] = e.target.value;
    setSelectionData(tempSelectionData);
    chrome.storage.sync.set({ selection: tempSelectionData });
    setChangeCount(changeCount + 1);
  };

  return (
    <React.Fragment>
      {selectionData.length !== 0 ? (
        selectionData.map((data, ind) => (
          <div key={`select_data_${ind}`} className="row selection-data">
            <button
              className="col-2"
              onClick={(e) => {
                SelectionDataDeleteHandler(e, ind);
              }}
            >
              <i className="fa-solid fa-x"></i>
            </button>
            <input
              className="col-10"
              value={data}
              onChange={(e) => {
                SelectionDataChangeHandler(e, ind);
              }}
            ></input>
          </div>
        ))
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
