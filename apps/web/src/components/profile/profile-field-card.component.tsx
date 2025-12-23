import { Card, CardContent, Typography, Button, Stack } from "@mui/material";

interface ProfileFieldCardProps {
  title: string;
  children: React.ReactNode;
  onSave: () => void;
  isLoading?: boolean;
  hasChanges: boolean;
  error?: string | null;
}

export function ProfileFieldCard(props: ProfileFieldCardProps) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6" gutterBottom>
            {props.title}
          </Typography>

          <>{props.children}</>

          <Button
            variant="contained"
            color="primary"
            onClick={props.onSave}
            disabled={props.isLoading || !props.hasChanges}
            fullWidth
          >
            {props.isLoading ? "Saving..." : "Save"}
          </Button>

          {props.error && (
            <Typography color="error" variant="body2" textAlign="center">
              {props.error}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
