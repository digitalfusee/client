import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createAPIEndpoint, ENDPOINTS } from "../../api";
import useStateContext from "../../hooks/useStateContext";
import {
  Alert,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  CircularProgress,
  Slide,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { makeStyles } from "@mui/styles";
import Tutorials from "../tutorial/index";
import Quizzes from "../quiz/index";

const useStyles = makeStyles({
  root: {
    maxWidth: 800,
    margin: "0 auto",
  },
  media: {
    position: "relative",
    height: 300,
    width: "100%",
    objectFit: "cover",
  },
  fadeOut: {
    opacity: 0.5,
    transition: "opacity 0.5s ease-out",
    pointerEvents: "none",
  },
  actionButtons: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 1,
  },
});

const ViewCourse = () => {
  const classes = useStyles();
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [selectedView, setSelectedView] = useState("tutorials");
  const [open, setOpen] = useState(false);
  const { context } = useStateContext();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleViewChange = (event, newView) => {
    setSelectedView(newView);
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await createAPIEndpoint(ENDPOINTS.courses).fetchById(
          courseId
        );

        if (response.data) {
          setCourse(response.data);
        } else {
          setError("Course not found");
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleDialogOpen = () => {
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  if (loading) {
    return (
      <CardContent>
        <CircularProgress />
      </CardContent>
    );
  }

  if (error) {
    return (
      <CardContent>
        <Alert severity="error">
          {error.message ? error.response.data : "Something went wrong"}
        </Alert>
      </CardContent>
    );
  }

  if (isDeleted) {
    return null;
  }

  const handleEdit = () => {
    navigate(`/instructor/courses/edit/${courseId}`);
  };

  const handleDeleteConfirm = () => {
    setIsDeleting(true);
    handleDialogOpen();
    document.addEventListener("click", handleClickOutside);
  };

  const handleDeleteCancel = () => {
    setIsDeleting(false);
    handleDialogClose();
    document.removeEventListener("click", handleClickOutside);
  };

  const handleClickOutside = (e) => {
    if (e.target.nodeName !== "BUTTON") {
      setIsDeleting(false);
      document.removeEventListener("click", handleClickOutside);
    }
  };

  return (
    <Slide in={true} direction="up" mountOnEnter unmountOnExit>
      <Card className={`${classes.root} ${isDeleting ? classes.fadeOut : ""}`}>
        <CardMedia
          className={classes.media}
          image={course.imageURL}
          title={course.title}
        >
          {context.isInstructor && context.id === course.instructorId && (
            <CardActions className={classes.actionButtons}>
              <IconButton onClick={handleEdit}>
                <EditIcon
                  sx={{
                    color: "primary.main",
                  }}
                />
              </IconButton>
              <IconButton onClick={handleDeleteConfirm}>
                <DeleteIcon
                  sx={{
                    color: "error.main",
                  }}
                />
              </IconButton>
              <Dialog open={open} onClose={handleDialogClose}>
                <DialogTitle>Confirmation</DialogTitle>
                <DialogContent>
                  Are you sure you want to delete this course?
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleDeleteCancel}>Cancel</Button>
                  <Button
                    onClick={() => {
                      handleDialogClose();
                      createAPIEndpoint(ENDPOINTS.courses)
                        .delete(courseId)
                        .then((res) => setIsDeleted(true))
                        .then((res) => navigate("/instructor/dashboard"))
                        .catch((err) => console.log(err));
                    }}
                    color="error"
                  >
                    Delete
                  </Button>
                </DialogActions>
              </Dialog>
            </CardActions>
          )}
        </CardMedia>
        <CardContent>
          <Typography gutterBottom variant="h4" component="h2">
            {course.title}
          </Typography>
          <Typography variant="body1" color="textSecondary" component="p">
            {course.description}
          </Typography>
        </CardContent>
        <CardContent>
          <ToggleButtonGroup
            sx={{ display: "flex", justifyContent: "center" }}
            value={selectedView}
            exclusive
            onChange={handleViewChange}
            onDoubleClick={() => setSelectedView(selectedView)}
            aria-label="view selector"
            fullWidth
          >
            <ToggleButton
              value="tutorials"
              aria-label="tutorials view"
              onDoubleClick={() => setSelectedView("tutorials")}
            >
              Tutorials
            </ToggleButton>
            <ToggleButton
              value="quizzes"
              aria-label="quizzes view"
              onDoubleClick={() => setSelectedView("quizzes")}
            >
              Quizzes
            </ToggleButton>
          </ToggleButtonGroup>
          <br />
          {selectedView === "tutorials" ? (
            <Tutorials courseId={courseId} />
          ) : (
            <Quizzes courseId={courseId} />
          )}
        </CardContent>
      </Card>
    </Slide>
  );
};

const PublicCourse = () => {
  return <ViewCourse />;
};

const InstructorCourse = () => {
  return <ViewCourse />;
};

export { PublicCourse, InstructorCourse };
