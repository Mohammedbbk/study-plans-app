"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

type SearchAndFilterProps = {
  allTags: string[];
  onFiltersChange: (filters: { query: string; selectedTags: string[] }) => void;
};

export function SearchAndFilter({ allTags, onFiltersChange }: SearchAndFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [selectedTags, setSelectedTags] = useState<string[]>(() => {
    const tagsParam = searchParams.get("tags");
    return tagsParam ? tagsParam.split(",").filter(Boolean) : [];
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams();
      
      if (query.trim()) {
        params.set("q", query.trim());
      }
      
      if (selectedTags.length > 0) {
        params.set("tags", selectedTags.join(","));
      }
      
      const newUrl = params.toString() ? `?${params.toString()}` : "/plans";
      router.replace(newUrl, { scroll: false });
    }, 300); 

    return () => clearTimeout(timeoutId);
  }, [query, selectedTags, router]);

  useEffect(() => {
    onFiltersChange({ query: query.trim(), selectedTags });
  }, [query, selectedTags, onFiltersChange]);

  const toggleTag = useCallback((tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  }, []);

  const clearFilters = useCallback(() => {
    setQuery("");
    setSelectedTags([]);
  }, []);

  const hasActiveFilters = query.trim() || selectedTags.length > 0;

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search study plans..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Filter by tags:</span>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-6 px-2 text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Clear all
            </Button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/10 transition-colors"
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
          {query.trim() && (
            <span>Search: "{query.trim()}"</span>
          )}
          {selectedTags.length > 0 && (
            <span>Tags: {selectedTags.join(", ")}</span>
          )}
        </div>
      )}
    </div>
  );
}
