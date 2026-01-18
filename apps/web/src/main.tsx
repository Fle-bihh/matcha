import "reflect-metadata";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "@/components";
import { AppLayout } from "@/layouts";

document.body.style.margin = "0";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<Provider>
			<AppLayout />
		</Provider>
	</React.StrictMode>,
);
