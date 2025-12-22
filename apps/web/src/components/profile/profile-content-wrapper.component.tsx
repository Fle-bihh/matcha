import { Box, Card, CardContent, Typography, Avatar } from "@mui/material";
interface ProfileContentWrapperProps {
  title: string;
  children: React.ReactNode;
}
export function ProfileContentWrapper(props: ProfileContentWrapperProps) {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {props.title}
      </Typography>
      <Card sx={{ maxWidth: 600, mt: 3 }}>
        <CardContent>
          <>{props.children}</>
        </CardContent>
      </Card>
    </Box>
  );
}
