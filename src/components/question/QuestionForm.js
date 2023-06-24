import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Alert,
  Typography,
  Checkbox,
  Divider,
} from "@mui/material";
import { createAPIEndpoint, ENDPOINTS } from "../../api";

export default function QuestionForm({ courseId, quizId }) {
  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState({
    quizId: quizId,
    questionText: "",
    choices: [
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ],
  });
  const [alert, setAlert] = useState({
    open: false,
    severity: "",
    message: "",
  });
  const [isUpdate, setIsUpdate] = useState(false);

  useEffect(() => {
    if (quizId) {
      fetchQuestions();
    }
  }, [quizId]);

  const fetchQuestions = () => {
    createAPIEndpoint(ENDPOINTS.questions)
      .fetchQuestions(courseId, quizId)
      .then((res) => {
        setQuestions(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setQuestion((prevQuestion) => ({
      ...prevQuestion,
      [name]: value,
    }));
  };

  const handleChoiceChange = (event, index) => {
    const { value } = event.target;
    setQuestion((prevQuestion) => {
      const choices = [...prevQuestion.choices];
      if (!choices[index]) {
        // create new choice object if it doesn't exist yet
        choices[index] = { text: "", isCorrect: false };
      }
      choices[index].text = value;
      return {
        ...prevQuestion,
        choices,
      };
    });
  };

  const handleCorrectChange = (index) => {
    setQuestion((prevQuestion) => {
      const choices = prevQuestion.choices.map((c, i) => {
        if (i === index) {
          return { ...c, isCorrect: true };
        } else {
          return { ...c, isCorrect: false };
        }
      });
      return {
        ...prevQuestion,
        choices,
      };
    });
  };

  const handleSave = () => {
    if (
      !question.questionText ||
      !question.choices.every((c) => c.text && c.text.trim())
    ) {
      return;
    }

    if (!question.choices.some((c) => c.isCorrect)) {
      setAlert({
        open: true,
        severity: "error",
        message: "At least one choice must be correct.",
      });
      return;
    }

    const newQuestion = {
      QuizId: quizId,
      QuestionText: question.questionText,
      Choices: question.choices
        .filter((c) => c.text && c.text.trim())
        .map((c) => ({ Text: c.text, isCorrect: c.isCorrect })),
    };

    createAPIEndpoint(ENDPOINTS.questions)
      .postQuestion(courseId, quizId, newQuestion)
      .then((res) => {
        setQuestions([...questions, res.data]);
        setQuestion({
          quizId: quizId,
          questionText: "",
          choices: [
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
          ],
        });
        setAlert({
          open: true,
          severity: "success",
          message: "Question saved successfully.",
        });
      })
      .catch((err) => {
        setAlert({
          open: true,
          severity: "error",
          message: "Failed to save question. Please try again.",
        });
      });
  };

  const handleDelete = (questionId) => {
    createAPIEndpoint(ENDPOINTS.questions)
      .deleteQuestion(courseId, quizId, questionId)
      .then(() => {
        setQuestions(questions.filter((q) => q.id !== questionId));
        setAlert({
          open: true,
          severity: "success",
          message: "Question deleted successfully.",
        });
      })
      .catch((err) => {
        setAlert({
          open: true,
          severity: "error",
          message: "Failed to delete question. Please try again.",
        });
      });
  };

  const handleUpdate = (questionId, updatedRecord) => {
    createAPIEndpoint(ENDPOINTS.questions)
      .putQuestion(courseId, quizId, questionId, updatedRecord)
      .then(() => {
        fetchQuestions();
        setAlert({
          open: true,
          severity: "success",
          message: "Question updated successfully.",
        });
      })
      .catch((err) => {
        setAlert({
          open: true,
          severity: "error",
          message: "Failed to update question. Please try again.",
        });
      });
  };

  const handleCloseAlert = () => {
    setAlert({ open: false, severity: "", message: "" });
  };

  const handleEditClick = (questionId) => {
    setIsUpdate(questionId);
    const selectedQuestion = questions.find((q) => q.id === questionId);
    setQuestion({
      ...selectedQuestion,
      choices: selectedQuestion.choices.concat(
        Array.from({ length: 4 - selectedQuestion.choices.length }, () => ({
          text: "",
          isCorrect: false,
        }))
      ),
    });
  };

  return (
    <div>
      {alert.open && (
        <Alert
          severity={alert.severity}
          variant="filled"
          onClose={handleCloseAlert}
          open={alert.open}
        >
          {alert.message}
        </Alert>
      )}
      {questions.length > 0 && (
        <div>
          {questions.map((q) => (
            <div key={q.id}>
              {isUpdate === q.id ? (
                <div>
                  <TextField
                    name="questionText"
                    label="Question Text"
                    value={question.questionText}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                  />
                  {question.choices.map((choice, index) => (
                    <div key={index}>
                      <TextField
                        label={`Choice ${index + 1}`}
                        value={choice.text}
                        onChange={(e) => handleChoiceChange(e, index)}
                        fullWidth
                        margin="normal"
                      />
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Checkbox
                          checked={choice.isCorrect}
                          onChange={() => handleCorrectChange(index)}
                        />
                        <Typography variant="body2">Is Correct</Typography>
                      </div>
                    </div>
                  ))}
                  <div style={{ textAlign: "right" }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleUpdate(q.id, question)}
                    >
                      Update
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <TextField
                    name="questionText"
                    label="Question Text"
                    value={q.questionText}
                    disabled
                    fullWidth
                    margin="normal"
                    multiline
                    rows={2}
                  />
                  {q.choices.map((c, index) => (
                    <div key={index}>
                      <TextField
                        label={`Choice ${index + 1}`}
                        value={c.text}
                        disabled
                        fullWidth
                        margin="normal"
                      />
                    </div>
                  ))}
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleEditClick(q.id)}
                      style={{ marginRight: "0.5rem" }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDelete(q.id)}
                      style={{ marginRight: "0.5rem" }}
                    >
                      Delete
                    </Button>
                  </div>
                  <Divider style={{ margin: "1rem 0" }} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <TextField
        name="questionText"
        label="Question Text"
        value={question.questionText}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
        multiline
        rows={2}
      />
      {question.choices.map((choice, index) => (
        <div key={index}>
          <TextField
            label={`Choice ${index + 1}`}
            value={choice.text}
            onChange={(e) => handleChoiceChange(e, index)}
            fullWidth
            margin="normal"
          />
          <div style={{ display: "flex", alignItems: "center" }}>
            <Checkbox
              checked={choice.isCorrect}
              onChange={() => handleCorrectChange(index)}
            />
            <Typography variant="body2">Correct</Typography>
          </div>
        </div>
      ))}
      <div style={{ textAlign: "right", marginTop: "1rem" }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleSave}
          style={{ marginLeft: "0.5rem" }}
        >
          Save New Question
        </Button>
      </div>
    </div>
  );
}
