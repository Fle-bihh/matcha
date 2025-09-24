import { logger } from "@matcha/shared";
import { useState, useEffect } from "react";

interface ApiResponse {
	success: boolean;
	message: string;
	responseObject: {
		message: string;
		greeting_type: string;
		timestamp: string;
	};
	statusCode: number;
}

export default function Home() {
	const [apiData, setApiData] = useState<ApiResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchHello = async () => {
			try {
				const response = await fetch(
					"http://localhost:3000/api/v1/hello?name=World&greeting_type=standard"
				);
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const data: ApiResponse = await response.json();
				setApiData(data);
			} catch (err) {
				logger.error("Error fetching API:", JSON.stringify(err));
				setError(
					err instanceof Error ? err.message : "Failed to fetch"
				);
			} finally {
				setLoading(false);
			}
		};

		fetchHello();
	}, []);

	if (loading) return <div style={{ padding: "20px" }}>Loading...</div>;

	return (
		<div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
			<h1>🍃 Matcha - Hello API Test (Hot Reload Working!)</h1>

			{error ? (
				<div
					style={{
						color: "red",
						padding: "10px",
						border: "1px solid red",
						borderRadius: "4px",
					}}
				>
					<h2>Error:</h2>
					<p>{error}</p>
				</div>
			) : apiData ? (
				<div
					style={{
						color: "green",
						padding: "10px",
						border: "1px solid green",
						borderRadius: "4px",
					}}
				>
					<h2>API Response:</h2>
					<p>
						<strong>Message:</strong>{" "}
						{apiData.responseObject.message}
					</p>
					<p>
						<strong>Greeting Type:</strong>{" "}
						{apiData.responseObject.greeting_type}
					</p>
					<p>
						<strong>Timestamp:</strong>{" "}
						{new Date(
							apiData.responseObject.timestamp
						).toLocaleString()}
					</p>
					<p>
						<strong>Status Code:</strong> {apiData.statusCode}
					</p>
					<p>
						<strong>Success:</strong>{" "}
						{apiData.success ? "Yes" : "No"}
					</p>
				</div>
			) : null}
		</div>
	);
}
