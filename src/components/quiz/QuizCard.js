import React, { useState, useEffect } from "react";
import useStateContext from "../../hooks/useStateContext";
import { createAPIEndpoint, ENDPOINTS } from "../../api";
import QuizForm from "./QuizForm";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import {} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import QuizIcon from "@mui/icons-material/Quiz";
import Questions from "../question/index";

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
    transition: "transform 0.2s",
    "&:hover": {
      boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.2)",
      transform: "scale(1.02)",
      transition: "transform 0.3s ease-in-out",
      cursor: "pointer",
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
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9 aspect ratio
    position: "relative",
    backgroundColor: "#212121",
  },
});

const QuizCard = ({ quizId, courseId }) => {
  const classes = useStyles();
  const [quiz, setQuiz] = useState(null);
  const [course, setCourse] = useState(null);
  const [openQuiz, setOpenQuiz] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const { context } = useStateContext();

  useEffect(() => {
    createAPIEndpoint(ENDPOINTS.courses)
      .fetchById(courseId)
      .then((res) => setCourse(res.data))
      .catch((err) => console.log(err));
  }, [courseId]);

  useEffect(() => {
    createAPIEndpoint(ENDPOINTS.quizzes)
      .fetchQuiz(courseId, quizId)
      .then((res) => setQuiz(res.data))
      .catch((err) => console.log(err));
  }, [courseId, quizId]);

  const handleQuizClick = () => {
    setOpenQuiz(true);
  };

  const handleQuizClose = () => {
    setOpenQuiz(false);
  };

  const handleDeleteDialogOpen = (e) => {
    e.stopPropagation();
    setOpenDeleteDialog(true);
  };

  const handleDeleteDialogClose = (e) => {
    setOpenDeleteDialog(false);
  };

  const handleEditDialogOpen = (e) => {
    e.stopPropagation();
    setOpenEditDialog(true);
  };

  const handleEditDialogClose = (e) => {
    setOpenEditDialog(false);
  };

  const handleEditConfirm = (updatedQuiz) => {
    setIsEditing(true);
    createAPIEndpoint(ENDPOINTS.quizzes)
      .putQuiz(courseId, quizId, updatedQuiz)
      .then((res) => {
        setIsEditing(false);
        setQuiz(updatedQuiz); // Update the quiz state
        handleEditDialogClose();
      })
      .catch((err) => console.log(err));
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setOpenEditDialog(false);
    document.removeEventListener("click", handleClickOutside);
  };

  const handleDeleteConfirm = (e) => {
    e.stopPropagation();
    setIsDeleting(true);
    setOpenDeleteDialog(true);
    createAPIEndpoint(ENDPOINTS.quizzes)
      .deleteQuiz(courseId, quizId)
      .then((res) => setIsDeleted(true))
      .catch((err) => console.log(err));
    handleDeleteDialogClose();
  };

  const handleDeleteCancel = () => {
    setIsDeleting(false);
    setOpenDeleteDialog(false);
    document.removeEventListener("click", handleClickOutside);
  };

  const handleClickOutside = (e) => {
    if (e.target.nodeName !== "BUTTON") {
      setIsDeleting(false);
      document.removeEventListener("click", handleClickOutside);
    }
  };

  if (!quiz) {
    return null;
  }

  const editAndDeleteActions = context.isInstructor &&
    course &&
    context.id === course.instructorId && (
      <CardActions className={classes.actions}>
        <IconButton
          aria-label="edit"
          color="primary"
          onClick={handleEditDialogOpen}
        >
          <Edit />
        </IconButton>
        <div style={{ marginLeft: "auto" }}>
          <IconButton
            aria-label="delete"
            color="error"
            onClick={handleDeleteDialogOpen}
          >
            <Delete />
          </IconButton>
        </div>
      </CardActions>
    );

  return (
    <>
      <Card className={classes.root} onClick={handleQuizClick}>
        <div className={classes.media}>
          <IconButton
            aria-label="play"
            color="primary"
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <QuizIcon fontSize="large" />
          </IconButton>
        </div>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {quiz.title}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {quiz.description}
          </Typography>
        </CardContent>
        {editAndDeleteActions}
      </Card>
      <Dialog open={openQuiz} onClose={handleQuizClose} maxWidth="md">
        <DialogTitle>{quiz.title}</DialogTitle>
        <DialogContent>
          <DialogContent>
            <Questions courseId={courseId} quizId={quizId} />
          </DialogContent>
        </DialogContent>
      </Dialog>
      <Dialog open={openDeleteDialog} onClose={handleDeleteDialogClose}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this quiz?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openEditDialog} onClose={handleEditDialogClose}>
        <DialogTitle>Edit Quiz</DialogTitle>
        <DialogContent>
          <QuizForm
            courseId={courseId}
            quizId={quizId}
            quiz={quiz}
            isEditing={isEditing}
            handleEditCancel={handleEditCancel}
            handleEditConfirm={handleEditConfirm}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuizCard;
