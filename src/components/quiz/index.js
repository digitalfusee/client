import React, { useState, useEffect } from "react";
import { createAPIEndpoint, ENDPOINTS } from "../../api";
import QuizCard from "./QuizCard";
import { Grid, Grow } from "@mui/material";

const QuizList = ({ courseId }) => {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    createAPIEndpoint(ENDPOINTS.quizzes)
      .fetchByCourseId(courseId)
      .then((res) => setQuizzes(res.data))
      .catch((err) => console.log(err));
  }, [courseId]);

  return (
    <Grid container spacing={3}>
      {quizzes.map((quiz) => (
        <Grid item key={quiz.id} xs={12} sm={6} md={4}>
          <Grow in={true} timeout={500}>
            <div>
              <Grid container>
                <QuizCard courseId={courseId} quizId={quiz.id} />
              </Grid>
            </div>
          </Grow>
        </Grid>
      ))}
    </Grid>
  );
};

export default QuizList;
