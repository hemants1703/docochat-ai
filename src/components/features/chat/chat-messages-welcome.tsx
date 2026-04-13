import { FileText, Sparkles } from "lucide-react";

export default function ChatMessagesWelcomeScreen() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center space-y-6 p-8">
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <FileText className="w-3 h-3 text-white" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Welcome to Docochat AI!</h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md">Start chatting with your documents. Ask questions, get insights, and explore your content like never before.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
        <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg border border-blue-200 dark:border-blue-700">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Smart Analysis</span>
          </div>
          <p className="text-xs text-blue-600 dark:text-blue-400">Get intelligent insights from your documents</p>
        </div>

        <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg border border-purple-200 dark:border-purple-700">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Quick Answers</span>
          </div>
          <p className="text-xs text-purple-600 dark:text-purple-400">Find specific information instantly</p>
        </div>

        <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg border border-green-200 dark:border-green-700">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-green-700 dark:text-green-300">Context Aware</span>
          </div>
          <p className="text-xs text-green-600 dark:text-green-400">Understands your document context</p>
        </div>
      </div>
    </div>
  );
}
