import { useRouting } from "@/hooks/routing.hooks";
import { useNavigate } from "react-router-dom";

export function NotFoundPage() {
	const { toHome } = useRouting();
	return (
		<div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
			<h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
			<p className="text-2xl text-gray-600 mb-8">Page Not Found</p>
			<button
				onClick={toHome}
				className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
			>
				Return Home
			</button>
		</div>
	);
}
