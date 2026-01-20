import { HomeHeader } from "@/components";
import { Box, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useMemo } from "react";
import { LayoutSizesProvider, useLayoutSizes } from "@/contexts";
import { BrowsingProvider } from "@/contexts";
import { WebSocketSubscriptionProvider } from "@/contexts";

function ProtectedLayoutContent() {
	const { headerHeight } = useLayoutSizes();
	const boxHeight = useMemo(
		() => `calc(100vh - ${headerHeight}px)`,
		[headerHeight],
	);

	return (
		<Box
			sx={{
				height: "100vh",
			}}
		>
			<HomeHeader />
			<Toolbar />
			<Box
				sx={{
					height: boxHeight,
				}}
			>
				<Outlet />
			</Box>
		</Box>
	);
}

export function ProtectedLayout() {
	return (
		<LayoutSizesProvider>
			<WebSocketSubscriptionProvider>
				<BrowsingProvider>
					<ProtectedLayoutContent />
				</BrowsingProvider>
			</WebSocketSubscriptionProvider>
		</LayoutSizesProvider>
	);
}
