import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { addQueryParameter } from "@/lib/utils";
import queryString from "query-string";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

export const PaginationFooter: FC<{ maxPagination?: number }> = ({
  maxPagination = 3,
}) => {
  const n = useNavigate();
  const { page = "1" } = queryString.parse(location.search) as {
    view: "grid" | "list";
    page?: string;
  };

  const onPageChange = (page: number) => {
    n(`?${addQueryParameter("page", page.toString())}`);
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className=" cursor-pointer"
            onClick={() => onPageChange(Math.max(1, parseInt(page) - 1))}
          />
        </PaginationItem>
        {Array.from({ length: maxPagination }, (_, i) => i + 1).map(
          (pageNum) => (
            <PaginationItem key={pageNum}>
              <PaginationLink
                isActive={pageNum === parseInt(page)}
                onClick={() => onPageChange(pageNum)}
                size="sm"
                className="rounded-md cursor-pointer"
              >
                {pageNum}
              </PaginationLink>
            </PaginationItem>
          )
        )}
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            className=" cursor-pointer"
            onClick={() => onPageChange(parseInt(page) + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
