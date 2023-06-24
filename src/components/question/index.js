import React, { useState, useEffect } from "react";
import { createAPIEndpoint, ENDPOINTS } from "../../api";
import { Box, Typography } from "@mui/material";
import QuestionCard from "./QuestionCard";

const QuestionList = ({ courseId, quizId }) => {
  const [questions, setQuestions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [showCongratulations, setShowCongratulations] = useState(false);

  useEffect(() => {
    if (courseId && quizId) {
      createAPIEndpoint(ENDPOINTS.questions)
        .fetchQuestions(courseId, quizId)
        .then((res) => setQuestions(res.data))
        .catch((err) => console.log(err));
    }
  }, [courseId, quizId]);

  const handleAnswerSubmit = (questionId, selectedChoice = "") => {
    const question = questions.find((q) => q.id === questionId);
    const correctAnswer = question.choices.find((choice) => choice.isCorrect);
    if (selectedChoice === correctAnswer.text) {
      setScore((prevScore) => prevScore + 1);
    }
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      setQuizSubmitted(true);
    }
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [question.id]: selectedChoice,
    }));
  };

  const handleQuizSubmit = () => {
    const totalScore = questions.reduce((score, question) => {
      if (
        question.choices.find((choice) => choice.isCorrect).text ===
        answers[question.id]
      ) {
        return score + 1;
      } else {
        console.log(
          `Question ${question.id}: expected "${
            question.choices.find((choice) => choice.isCorrect).text
          }", got "${answers[question.id]}"`
        );
        return score;
      }
    }, 0);
    setScore(totalScore);
    console.log(`Total score: ${totalScore} / ${questions.length}`);
    setQuizSubmitted(true);
    setShowCongratulations(totalScore === questions.length);
  };

  const handleScoreUpdate = () => {
    setScore((prevScore) => prevScore);
  };

  if (questions.length === 0) {
    return <Typography>No questions found.</Typography>;
  }

  if (quizSubmitted) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Final Score: {score} / {questions.length}
        </Typography>
      </Box>
    );
  }

  return (
    <QuestionCard
      courseId={courseId}
      quizId={quizId}
      questionId={questions[questionIndex].id}
      handleAnswerSubmit={handleAnswerSubmit}
      isLastQuestion={questionIndex === questions.length - 1}
      handleQuizSubmit={handleQuizSubmit}
      score={score}
      handleScoreUpdate={handleScoreUpdate}
    />
  );
};

export default QuestionList;
