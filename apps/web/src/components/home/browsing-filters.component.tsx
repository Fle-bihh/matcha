import { useEffect, useMemo, useState } from "react";
import {
	Box,
	TextField,
	Slider,
	Typography,
	Button,
	Chip,
	Stack,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FilterListIcon from "@mui/icons-material/FilterList";
import {
	USER_INTERESTS,
	BrowsingFilters,
	SortBy,
	SortOrder,
} from "@matcha/shared";
import { useBrowsingContext } from "@/contexts/browsing.context";

export function BrowsingFiltersComponent() {
	const {
		filters,
		applyFilters,
		clearFilters,
		hasChanges: hasChangesCb,
	} = useBrowsingContext();
	const [localFilters, setLocalFilters] = useState<BrowsingFilters>(filters);
	const hasChanges = useMemo(
		() => hasChangesCb(localFilters),
		[hasChangesCb, localFilters]
	);

	const handleChange = (key: keyof BrowsingFilters, value: any) => {
		setLocalFilters((prev) => ({ ...prev, [key]: value }));
	};

	const handleInterestToggle = (interest: string) => {
		const currentInterests = localFilters.interests || [];
		const newInterests = currentInterests.includes(interest)
			? currentInterests.filter((i) => i !== interest)
			: [...currentInterests, interest];
		handleChange("interests", newInterests);
	};

	const handleApply = () => {
		applyFilters(localFilters);
	};

	const handleClear = () => {
		setLocalFilters({});
		clearFilters();
	};

	const hasActiveFilters = Object.values(localFilters).some(
		(value) =>
			value !== undefined &&
			value !== null &&
			value !== "" &&
			(Array.isArray(value) ? value.length > 0 : true)
	);

	useEffect(() => {
		setLocalFilters(filters);
	}, [filters]);

	return (
		<Box sx={{ mb: 3 }}>
			<Accordion>
				<AccordionSummary
					expandIcon={<ExpandMoreIcon />}
					sx={{
						"&:hover": { bgcolor: "action.hover" },
					}}
				>
					<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
						<FilterListIcon />
						<Typography fontWeight={600}>Filters</Typography>
						{hasActiveFilters && (
							<Chip
								label="Active"
								size="small"
								color="primary"
								sx={{ ml: 1 }}
							/>
						)}
					</Box>
				</AccordionSummary>
				<AccordionDetails>
					<Stack spacing={3}>
						<Box
							sx={{
								display: "grid",
								gridTemplateColumns: {
									xs: "1fr",
									md: "1fr 1fr",
								},
								gap: 2,
							}}
						>
							{/* Age Range */}
							<Box sx={{ p: 2 }}>
								<Box>
									<Typography gutterBottom fontWeight={500}>
										Age Range: {localFilters.ageMin || 18} -{" "}
										{localFilters.ageMax || 99}
									</Typography>
									<Slider
										value={[
											localFilters.ageMin || 18,
											localFilters.ageMax || 99,
										]}
										onChange={(_, value) => {
											const [min, max] =
												value as number[];
											handleChange("ageMin", min);
											handleChange("ageMax", max);
										}}
										valueLabelDisplay="auto"
										min={18}
										max={99}
										marks={[
											{ value: 18, label: "18" },
											{ value: 99, label: "99" },
										]}
									/>
								</Box>
							</Box>

							{/* Distance */}
							<Box sx={{ p: 2 }}>
								<Box>
									<Typography gutterBottom fontWeight={500}>
										Max Distance:{" "}
										{localFilters.distanceMax || 100} km
									</Typography>
									<Slider
										value={localFilters.distanceMax || 100}
										onChange={(_, value) =>
											handleChange("distanceMax", value)
										}
										valueLabelDisplay="auto"
										min={1}
										max={5000}
										marks={[
											{ value: 1, label: "1 km" },
											{ value: 5000, label: "5000 km" },
										]}
									/>
								</Box>
							</Box>

							{/* Fame Rating Range */}
							<Box sx={{ p: 2 }}>
								<Box>
									<Typography gutterBottom fontWeight={500}>
										Fame Rating: {localFilters.fameMin || 0}{" "}
										- {localFilters.fameMax || 100}
									</Typography>
									<Slider
										value={[
											localFilters.fameMin || 0,
											localFilters.fameMax || 100,
										]}
										onChange={(_, value) => {
											const [min, max] =
												value as number[];
											handleChange("fameMin", min);
											handleChange("fameMax", max);
										}}
										valueLabelDisplay="auto"
										min={0}
										max={100}
										marks={[
											{ value: 0, label: "0" },
											{ value: 100, label: "100" },
										]}
									/>
								</Box>
							</Box>

							{/* Sort Options */}
							<Box sx={{ p: 2 }}>
								<Stack direction="row" spacing={2}>
									<FormControl size="small" fullWidth>
										<InputLabel>Sort By</InputLabel>
										<Select
											value={localFilters.sortBy || ""}
											label="Sort By"
											onChange={(e) =>
												handleChange(
													"sortBy",
													e.target.value
												)
											}
										>
											<MenuItem value="">
												<em>None</em>
											</MenuItem>
											<MenuItem value={SortBy.Age}>
												Age
											</MenuItem>
											<MenuItem value={SortBy.Distance}>
												Distance
											</MenuItem>
											<MenuItem value={SortBy.FameRating}>
												Fame Rating
											</MenuItem>
											<MenuItem value={SortBy.CommonTags}>
												Common Tags
											</MenuItem>
										</Select>
									</FormControl>

									<FormControl size="small" fullWidth>
										<InputLabel>Order</InputLabel>
										<Select
											value={
												localFilters.sortOrder ||
												SortOrder.Asc
											}
											label="Order"
											onChange={(e) =>
												handleChange(
													"sortOrder",
													e.target.value
												)
											}
											disabled={!localFilters.sortBy}
										>
											<MenuItem value={SortOrder.Asc}>
												Ascending
											</MenuItem>
											<MenuItem value={SortOrder.Desc}>
												Descending
											</MenuItem>
										</Select>
									</FormControl>
								</Stack>
							</Box>
						</Box>
						<Box>
							<Typography gutterBottom fontWeight={500}>
								Interests{" "}
								{localFilters.interests?.length
									? `(${localFilters.interests.length} selected)`
									: ""}
							</Typography>
							<Box
								sx={{
									display: "flex",
									flexWrap: "wrap",
									gap: 1,
								}}
							>
								{USER_INTERESTS.map((interest) => (
									<Chip
										key={interest}
										label={interest}
										onClick={() =>
											handleInterestToggle(interest)
										}
										color={
											localFilters.interests?.includes(
												interest
											)
												? "primary"
												: "default"
										}
										variant={
											localFilters.interests?.includes(
												interest
											)
												? "filled"
												: "outlined"
										}
										size="small"
									/>
								))}
							</Box>
						</Box>

						{/* Action Buttons */}
						<Stack direction="row" spacing={2}>
							<Button
								variant="contained"
								onClick={handleApply}
								fullWidth
								disabled={!hasActiveFilters || !hasChanges}
							>
								Apply Filters
							</Button>
							<Button
								variant="outlined"
								onClick={handleClear}
								fullWidth
								disabled={!hasActiveFilters}
							>
								Clear All
							</Button>
						</Stack>
					</Stack>
				</AccordionDetails>
			</Accordion>
		</Box>
	);
}
