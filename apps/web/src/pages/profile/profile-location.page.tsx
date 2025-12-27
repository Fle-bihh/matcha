import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  CircularProgress,
  Alert,
  Paper,
  Typography,
  Divider,
} from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { ProfilePageWrapper } from "@/components/profile/profile-page-wrapper.component";
import { GeocodingResult } from "@matcha/shared";
import { useAuthUser } from "@/hooks/auth.hook";
import { useSelector } from "react-redux";
import {
  selectSelectedLocation,
  selectSearchResults,
  selectIsGettingGPS,
  selectIsSearching,
  selectLocationError,
} from "@/store/selectors/location.selectors";
import { clearLocationError } from "@/store";
import { useDispatch } from "react-redux";

export function ProfileLocationPage() {
  const { getCurrentPosition, searchLocation, createManualLocation } =
    useAuthUser();
  const dispatch = useDispatch();

  const selectedLocation = useSelector(selectSelectedLocation);
  const searchResults = useSelector(selectSearchResults);
  const isGettingGPS = useSelector(selectIsGettingGPS);
  const isSearching = useSelector(selectIsSearching);
  const error = useSelector(selectLocationError);

  const [searchQuery, setSearchQuery] = useState("");

  const handleGPSLocation = async () => {
    getCurrentPosition();
    setSearchQuery("");
  };

  const handleSearch = async () => {
    searchLocation(searchQuery);
  };

  const handleSelectResult = (result: GeocodingResult) => {
    createManualLocation(result);
    setSearchQuery("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClearError = () => {
    dispatch(clearLocationError());
  };

  return (
    <ProfilePageWrapper
      title="Location"
      description="Set your location to help us find matches near you. You can use GPS for automatic detection or search manually."
    >
      <Box sx={{ mt: 2 }}>
        <Box sx={{ mb: 3 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={
              isGettingGPS ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <MyLocationIcon />
              )
            }
            onClick={handleGPSLocation}
            disabled={isGettingGPS}
            fullWidth
            sx={{ py: 1.5 }}
          >
            {isGettingGPS
              ? "Getting your location..."
              : "Use My Current Location (GPS)"}
          </Button>
        </Box>

        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="text.secondary">
            OR
          </Typography>
        </Divider>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom fontWeight={500}>
            Search for a location
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              fullWidth
              placeholder="Enter city, neighborhood, or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isSearching}
              size="medium"
            />
            <Button
              variant="outlined"
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
              startIcon={
                isSearching ? <CircularProgress size={20} /> : <SearchIcon />
              }
              sx={{ minWidth: 120 }}
            >
              {isSearching ? "Searching" : "Search"}
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={handleClearError}>
            {error}
          </Alert>
        )}

        {searchResults.length > 0 && (
          <Paper
            variant="outlined"
            sx={{ mb: 3, maxHeight: 400, overflow: "auto" }}
          >
            <List disablePadding>
              {searchResults.map((result, index) => (
                <ListItem
                  key={index}
                  disablePadding
                  divider={index < searchResults.length - 1}
                >
                  <ListItemButton onClick={() => handleSelectResult(result)}>
                    <LocationOnIcon sx={{ mr: 2, color: "primary.main" }} />
                    <ListItemText
                      primary={result.display_name}
                      secondary={
                        result.city && result.country
                          ? `${result.city}, ${result.country}`
                          : result.country || "Location"
                      }
                      slotProps={{
                        primary: {
                          sx: { wordBreak: "break-word" },
                        },
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Paper>
        )}

        {selectedLocation && (
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              bgcolor: "primary.50",
              borderColor: "primary.main",
              borderWidth: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
              <LocationOnIcon sx={{ color: "primary.main", fontSize: 32 }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" gutterBottom color="primary.main">
                  Selected Location
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedLocation.display_name}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>City:</strong> {selectedLocation.city || "N/A"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Neighborhood:</strong>{" "}
                    {selectedLocation.neighborhood || "N/A"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Country:</strong>{" "}
                    {selectedLocation.country || "N/A"}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    <strong>Type:</strong>{" "}
                    {selectedLocation.manually_set
                      ? "Manually set"
                      : "GPS location"}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 1, display: "block" }}
                  >
                    Coordinates: {selectedLocation.latitude.toFixed(6)},{" "}
                    {selectedLocation.longitude.toFixed(6)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        )}

        {!selectedLocation && (
          <Alert severity="info" sx={{ mt: 3 }}>
            <Typography variant="body2">
              <strong>Privacy Notice:</strong> Your location will only be used
              to find matches near you. We only store your city and
              neighborhood, not your exact GPS coordinates.
            </Typography>
          </Alert>
        )}
      </Box>
    </ProfilePageWrapper>
  );
}
