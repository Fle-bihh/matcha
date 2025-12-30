import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Stack,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { withProfileCompleteComponent } from "@/components/utils/with-condition-component.component";
import { ProfileUncomplete } from "./profile-uncomplete.page";
import { usePager } from "@/hooks/pagination.hook";
import { EPagerKeys } from "@/constants";
import { User } from "@matcha/shared";
import { useAuthUser } from "@/hooks/auth.hook";
import { EEntityTypes } from "@/types";
import { useState } from "react";

function HomePageComp() {
  const { getUsers } = useAuthUser();
  const {
    data: users,
    meta,
    fetchNextPage,
    fetchPreviousPage,
    fetchPage,
    refresh,
    setLimit,
    hasNextPage,
    hasPreviousPage,
  } = usePager<User>({
    pagerKey: EPagerKeys.Users,
    entityType: EEntityTypes.Users,
    fn: getUsers,
  });

  const [pageInput, setPageInput] = useState("");
  const [limitValue, setLimitValue] = useState(10);

  const handleGoToPage = () => {
    const page = parseInt(pageInput);
    if (!isNaN(page) && page > 0 && meta && page <= meta.totalPages) {
      fetchPage(page);
      setPageInput("");
    }
  };

  const handleLimitChange = (newLimit: number) => {
    setLimitValue(newLimit);
    setLimit(newLimit);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1">
          Users - Pagination Test
        </Typography>
        {meta && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Page {meta.page} of {meta.totalPages} | Total: {meta.total} users |
            Showing {users.length} users
          </Typography>
        )}
      </Box>

      {/* Pagination Controls */}
      <Card sx={{ mb: 3, p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Pagination Controls
        </Typography>
        <Stack spacing={2}>
          {/* Navigation Buttons */}
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Button
              variant="contained"
              onClick={fetchPreviousPage}
              disabled={!hasPreviousPage}
            >
              Previous Page
            </Button>
            <Button
              variant="contained"
              onClick={fetchNextPage}
              disabled={!hasNextPage}
            >
              Next Page
            </Button>
            <Button variant="outlined" onClick={refresh}>
              Refresh
            </Button>
          </Stack>

          {/* Go to Page */}
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              label="Go to page"
              type="number"
              size="small"
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              sx={{ width: 150 }}
            />
            <Button variant="contained" onClick={handleGoToPage}>
              Go
            </Button>
          </Stack>

          {/* Items per page */}
          <Stack direction="row" spacing={2} alignItems="center">
            <FormControl size="small" sx={{ width: 150 }}>
              <InputLabel>Items per page</InputLabel>
              <Select
                value={limitValue}
                label="Items per page"
                onChange={(e) => handleLimitChange(Number(e.target.value))}
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Stack>
      </Card>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: 2,
        }}
      >
        {users.map((user: User) => (
          <Card key={user.id}>
            <CardContent>
              <Typography variant="h6">
                {user.first_name} {user.last_name}
              </Typography>
              {user.bio && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {user.bio}
                </Typography>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>

      {!users.length && (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          No users found.
        </Typography>
      )}
    </Container>
  );
}

export const HomePage = withProfileCompleteComponent(
  HomePageComp,
  ProfileUncomplete
);
