import { Container, Box, Paper, Typography } from "@mui/material";

export function ConfirmEmailPage() {
  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="98vh"
      >
        <Paper elevation={4}>
          <Box p={5}>
            <Typography
              variant="h4"
              component="h2"
              fontWeight={600}
              gutterBottom
              textAlign="center"
              mb={2}
            >
              Confirm Your Email
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
