import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
import SaveIcon from "@mui/icons-material/Save";
import { GeocodingResult } from "@matcha/shared";
import { useAuthUser } from "@/hooks/auth.hook";
import { useSelector, useDispatch } from "react-redux";
import {
  selectSelectedLocation,
  selectSearchResults,
  selectIsGettingGPS,
  selectIsSearching,
  selectLocationError,
} from "@/store/selectors/location.selectors";
import { clearLocationError, resetLocationState } from "@/store";
import { useFlagger } from "@/hooks/flaggers.hook";
import { EFlaggers } from "@/constants/flaggers.constants";

export function ChangeLocationDialog() {
  const {
    getCurrentPosition,
    searchLocation,
    createManualLocation,
    updateLocation,
  } = useAuthUser();
  const dispatch = useDispatch();
  const { data, setFlagger } = useFlagger(EFlaggers.ChangeLocationDialog);

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

  const handleClose = () => {
    setFlagger({ isOpen: false });
    setSearchQuery("");
    dispatch(resetLocationState());
  };

  const handleSave = async () => {
    if (!selectedLocation) return;

    updateLocation(selectedLocation);
  };

  return (
    <Dialog open={data.isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Change Location</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1 }}>
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
              sx={{ mb: 3, maxHeight: 300, overflow: "auto" }}
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

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              SELECTED LOCATION
            </Typography>
          </Divider>

          {selectedLocation ? (
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                bgcolor: "success.50",
                borderColor: "success.main",
                borderWidth: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                <LocationOnIcon sx={{ color: "success.main", fontSize: 28 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    color="success.main"
                    fontWeight={600}
                  >
                    {[selectedLocation.neighborhood, selectedLocation.city]
                      .filter(Boolean)
                      .join(", ") || "Location selected"}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          ) : (
            <Alert severity="info">
              <Typography variant="body2">
                No location selected yet. Use GPS or search to select a
                location.
              </Typography>
            </Alert>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          startIcon={<SaveIcon />}
          disabled={!selectedLocation}
        >
          Save Location
        </Button>
      </DialogActions>
    </Dialog>
  );
}
