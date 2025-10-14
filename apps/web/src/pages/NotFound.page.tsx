import { useNavigate } from "react-router-dom";

export function NotFoundPage() {
	const nav = useNavigate();

	const returnHome = () => {
		nav("/");
	};
	return (
		<div className="flex flex-col items-center justify-center h-screen bg-gray-100">
			<h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
			<p className="text-2xl text-gray-600 mb-8">Page Not Found</p>
			<button
				onClick={returnHome}
				className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
			>
				Return Home
			</button>
		</div>
	);
}
