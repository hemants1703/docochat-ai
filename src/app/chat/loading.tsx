export default function ChatPageLoading() {
	return (
		<section className="flex flex-col flex-1 items-center justify-center bg-linear-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
			<div className="flex flex-col items-center justify-center">
				<div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
				<p className="text-sm text-gray-500 dark:text-gray-400">Loading chat page...</p>
			</div>
		</section>
	);
}
