import React, { useEffect, useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";

const App = () => {
  const [fields, setFields] = useState<string[] | null>(null);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    chrome.storage.sync.get(["fields"], (result) => {
      setFields(result.fields);
    });
  }, []);

  const FieldAddHandler = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    if (fields && fields.length !== 0) {
      let tempFields = [...fields];
      tempFields.push("");
      setFields(tempFields);
    } else {
      setFields([""]);
    }
  };

  const FieldDeleteHandler = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ind: number
  ) => {
    e.preventDefault();

    if (fields) {
      let tempFields = [...fields];
      tempFields.splice(ind, 1);
      setFields(tempFields);
    }
  };

  const FieldChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement>,
    ind: number
  ) => {
    e.preventDefault();

    if (fields) {
      let tempFields = [...fields];
      tempFields[ind] = e.target.value;
      setFields(tempFields);
    }
  };

  const SaveFieldsHandler = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setIsDisabled(true);

    let tempFields: string[] = [];

    if (fields) {
      fields.map((field) => {
        if (field !== "") {
          tempFields.push(field);
        }
      });

      chrome.storage.sync.set({ fields: tempFields });
      setFields(tempFields);
    }
    setTimeout(() => {
      setIsDisabled(false);
    }, 1000);
  };

  return (
    <div className="m-5">
      <h4>Form Builder</h4>
      <Form>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Fields</Form.Label>
          {fields && fields.length > 0 ? (
            fields.map((field, ind) => (
              <InputGroup key={`field_${ind}`} className="mb-3">
                <Button
                  variant="danger"
                  onClick={(e) => {
                    FieldDeleteHandler(e, ind);
                  }}
                  disabled={isDisabled}
                >
                  <i className="fa-solid fa-x"></i>
                </Button>
                <input
                  className="form-control"
                  placeholder="empty"
                  disabled={isDisabled}
                  value={field}
                  onChange={(e) => {
                    FieldChangeHandler(e, ind);
                  }}
                />
              </InputGroup>
            ))
          ) : (
            <p>Please click plus button to add fields.</p>
          )}
        </Form.Group>
        <div className="text-center">
          <Button
            onClick={(e) => {
              FieldAddHandler(e);
            }}
            disabled={isDisabled}
          >
            <i className="fa-solid fa-plus"></i>
          </Button>
        </div>
        <div className="text-center my-3">
          <Button
            variant="success"
            onClick={(e) => SaveFieldsHandler(e)}
            disabled={isDisabled}
          >
            {isDisabled ? "Saving..." : "Save the changes..."}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default App;
