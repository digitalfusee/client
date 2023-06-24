import React from "react";
import { Grid, Typography, Link, Box, Card, Container } from "@mui/material";
import Section from "../components/layout/Section";

export default function AboutView() {
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          minHeight: "100%",
          py: 3,
        }}
      >
        <Grid container spacing={6}>
          <Grid item xs={12} md={12}>
            <Typography
              fontWeight={500}
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              Digital Fuse
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="text.secondary"
              paragraph
            >
              Welcome to Digital Fuse, the platform designed to teach Arabic
              speaking seniors how to use technology to stay connected and start
              businesses. Our mission is to empower older individuals in the
              Arabic speaking community by providing them with the skills and
              knowledge necessary to navigate the digital world.
            </Typography>
            <Section />

            <Grid item xs={12} md={12}>
              <Typography
                variant="h5"
                align="center"
                color="text.secondary"
                paragraph
              >
                How to use the application?
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Card
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      p: 2,
                      boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.2)",
                      borderRadius: "10px",
                      "&:hover": {
                        transform: "scale(1.02)",
                        transition: "transform 0.3s ease-in-out",
                      },
                    }}
                  >
                    <Typography
                      variant="h6"
                      align="center"
                      color="text.primary"
                      paragraph
                    >
                      How to use the app as an instructor:
                    </Typography>
                    <Typography variant="body1" color="text.primary" paragraph>
                      1. Get started by signing up as an instructor or log in if
                      you already have an account.
                    </Typography>
                    <Typography variant="body1" color="text.primary" paragraph>
                      2. Create an exciting and engaging course that students
                      will love to learn from.
                    </Typography>
                    <Typography variant="body1" color="text.primary" paragraph>
                      3. Add interactive tutorials to your course with fun and
                      informative video lessons.
                    </Typography>
                    <Typography variant="body1" color="text.primary" paragraph>
                      4. Challenge your students with quizzes and add
                      interesting questions that will test their knowledge.
                    </Typography>
                    <Typography variant="body1" color="text.primary" paragraph>
                      5. Get ready to teach and share your passion with the
                      world! Publish your course and watch your students thrive.
                    </Typography>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Card
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      p: 2,
                      boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.2)",
                      borderRadius: "10px",
                      "&:hover": {
                        transform: "scale(1.02)",
                        transition: "transform 0.3s ease-in-out",
                      },
                    }}
                  >
                    <Typography
                      variant="h6"
                      align="center"
                      color="text.primary"
                      paragraph
                    >
                      How to use the app as a student:
                    </Typography>
                    <Typography variant="body1" color="text.primary" paragraph>
                      1. You do not need to sign up to use the app as a student.
                    </Typography>
                    <Typography variant="body1" color="text.primary" paragraph>
                      2. Look for the courses you are interested in and click on
                      them.
                    </Typography>
                    <Typography variant="body1" color="text.primary" paragraph>
                      3. Watch the fun and informative video lessons in the
                      course.
                    </Typography>
                    <Typography variant="body1" color="text.primary" paragraph>
                      4. Take the quiz after watching the video lessons to test
                      your knowledge.
                    </Typography>
                    <Typography variant="body1" color="text.primary" paragraph>
                      5. See how well you did on the quiz and celebrate your
                      progress!
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
            </Grid>

            <br />
            <Grid item xs={12} md={12}>
              <Typography
                variant="h5"
                align="center"
                color="text.secondary"
                paragraph
              >
                What's the technology stack behind the app?
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                  <Card
                    sx={{
                      height: "100%",
                      p: 2,
                      boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.2)",
                      borderRadius: "10px",
                      "&:hover": {
                        transform: "scale(1.02)",
                        transition: "transform 0.3s ease-in-out",
                      },
                    }}
                  >
                    <Typography
                      align="center"
                      variant="body1"
                      color="text.primary"
                      paragraph
                    >
                      We've used cutting-edge technologies like React 18,
                      Material UI, ASP.NET Core 6, and PostgreSQL to build the
                      app! The backend is hosted on Heroku, the database on AWS,
                      and the frontend on Netlify. And guess what? The source
                      code is available on{" "}
                      <Link href="https://github.com/orgs/boardwalkabp/repositories">
                        GitHub
                      </Link>{" "}
                      too!
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
