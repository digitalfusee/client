import React, { useState, useEffect } from "react";
import useStateContext from "../../hooks/useStateContext";
import { createAPIEndpoint, ENDPOINTS } from "../../api";
import TutorialForm from "./TutorialForm";
import {
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Typography,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from "@mui/material";
import { PlayCircleFilled, Edit, Delete } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import ReactPlayer from "react-player";

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
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9 aspect ratio
    position: "relative",
    backgroundColor: "#212121",
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

const TutorialCard = ({ courseId, tutorialId }) => {
  const classes = useStyles();
  const [course, setCourse] = useState(null);
  const [tutorial, setTutorial] = useState(null);
  const [openTutorial, setOpenTutorial] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [player, setPlayer] = useState(null);
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
    createAPIEndpoint(ENDPOINTS.tutorials)
      .fetchTutorial(courseId.toString(), tutorialId)
      .then((res) => setTutorial(res.data))
      .catch((err) => console.log(err));
  }, [courseId, tutorialId]);

  const handleTutorialClick = () => {
    if (isButtonClicked) {
      setIsButtonClicked(true);
    } else {
      setOpenTutorial(true);
    }
  };

  const handleTutorialClose = () => {
    setOpenTutorial(false);
    if (player !== null) {
      player.pause();
    }
  };

  const handlePlayerReady = (event) => {
    if (event && event.target) {
      setPlayer(event.target);
      event.target.play();
    }
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

  const handleEditConfirm = (updatedTutorial) => {
    setIsEditing(true);
    createAPIEndpoint(ENDPOINTS.tutorials)
      .putTutorial(courseId, tutorialId, updatedTutorial)
      .then((res) => {
        setIsEditing(false);
        setTutorial(updatedTutorial); // Update the tutorial state
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
    createAPIEndpoint(ENDPOINTS.tutorials)
      .deleteTutorial(courseId, tutorialId)
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

  if (!tutorial) {
    return null;
  }

  if (!tutorial && !isDeleted) {
    return <CircularProgress />;
  }

  if (isDeleted) {
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
        <IconButton
          aria-label="delete"
          color="error"
          onClick={handleDeleteDialogOpen}
        >
          <Delete />
        </IconButton>
      </CardActions>
    );

  return (
    <>
      <Card
        className={`${classes.root} ${isDeleting ? classes.fadeOut : ""}`}
        onClick={handleTutorialClick}
      >
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
            <PlayCircleFilled fontSize="large" />
          </IconButton>
        </div>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {tutorial.title}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {tutorial.description}
          </Typography>
        </CardContent>
        {editAndDeleteActions}
      </Card>
      <Dialog
        open={openTutorial}
        onClose={handleTutorialClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>{tutorial.title}</DialogTitle>
        <DialogContent>
          {tutorial.videoURL && (
            <ReactPlayer
              style={{
                borderRadius: "3px",
                overflow: "hidden",
              }}
              url={tutorial.videoURL}
              width="100%"
              height="500px"
              controls={true}
              onReady={handlePlayerReady}
            />
          )}
          {tutorial.steps && (
            <List>
              {tutorial.steps.map((step, index) => (
                <ListItem key={index}>
                  <ListItemAvatar>
                    <Avatar>{index + 1}</Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={step.step} />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleTutorialClose}>Close</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openDeleteDialog} onClose={handleDeleteDialogClose}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this tutorial?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openEditDialog} onClose={handleEditDialogClose}>
        <DialogTitle>Edit Tutorial</DialogTitle>
        <DialogContent>
          <TutorialForm
            courseId={courseId}
            tutorialId={tutorialId}
            tutorial={tutorial}
            isEditing={isEditing}
            handleEditCancel={handleEditCancel}
            handleEditConfirm={handleEditConfirm}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TutorialCard;
