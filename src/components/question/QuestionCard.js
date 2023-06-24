import React, { useState, useEffect } from "react";
import { createAPIEndpoint, ENDPOINTS } from "../../api";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  Button,
} from "@mui/material";

const QuestionCard = ({
  courseId,
  quizId,
  questionId,
  handleAnswerSubmit,
  isLastQuestion,
  handleQuizSubmit,
  score,
  handleScoreUpdate,
}) => {
  const [question, setQuestion] = useState(null);
  const [selectedChoice, setSelectedChoice] = useState("");
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    createAPIEndpoint(ENDPOINTS.questions)
      .fetchQuestion(courseId, quizId, questionId)
      .then((res) => setQuestion(res.data))
      .catch((err) => console.log(err));
  }, [courseId, quizId, questionId]);

  const handleChoiceSelection = (choice) => {
    setSelectedChoice(choice);
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [question.id]: choice,
    }));
  };

  const handleSubmit = () => {
    handleAnswerSubmit(question.id, selectedChoice);
    handleScoreUpdate();
  };

  // const handleFinalSubmit = () => {
  //   handleQuizSubmit(answers);
  // };

  if (!question) {
    return null;
  }

  return (
    <FormControl component="fieldset">
      <Typography variant="h6" gutterBottom>
        {question.questionText}
      </Typography>
      <RadioGroup
        aria-label="quiz"
        name="quiz"
        value={selectedChoice}
        onChange={(event) => handleChoiceSelection(event.target.value)}
      >
        {question.choices.map((choice, index) => (
          <FormControlLabel
            key={index}
            value={choice.text}
            control={<Radio />}
            label={choice.text}
          />
        ))}
      </RadioGroup>
      <br />
      {isLastQuestion ? (
        <Button onClick={handleSubmit}>Submit Quiz</Button>
      ) : (
        <Button onClick={handleSubmit}>Next</Button>
      )}
      <br />
      <Typography variant="h6" gutterBottom>
        Current Score: {score}
      </Typography>
    </FormControl>
  );
};

export default QuestionCard;
