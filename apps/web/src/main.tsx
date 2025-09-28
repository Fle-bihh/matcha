import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "@/components/app";
import { EntryLayout } from "@/layouts";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<Provider>
			<EntryLayout />
		</Provider>
	</React.StrictMode>
);
