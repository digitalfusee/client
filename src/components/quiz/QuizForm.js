import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { createAPIEndpoint, ENDPOINTS } from "../../api";
import QuestionForm from "../question/QuestionForm";

export default function QuizForm({ courseId, quizId, handleEditConfirm }) {
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState({
    courseId: courseId,
    title: "",
    description: "",
  });
  const [alert, setAlert] = useState({
    open: false,
    severity: "",
    message: "",
  });
  const [openQuestionForm, setOpenQuestionForm] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [questions, setQuestions] = useState([]);

  const fetchQuestions = () => {
    setLoading(true);
    createAPIEndpoint(ENDPOINTS.questions)
      .fetchQuestions(courseId, quizId)
      .then((res) => {
        setLoading(false);
        setQuestions(res.data);
      })
      .catch((err) => console.log(err));
  };

  const loadQuiz = () => {
    setLoading(true);
    createAPIEndpoint(ENDPOINTS.quizzes)
      .fetchQuiz(courseId.toString(), quizId)
      .then((res) => {
        setLoading(false);
        setQuiz(res.data);
        setShowButtons(true);
        fetchQuestions();
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (quizId) {
      setIsUpdate(true);
      loadQuiz();
    } else {
      setIsUpdate(false);
      setLoading(false);
      setShowButtons(true);
    }
  }, [quizId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      [name]: value,
    }));
  };

  const handleSave = () => {
    setLoading(true);
    if (quizId) {
      createAPIEndpoint(ENDPOINTS.quizzes)
        .putQuiz(courseId, quizId, quiz)
        .then((res) => {
          setLoading(false);
          setOpenQuestionForm(false);
          handleEditConfirm(quiz); // Pass the updated quiz data
        })
        .catch((err) => {
          setAlert({
            open: true,
            severity: "error",
            message: "Failed to update quiz.",
          });
          setLoading(false);
          console.log(err);
        });
    } else {
      createAPIEndpoint(ENDPOINTS.quizzes)
        .postQuiz(courseId, quiz)
        .then((res) => {
          setAlert({
            open: true,
            severity: "success",
            message: "Quiz added successfully.",
          });
          setLoading(false);
          setOpenQuestionForm(false);
          // Update the quiz state in the parent component
          handleModelUpdate(res.data);
        })
        .catch((err) => {
          setAlert({
            open: true,
            severity: "error",
            message: "Failed to add quiz.",
          });
          setLoading(false);
          console.log(err);
        });
    }
  };

  const handleModelUpdate = (model) => {
    setQuiz(model);
    fetchQuestions(); // Fetch updated questions after model update
  };

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlert({
      ...alert,
      open: false,
    });
  };

  const handleOpenDialog = () => {
    setOpenQuestionForm(true);
  };

  const handleCloseDialog = () => {
    setOpenQuestionForm(false);
  };

  return (
    <div>
      {alert.open && (
        <Alert
          open={alert.open}
          severity={alert.severity}
          onClose={handleAlertClose}
        >
          {alert.message}
        </Alert>
      )}

      <TextField
        name="title"
        label="Title"
        value={quiz.title}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        name="description"
        label="Description"
        value={quiz.description}
        onChange={handleChange}
        fullWidth
        multiline
        rows={3}
        margin="normal"
      />
      {showButtons && (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            onClick={handleOpenDialog}
            disabled={loading}
            style={{ marginTop: "1rem", marginLeft: "1rem" }}
          >
            {isUpdate ? "Update Questions" : "Add Questions"}
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading}
            style={{ marginTop: "1rem", marginLeft: "1rem" }}
          >
            {isUpdate ? "Update Quiz" : "Save Quiz"}
          </Button>
        </div>
      )}

      <Dialog open={openQuestionForm} onClose={handleCloseDialog} fullWidth>
        <DialogTitle>
          {isUpdate ? "Update Questions" : "Add Questions"}
        </DialogTitle>
        <DialogContent>
          <QuestionForm
            courseId={courseId}
            quizId={quizId}
            handleEditConfirm={handleModelUpdate}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} color="primary" disabled={loading}>
            {isUpdate ? "Update Quiz" : "Save Quiz"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
