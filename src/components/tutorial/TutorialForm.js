import React, { useState, useEffect } from "react";
import { createAPIEndpoint, ENDPOINTS } from "../../api";
import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from "@mui/material";

const TutorialForm = ({ courseId, tutorialId, handleEditConfirm }) => {
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [hasSteps, setHasSteps] = useState(false);
  const [tutorial, setTutorial] = useState({
    courseId: courseId,
    title: "",
    description: "",
    videoURL: "",
    steps: [{ stepNumber: 1, step: "" }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  const [alert, setAlert] = useState({
    open: false,
    severity: "",
    message: "",
  });
  const [isUpdate, setIsUpdate] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  const loadTutorial = () => {
    setLoading(true);
    createAPIEndpoint(ENDPOINTS.tutorials)
      .fetchTutorial(courseId.toString(), tutorialId)
      .then((res) => {
        setLoading(false);
        setTutorial(res.data);
        setShowButtons(true);
      })
      .catch((err) => console.log(err));
  };

  const updateHasSteps = () => {
    const hasSteps = tutorial.steps.some((step) => step.step.trim() !== "");
    setHasSteps(hasSteps);
  };

  useEffect(() => {
    updateHasSteps();
  }, [tutorial]);

  useEffect(() => {
    if (tutorialId) {
      setIsUpdate(true);
      loadTutorial();
    } else {
      setIsUpdate(false);
      setLoading(false);
      setShowButtons(true);
    }
  }, [tutorialId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "steps") {
      const index = parseInt(event.target.getAttribute("data-index"));
      const steps = [...tutorial.steps];
      steps[index][value.name] = value.value;
      setTutorial((prevTutorial) => ({
        ...prevTutorial,
        steps,
      }));
    } else {
      setTutorial((prevTutorial) => ({
        ...prevTutorial,
        [name]: value,
      }));
    }
  };

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleStepChange = (index, event) => {
    const { name, value } = event.target;
    setTutorial((prevTutorial) => {
      const steps = [...prevTutorial.steps];
      steps[index][name] = value;
      return { ...prevTutorial, steps };
    });
  };

  const handleAddStep = () => {
    setTutorial((prevTutorial) => {
      const nextStepNumber = prevTutorial.steps.length + 1;
      return {
        ...prevTutorial,
        steps: [
          ...prevTutorial.steps,
          { stepNumber: nextStepNumber, step: "" },
        ],
      };
    });
  };

  const handleDeleteStep = (index) => {
    setTutorial((prevTutorial) => {
      const steps = [...prevTutorial.steps];
      steps.splice(index, 1);
      return { ...prevTutorial, steps };
    });
  };

  const handleSave = () => {
    setLoading(true);
    if (tutorialId) {
      createAPIEndpoint(ENDPOINTS.tutorials)
        .putTutorial(courseId, tutorialId, tutorial)
        .then((res) => {
          setLoading(false);
          setOpen(false);
          handleEditConfirm(tutorial); // Pass the updated tutorial data
        })
        .catch((err) => {
          setAlert({
            open: true,
            severity: "error",
            message: "Failed to update tutorial.",
          });
          setLoading(false);
          console.log(err);
        });
    } else {
      createAPIEndpoint(ENDPOINTS.tutorials)
        .postTutorial(courseId, tutorial)
        .then((res) => {
          setAlert({
            open: true,
            severity: "success",
            message: "Tutorial added successfully.",
          });
          setLoading(false);
          setOpen(false);
          // Update the tutorial state in the parent component
          handleModelUpdate(res.data);
        })
        .catch((err) => {
          setAlert({
            open: true,
            severity: "error",
            message: "Failed to add tutorial.",
          });
          setLoading(false);
          console.log(err);
        });
    }
  };

  const handleModelUpdate = (model) => {
    setTutorial(model);
  };

  const controller = {
    handleAddStep,
    handleDeleteStep,
    handleModelUpdate,
  };

  return (
    <div>
      {alert.open && (
        <Alert
          severity={alert.severity}
          onClose={() => setAlert({ open: false })}
        >
          {alert.message}
        </Alert>
      )}

      <TextField
        variant="outlined"
        label="Title"
        name="title"
        value={tutorial.title}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        variant="outlined"
        label="Description"
        name="description"
        value={tutorial.description}
        onChange={handleChange}
        fullWidth
        multiline
        rows={3}
        margin="normal"
        required
      />
      <TextField
        variant="outlined"
        label="Video URL"
        name="videoURL"
        value={tutorial.videoURL}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <Button
        style={{ float: "right", marginTop: "1rem", marginLeft: "1rem" }}
        onClick={handleSave}
      >
        {isUpdate ? "Update Tutorial" : "Save Tutorial"}
      </Button>
      {showButtons && (
        <Button
          onClick={handleOpenDialog}
          style={{ float: "right", marginTop: "1rem" }}
        >
          {isUpdate ? "Update Steps" : "Add Steps"}
        </Button>
      )}
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Add Steps</DialogTitle>
        <DialogContent>
          {tutorial.steps.map((step, index) => (
            <TextField
              key={index}
              label={`Step ${index + 1}`}
              name="step"
              value={step.step}
              onChange={(event) => handleStepChange(index, event)}
              fullWidth
              margin="normal"
              required
            />
          ))}
          <div style={{ marginTop: "1rem", textAlign: "right" }}>
            <Button variant="outlined" color="primary" onClick={handleAddStep}>
              Add Step
            </Button>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave}>
            {isUpdate ? "Update Tutorial" : "Save Tutorial"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TutorialForm;
