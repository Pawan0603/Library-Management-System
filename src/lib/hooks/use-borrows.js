"use client";

import useSWR from "swr";

const fetcher = async (url) => {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Failed to fetch borrows");
  }

  const data = await res.json();
  return data;
};

export function useBorrows(filters) {
  // Build query string from filters
  const queryParams = new URLSearchParams();

  if (filters?.userId) {
    queryParams.append("userId", filters.userId);
  }

  if (filters?.bookId) {
    queryParams.append("bookId", filters.bookId);
  }

  if (filters?.returned !== undefined) {
    queryParams.append("returned", String(filters.returned));
  }

  if (filters?.overdue !== undefined) {
    queryParams.append("overdue", String(filters.overdue));
  }

  const queryString = queryParams.toString();
  const url = `/api/borrows${queryString ? `?${queryString}` : ""}`;

  const { data, error, isLoading, mutate } = useSWR(url, fetcher);

  return {
    borrows: data?.borrows || [],
    isLoading,
    isError: error,
    mutate,
  };
}
