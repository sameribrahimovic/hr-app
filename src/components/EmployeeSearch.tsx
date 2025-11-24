"use client";

import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useEffect, useState, useRef } from "react";

interface EmployeeSearchProps {
  basePath?: string;
}

export function EmployeeSearch({ basePath = "/admin/employees" }: EmployeeSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set a new timeout with shorter debounce for smoother experience
    timeoutRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchValue.trim()) {
        params.set("search", searchValue.trim());
        params.set("page", "1"); // Reset to first page on new search
      } else {
        params.delete("search");
        params.delete("page");
      }
      
      startTransition(() => {
        // Use replace instead of push to avoid cluttering browser history
        router.replace(`${basePath}?${params.toString()}`, { scroll: false });
      });
    }, 150); // Reduced to 150ms for faster response

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchValue, router, searchParams, basePath]);

  return (
    <div className="relative w-full max-w-sm">
      {isPending ? (
        <Loader2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 animate-spin" />
      ) : (
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      )}
      <Input
        type="text"
        placeholder="Search employees..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className="pl-10 h-10 sm:h-9 text-sm sm:text-base"
      />
    </div>
  );
}

