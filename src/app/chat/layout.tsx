import ChatSidebarContent from "@/components/features/chat/chat-sidebar-content";

export const metadata = {
  title: "Chat with your documents",
};

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-1 h-svh bg-linear-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <aside className="w-64 p-4 border-r border-gray-200 dark:border-gray-700 h-full bg-linear-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Uploaded Documents</h2>
        <ChatSidebarContent />
      </aside>
      <div className="flex flex-1 overflow-y-auto bg-white dark:bg-gray-800">{children}</div>
    </main>
  );
}
