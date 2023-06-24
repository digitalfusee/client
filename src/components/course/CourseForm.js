import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useStateContext from "../../hooks/useStateContext";
import {
  Alert,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  CardActions,
  Grid,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
} from "@mui/material";
import { createAPIEndpoint, ENDPOINTS } from "../../api";
import TutorialForm from "../tutorial/TutorialForm";
import QuizForm from "../quiz/QuizForm";

const CourseForm = ({ isEditMode }) => {
  const { courseId: paramCourseId } = useParams();
  const [courseId, setCourseId] = useState(isEditMode ? paramCourseId : null);
  const { context } = useStateContext();

  const [course, setCourse] = useState({
    instructorId: context.id,
    title: "",
    description: "",
    imageURL: "",
    platform: "",
    category: "",
    difficulty: "",
  });
  const [isSaved, setIsSaved] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [openTutorialFormDialog, setOpenTutorialFormDialog] = useState(false);
  const [openQuizFormzesDialog, setOpenQuizFormzesDialog] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tutorials, setTutorials] = useState([]);
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await createAPIEndpoint(ENDPOINTS.courses).fetchById(
          courseId
        );

        const fetchedCourse = response.data;

        // Update the course state
        const isValidPlatform =
          fetchedCourse.platform &&
          ["ios", "android", "mac", "windows"].includes(fetchedCourse.platform);

        const isValidCategory =
          fetchedCourse.category &&
          ["business", "social", "tools"].includes(fetchedCourse.category);

        const isValidDifficulty =
          fetchedCourse.difficulty &&
          ["beginner", "intermediate", "advanced"].includes(
            fetchedCourse.difficulty
          );

        setCourse({
          ...fetchedCourse,
          platform: isValidPlatform ? fetchedCourse.platform : "",
          category: isValidCategory ? fetchedCourse.category : "",
          difficulty: isValidDifficulty ? fetchedCourse.difficulty : "",
        });

        // Fetch tutorials
        const tutorialsResponse = await createAPIEndpoint(
          ENDPOINTS.tutorials
        ).fetchByCourseId(courseId);
        setTutorials(tutorialsResponse.data);

        // Fetch quizzes
        const quizzesResponse = await createAPIEndpoint(
          ENDPOINTS.quizzes
        ).fetchByCourseId(courseId);
        setQuizzes(quizzesResponse.data);

        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    if (isEditMode && courseId) {
      fetchCourse();
    } else {
      setLoading(false);
    }
  }, [isEditMode, courseId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCourse((prevCourse) => ({
      ...prevCourse,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (isEditMode) {
      updateCourse();
    } else {
      saveCourse();
    }
  };

  const saveCourse = () => {
    createAPIEndpoint(ENDPOINTS.courses)
      .post(course)
      .then((res) => {
        setIsSaved(true);
        setCourseId(res.data.id);
      })
      .catch((error) => {
        setError(error);
      });
  };

  const updateCourse = () => {
    createAPIEndpoint(ENDPOINTS.courses)
      .put(courseId, course)
      .then(() => {
        setIsUpdated(true);
      })
      .catch((error) => {
        setError(error);
      });
  };

  const handleCloseTutorialFormDialog = () => {
    setOpenTutorialFormDialog(false);
  };

  const handleCloseQuizFormzesDialog = () => {
    setOpenQuizFormzesDialog(false);
  };

  const handleTutorialForm = () => {
    setOpenTutorialFormDialog(true);
  };

  const handleQuizFormzes = () => {
    setOpenQuizFormzesDialog(true);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        {isSaved && (
          <Alert severity="success">Course saved successfully!</Alert>
        )}
        {isUpdated && (
          <Alert severity="success">Course updated successfully!</Alert>
        )}
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Title"
                  name="title"
                  value={course.title}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Description"
                  name="description"
                  value={course.description}
                  onChange={handleChange}
                  multiline
                  rows={4}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Image URL"
                  name="imageURL"
                  value={course.imageURL}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Platform</InputLabel>
                  <Select
                    name="platform"
                    value={course.platform}
                    onChange={handleChange}
                    label="Platform"
                  >
                    <MenuItem value="iOS">iOS</MenuItem>
                    <MenuItem value="Android">Android</MenuItem>
                    <MenuItem value="Mac">Mac</MenuItem>
                    <MenuItem value="Windows">Windows</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={course.category}
                    onChange={handleChange}
                    label="Category"
                  >
                    <MenuItem value="Business">Business</MenuItem>
                    <MenuItem value="Social">Social</MenuItem>
                    <MenuItem value="Tools">Tools</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Difficulty</InputLabel>
                  <Select
                    name="difficulty"
                    value={course.difficulty}
                    onChange={handleChange}
                    label="Difficulty"
                  >
                    <MenuItem value="Beginner">Beginner</MenuItem>
                    <MenuItem value="Intermediate">Intermediate</MenuItem>
                    <MenuItem value="Advanced">Advanced</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  fullWidth
                >
                  {isEditMode ? "Update" : "Save"}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Tutorials
            </Typography>

            {tutorials.length > 0 ? (
              tutorials.map((tutorial) => (
                <Box key={tutorial.id} mb={2}>
                  <Typography variant="subtitle1">{tutorial.title}</Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="textSecondary">
                No tutorials found.
              </Typography>
            )}

            <CardActions>
              <Button
                size="small"
                onClick={handleTutorialForm}
                style={{ marginLeft: "auto" }}
              >
                Add Tutorials
              </Button>
            </CardActions>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Quizzes
            </Typography>

            {quizzes.length > 0 ? (
              quizzes.map((quiz) => (
                <Box key={quiz.id} mb={2}>
                  <Typography variant="subtitle1">{quiz.title}</Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="textSecondary">
                No quizzes found.
              </Typography>
            )}

            <CardActions>
              <Button
                size="small"
                onClick={handleQuizFormzes}
                style={{ marginLeft: "auto" }}
              >
                Add Quizzes
              </Button>
            </CardActions>
          </CardContent>
        </Card>
      </Grid>

      <Dialog
        open={openTutorialFormDialog}
        onClose={handleCloseTutorialFormDialog}
      >
        <DialogTitle>Add Tutorial</DialogTitle>
        <DialogContent>
          <TutorialForm
            courseId={courseId}
            handleClose={handleCloseTutorialFormDialog}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTutorialFormDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openQuizFormzesDialog}
        onClose={handleCloseQuizFormzesDialog}
      >
        <DialogTitle>Add Quiz</DialogTitle>
        <DialogContent>
          <QuizForm
            courseId={courseId}
            handleClose={handleCloseQuizFormzesDialog}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseQuizFormzesDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default CourseForm;
