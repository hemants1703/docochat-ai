import { FileBoxIcon } from "lucide-react";

interface PreviewSelectedFileProps {
  file: File | null;
}

export default function PreviewSelectedFile(props: PreviewSelectedFileProps) {
  if (!props.file) {
    return null;
  }

  return (
    <div className="flex flex-col justify-start items-start gap-2 my-2 bg-muted p-2 rounded-md text-muted-foreground">
      <div className="flex items-center gap-2">
        <FileBoxIcon className="h-4 w-4 text-green-600" />
        <p className="text-sm font-medium text-ellipsis overflow-hidden whitespace-nowrap">{props.file.name}</p>
      </div>

      <p className="text-sm font-medium text-ellipsis overflow-hidden whitespace-nowrap truncate w-full">
        {props.file.size} bytes ({props.file.type})
      </p>
    </div>
  );
}
