export const metadata = {
  title: "Chat with your documents",
};

export default async function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-1 h-svh bg-linear-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <div className="flex flex-1 overflow-y-auto bg-white dark:bg-gray-800">{children}</div>
    </main>
  );
}
