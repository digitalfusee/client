import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useStateContext from "../../hooks/useStateContext";
import { createAPIEndpoint, ENDPOINTS } from "../../api";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CircularProgress,
  Button,
  Grid,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
    transition: "transform 0.3s",
    "&:hover": {
      transform: "scale(1.02)",
      cursor: "pointer",
    },
    "&:hover .MuiCardActions-root": {
      visibility: "visible",
      transition: "visibility 0s, opacity 0.5s linear",
      opacity: 1,
    },
  },
  media: {
    height: 140,
    paddingTop: "56.25%", // 16:9 aspect ratio
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "-1rem",
  },
  fadeOut: {
    opacity: 0.5,
    transition: "opacity 0.5s ease-out",
    pointerEvents: "none",
  },
});

const CourseCard = ({ courseId }) => {
  const classes = useStyles();
  const [course, setCourse] = useState(null);
  const [open, setOpen] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const { context } = useStateContext();
  const navigate = useNavigate();

  useEffect(() => {
    createAPIEndpoint(ENDPOINTS.courses)
      .fetchById(courseId)
      .then((res) => setCourse(res.data))
      .catch((err) => console.log(err));
  }, [courseId]);

  const handleCourseClick = (e) => {
    if (isButtonClicked) {
      setIsButtonClicked(false);
    } else {
      let link = `/courses/${courseId}`;
      if (context.isStudent) {
        link = `/student/courses/${courseId}`;
      } else if (context.isInstructor && context.id && course.instructorId) {
        link = `/instructor/courses/${courseId}`;
      }
      navigate(link);
    }
  };

  const handleEdit = (e) => {
    setIsButtonClicked(true);
    e.stopPropagation();
    navigate(`/instructor/courses/edit/${courseId}`);
  };

  const handleDialogOpen = () => {
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  const handleDeleteConfirm = (e) => {
    setIsButtonClicked(true);
    setIsDeleting(true);
    e.stopPropagation();
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

  if (!course && !isDeleted) {
    return <CircularProgress />;
  }

  if (isDeleted) {
    return null;
  }

  const editAndDeleteActions = context.isInstructor &&
    context.id === course.instructorId && (
      <CardActions className={classes.actions}>
        <IconButton aria-label="edit" color="primary" onClick={handleEdit}>
          <Edit />
        </IconButton>
        <IconButton
          aria-label="delete"
          color="error"
          onClick={handleDeleteConfirm}
        >
          <Delete />
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
    );

  return (
    <Card
      className={`${classes.root} ${isDeleting ? classes.fadeOut : ""}`}
      onClick={handleCourseClick}
      style={{ cursor: "pointer" }}
    >
      <CardMedia
        className={classes.media}
        image={course.imageURL}
        title={course.title}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          {course.title}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {course.description}
        </Typography>
        <br />
        <Grid container justifyContent="space-between">
          <Grid item>
            <Typography variant="body2" color="textSecondary" component="p">
              {course.platform}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2" color="textSecondary" component="p">
              {course.category}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2" color="textSecondary" component="p">
              {course.difficulty}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
      {editAndDeleteActions}
    </Card>
  );
};

export default CourseCard;
