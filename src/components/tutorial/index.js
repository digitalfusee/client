import React, { useState, useEffect } from "react";
import { createAPIEndpoint, ENDPOINTS } from "../../api";
import TutorialCard from "./TutorialCard";
import { Grid, Grow } from "@mui/material";

const TutorialsList = ({ courseId }) => {
  const [tutorials, setTutorials] = useState([]);

  useEffect(() => {
    createAPIEndpoint(ENDPOINTS.tutorials)
      .fetchByCourseId(courseId)
      .then((res) => setTutorials(res.data))
      .catch((err) => console.log(err));
  }, [courseId]);

  return (
    <Grid container spacing={3}>
      {tutorials.map((tutorial) => (
        <Grid item key={tutorial.id} xs={12} sm={6} md={4}>
          <Grow in={true} timeout={500}>
            <div>
              <TutorialCard courseId={courseId} tutorialId={tutorial.id} />
            </div>
          </Grow>
        </Grid>
      ))}
    </Grid>
  );
};

export default TutorialsList;
