import React from "react";
import { Container, Grid } from "@mui/material";
import { PublicCourses } from "../components/course/index";

export default function HomeView() {
  return (
    <Container maxWidth="lg">
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12}>
          <PublicCourses />
          <br />
        </Grid>
      </Grid>
    </Container>
  );
}
