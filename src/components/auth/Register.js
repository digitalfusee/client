import React from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import useStateContext from "../../hooks/useStateContext";
import { createAPIEndpoint, ENDPOINTS } from "../../api";
import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Grid,
  TextField,
  Button,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  MenuItem,
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function Register() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [error, setError] = useState("Invalid username.");
  const [role, setRole] = useState("student");

  const [values, setValues] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const {
    name,
    email,
    username,
    password,
    confirmPassword,
    phoneNumber,
    address,
  } = values;
  const {
    name: nameError,
    email: emailError,
    username: usernameError,
    password: passwordError,
    confirmPassword: confirmPasswordError,
    phoneNumber: phoneNumberError,
    address: addressError,
  } = errors;

  const validate = () => {
    let temp = {};
    temp.name = /^[A-Z][-a-zA-Z]+$/.test(values.name)
      ? ""
      : "Name is not valid. Must be at least 2 characters long and contain only letters. Must start with a capital letter. Cannot contain numbers or special characters.";
    temp.email = /.+@.+\.[A-Za-z]+$/.test(values.email)
      ? ""
      : "Email is not valid. Must be in the format: name@email.com or name@email.ca or name@email.co.uk";
    temp.username =
      /^(?=.{5,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/.test(
        values.username
      )
        ? ""
        : "Username is not valid. Must be at least 5 characters long and contain only letters, numbers, periods and underscores. Cannot start or end with a period or underscore. Cannot contain two periods or underscores in a row.";
    temp.password =
      /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,}$/.test(
        values.password
      )
        ? ""
        : "Password is not valid. Must contain at least one number, one uppercase and lowercase letter, one special charecter and a minimum length of 6 characters.";
    temp.phoneNumber = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/.test(
      values.phoneNumber
    )
      ? ""
      : "Phone number is not valid. Must be in the format: 123-456-7890 or (123) 456-7890 or 123 456 7890 or 123.456.7890 or +91 (123) 456-7890";
    temp.address =
      /^([\d\s]+\w+)\s(St|Ave|Rd|Blvd|Dr|Cres|Way|Pky|Crt)\s?,\s?([\w\s]+),\s([A-Z]{2})\s([A-Z]\d[A-Z]\s?\d[A-Z]\d)$/.test(
        values.address
      )
        ? ""
        : "Address is not valid. Must be in the format of: 123 Main St, Toronto, ON M1M 1M1.";

    setErrors({
      ...temp,
    });
    return Object.values(temp).every((x) => x === "");
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      values.role = role;
      if (role === "instructor") {
        createAPIEndpoint(ENDPOINTS.registerInstructor)
          .post(values)
          .then((res) => {
            if (res.data.statusCode === 1) {
              navigate("/");
            } else {
              setShowAlert(true);
            }
          })
          .catch((err) => console.log(err));
      }
      if (role === "student") {
        createAPIEndpoint(ENDPOINTS.registerStudent)
          .post(values)
          .then((res) => {
            if (res.data.statusCode === 1) {
              navigate("/");
            } else {
              setShowAlert(true);
            }
          })
          .catch((err) => console.log(err));
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
    validate({ [name]: value });
  };

  // const handleForgetPassword = () => {
  //   navigate("/forget-password");
  // };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Register
      </Button>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          Register
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Box sx={{ pt: 0, pb: 4, pr: 2, pl: 2 }}>
            <Grid item xs={12}>
              {showAlert && (
                <Alert severity="error" onClose={handleCloseAlert}>
                  {error}
                </Alert>
              )}
              <br />
            </Grid>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <TextField
                    required
                    label="Name"
                    variant="outlined"
                    fullWidth
                    value={name}
                    onChange={(e) =>
                      setValues({ ...values, name: e.target.value })
                    }
                    error={nameError ? true : false}
                    helperText={nameError}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    label="Email"
                    variant="outlined"
                    fullWidth
                    value={email}
                    onChange={(e) =>
                      setValues({ ...values, email: e.target.value })
                    }
                    error={emailError ? true : false}
                    helperText={emailError}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    label="Username"
                    variant="outlined"
                    fullWidth
                    value={username}
                    onChange={(e) =>
                      setValues({ ...values, username: e.target.value })
                    }
                    error={usernameError ? true : false}
                    helperText={usernameError}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    label="Password"
                    variant="outlined"
                    fullWidth
                    type="password"
                    value={password}
                    onChange={(e) =>
                      setValues({ ...values, password: e.target.value })
                    }
                    error={passwordError ? true : false}
                    helperText={passwordError}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    label="Confirm Password"
                    variant="outlined"
                    fullWidth
                    type="password"
                    value={confirmPassword}
                    onChange={(e) =>
                      setValues({
                        ...values,
                        confirmPassword: e.target.value,
                      })
                    }
                    error={confirmPasswordError ? true : false}
                    helperText={confirmPasswordError}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    label="Phone Number"
                    variant="outlined"
                    fullWidth
                    value={phoneNumber}
                    onChange={(e) =>
                      setValues({ ...values, phoneNumber: e.target.value })
                    }
                    error={phoneNumberError ? true : false}
                    helperText={phoneNumberError}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    label="Address"
                    variant="outlined"
                    fullWidth
                    value={address}
                    onChange={(e) =>
                      setValues({ ...values, address: e.target.value })
                    }
                    error={addressError ? true : false}
                    helperText={addressError}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    select
                    label="Role"
                    value={role}
                    onChange={handleRoleChange}
                    fullWidth
                    margin="normal"
                  >
                    <MenuItem value="instructor">Instructor</MenuItem>
                    <MenuItem value="student">Student</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    type="submit"
                    disabled={
                      !confirmPassword ||
                      !password ||
                      !username ||
                      !email ||
                      !name ||
                      !phoneNumber ||
                      !address ||
                      confirmPasswordError
                        ? true
                        : false
                    }
                  >
                    Sign Up
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </DialogContent>
      </BootstrapDialog>
    </div>
  );
}
