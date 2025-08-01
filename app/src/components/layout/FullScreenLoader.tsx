import { Loader2 } from "lucide-react";

export function FullScreenLoader() {
  return (
    <div className="fixed inset-0 bg-white/75 dark:bg-black/50 flex items-center justify-center z-[1000]">
      <Loader2 className="h-12 w-12 animate-spin text-[#67a626]" />
      {/* optionally add a visually-hidden label for accessibility */}
      <span className="sr-only">Loading...</span>
    </div>
  )
}