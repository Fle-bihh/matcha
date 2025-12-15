import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "@/components/app";
import { AppLayout } from "@/layouts";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<Provider>
			<AppLayout />
		</Provider>
	</React.StrictMode>
);
