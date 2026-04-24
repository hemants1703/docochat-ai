export type SupportedFileType = {
	ext: string;
	mime: string;
};

export const supportedFileTypes: SupportedFileType[] = [
	{ ext: "pdf", mime: "application/pdf" },
	{
		ext: "docx",
		mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	},
	{ ext: "txt", mime: "text/plain" },
	{ ext: "md", mime: "text/markdown" },
	{ ext: "rtf", mime: "application/rtf" },
	{ ext: "rtf", mime: "text/rtf" },
];
