import { ThemeProvider } from "@/components/theme-provider";
import ToastProvider from "@/components/toast-provider";
import clsx from "clsx";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: {
		default: "DocoChat RAG Powered AI",
		template: "%s | DocoChat RAG Powered AI",
	},
	description: "Chat with your documents",
	keywords: ["DocoChat", "RAG", "AI", "Document", "Chat", "Conversation"],
	metadataBase: new URL("https://docochat-rag-ai.hemantsharma.tech"),
	openGraph: {
		title: "DocoChat RAG Powered AI",
		description: "Chat with your documents",
		images: [
			{
				url: "https://res.cloudinary.com/dej4ks4wd/image/upload/v1762757286/Screenshot_2025-11-10_at_12.16.47_PM_ngqhep.png",
				width: 1200,
				height: 630,
				alt: "DocoChat RAG Powered AI - Chat with your documents",
			},
		],
		url: "https://docochat-rag-ai.hemantsharma.tech/",
		siteName: "DocoChat RAG Powered AI",
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "DocoChat RAG Powered AI",
		description: "Chat with your documents",
		images: [
			{
				url: "https://res.cloudinary.com/dej4ks4wd/image/upload/v1762757286/Screenshot_2025-11-10_at_12.16.47_PM_ngqhep.png",
				width: 1200,
				height: 630,
				alt: "DocoChat RAG Powered AI - Chat with your documents",
			},
		],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={clsx("antialiased bg-linear-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800", geistSans.variable, geistMono.variable)}>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
					<TooltipProvider>
						{children}
						<ToastProvider />
					</TooltipProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
