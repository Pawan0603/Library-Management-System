"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Book } from "lucide-react";

export default function SetupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSeedDatabase = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/seed");
      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.message || data.error || "Failed to seed database");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <Book className="h-12 w-12" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Library Management System</CardTitle>
          <CardDescription className="text-center">Setup your library system with initial data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">{error}</div>}

          {result && (
            <div className="rounded-md bg-green-50 p-3 text-sm text-green-600">
              <p className="font-medium">{result.message}</p>
              {result.data && (
                <div className="mt-2">
                  <p className="font-medium">Default login credentials:</p>
                  <ul className="mt-1 list-disc pl-5">
                    {result.data.users.map((user, index) => (
                      <li key={index}>
                        <strong>{user.email}</strong> / {user.password}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {!result && (
            <div className="text-center">
              <p className="mb-4">This will create sample data including books and user accounts.</p>
              <Button onClick={handleSeedDatabase} disabled={isLoading} className="w-full">
                {isLoading ? "Setting up..." : "Initialize Library System"}
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter>
          {result && (
            <Button onClick={() => router.push("/login")} className="w-full">
              Go to Login
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}