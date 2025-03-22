"use client";

import useSWR from "swr";

const fetcher = async (url) => {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }

  const data = await res.json();
  return data;
};

export function useUsers(filters) {
  // Build query string from filters
  const queryParams = new URLSearchParams();

  if (filters?.role) {
    queryParams.append("role", filters.role);
  }

  if (filters?.search) {
    queryParams.append("search", filters.search);
  }

  const queryString = queryParams.toString();
  const url = `/api/users${queryString ? `?${queryString}` : ""}`;

  const { data, error, isLoading, mutate } = useSWR(url, fetcher);

  return {
    users: data?.users || [],
    isLoading,
    isError: error,
    mutate,
  };
}
