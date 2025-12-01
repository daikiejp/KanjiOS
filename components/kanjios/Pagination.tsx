import { Button } from "@/components/ui/button";
import { PaginationProps } from "@/types/index";

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="mt-6 flex justify-center space-x-2">
      {Array.from({ length: totalPages }, (_, i) => (
        <Button
          key={i}
          onClick={() => onPageChange(i + 1)}
          variant={currentPage === i + 1 ? "default" : "outline"}
          className={
            currentPage === i + 1
              ? "bg-[#29ABE2] text-white hover:bg-[#29ABE2]"
              : "bg-slate-100"
          }
        >
          {i + 1}
        </Button>
      ))}
    </div>
  );
}
