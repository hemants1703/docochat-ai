import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function QuotaExceeded() {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <p className="text-sm text-gray-500">You have reached the maximum number of files available.</p>{" "}
      <Button asChild variant={"link"}>
        <Link prefetch={true} href="/chat">
          Go to chat
        </Link>
      </Button>
    </div>
  );
}
