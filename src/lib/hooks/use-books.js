"use client";

import useSWR from "swr";

const fetcher = async (url) => {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Failed to fetch books");
  }

  const data = await res.json();
  return data;
};

export function useBooks(filters) {
  // Build query string from filters
  const queryParams = new URLSearchParams();

  if (filters?.category) {
    queryParams.append("category", filters.category);
  }

  if (filters?.available !== undefined) {
    queryParams.append("available", String(filters.available));
  }

  if (filters?.search) {
    queryParams.append("search", filters.search);
  }

  const queryString = queryParams.toString();
  const url = `/api/books${queryString ? `?${queryString}` : ""}`;

  const { data, error, isLoading, mutate } = useSWR(url, fetcher);

  return {
    books: data?.books || [],
    isLoading,
    isError: error,
    mutate,
  };
}
