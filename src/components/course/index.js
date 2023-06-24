import React, { useState, useEffect } from "react";
import useStateContext from "../../hooks/useStateContext";
import { createAPIEndpoint, ENDPOINTS } from "../../api";
import { useNavigate } from "react-router-dom";
import CourseCard from "./CourseCard";
import { Grid, Zoom, TextField, Button, MenuItem } from "@mui/material";

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");

  const { context } = useStateContext();
  const navigate = useNavigate();

  useEffect(() => {
    createAPIEndpoint(ENDPOINTS.courses)
      .fetchAll()
      .then((res) => setCourses(res.data))
      .catch((err) => console.log(err));
  }, [selectedCategory, selectedDifficulty, selectedPlatform]);

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCategory === "" || course.category === selectedCategory) &&
      (selectedDifficulty === "" || course.difficulty === selectedDifficulty) &&
      (selectedPlatform === "" || course.platform === selectedPlatform)
  );

  const handleAddCourse = () => {
    navigate(`/instructor/courses/add`);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleDifficultyChange = (event) => {
    setSelectedDifficulty(event.target.value);
  };

  const handlePlatformChange = (event) => {
    setSelectedPlatform(event.target.value);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ width: "90%" }}>
        {context.isInstructor && context.id && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddCourse}
            sx={{ float: "right", mb: 2 }}
          >
            Add a Course
          </Button>
        )}

        <TextField
          label="Search courses"
          variant="outlined"
          fullWidth
          margin="normal"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <TextField
              select
              label="Category"
              value={selectedCategory}
              onChange={handleCategoryChange}
              variant="outlined"
              fullWidth
              margin="normal"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Business">Business</MenuItem>
              <MenuItem value="Social">Social</MenuItem>
              <MenuItem value="Tools">Tools</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              select
              label="Difficulty"
              value={selectedDifficulty}
              onChange={handleDifficultyChange}
              variant="outlined"
              fullWidth
              margin="normal"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Beginner">Beginner</MenuItem>
              <MenuItem value="Intermediate">Intermediate</MenuItem>
              <MenuItem value="Advanced">Advanced</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              select
              label="Platform"
              value={selectedPlatform}
              onChange={handlePlatformChange}
              variant="outlined"
              fullWidth
              margin="normal"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="iOS">iOS</MenuItem>
              <MenuItem value="Android">Android</MenuItem>
              <MenuItem value="Mac">Mac</MenuItem>
              <MenuItem value="Windows">Windows</MenuItem>
            </TextField>
          </Grid>
        </Grid>
        <br />

        <Grid container spacing={3}>
          {filteredCourses.map((course) => (
            <Grid item key={course.id} xs={12} sm={6} md={4}>
              <Zoom in={true} style={{ transitionDelay: "200ms" }}>
                <div>
                  <CourseCard courseId={course.id} />
                </div>
              </Zoom>
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
};

const PublicCourses = () => {
  return <CourseList />;
};

const InstructorCourses = () => {
  return <CourseList />;
};

export { PublicCourses, InstructorCourses };
