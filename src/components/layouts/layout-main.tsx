import { Outlet } from "react-router";
import Header from "./Header";

export default function LayoutMain() {
  return (
		<div className="flex flex-col h-screen bg-gray-100 font-sans">
			<Header />

			<main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
				<Outlet />
			</main>
		</div>
  );
}