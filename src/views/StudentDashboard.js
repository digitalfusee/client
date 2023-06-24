import React from "react";
import {
  Box,
  Grid,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function StudentHome() {
  return (
    <div>
      <Box sx={{ width: "100%" }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="inbox-content"
                id="inbox-header"
              >
                <Typography variant="h6" component="div">
                  Your inbox
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>Your inbox is currently empty.</Typography>
              </AccordionDetails>
            </Accordion>
          </Grid>
          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="courses-content"
                id="courses-header"
              >
                <Typography variant="h6" component="div">
                  Your courses
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  You are not currently enrolled in any courses. Enroll in a
                  course to get started.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}
