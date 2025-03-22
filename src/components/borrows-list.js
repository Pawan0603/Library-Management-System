"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useBorrows } from "@/lib/hooks/use-borrows"
import { returnBook } from "@/lib/borrow-actions"
import { toast } from "sonner"
import { formatDate } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export function BorrowsList() {
  const [status, setStatus] = useState("active")
  const [showOverdue, setShowOverdue] = useState(false)

  const filters = {}
  if (status === "active") filters.returned = false
  else if (status === "returned") filters.returned = true
  if (showOverdue) filters.overdue = true

  const { borrows, isLoading, mutate } = useBorrows(filters)

  const handleReturn = async (borrowId) => {
    try {
      await returnBook(borrowId)
      mutate()
      toast("Book returned",{
        description: "The book has been successfully returned.",
      })
    } catch (error) {
      toast.error("Error",{
        description: "Failed to return the book.",
      })
    }
  }

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date()
  }

  if (isLoading) {
    return <div>Loading borrows...</div>
  }

  return (
    <>
      <div className="mb-6 space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="returned">Returned</SelectItem>
            </SelectContent>
          </Select>

          {status !== "returned" && (
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showOverdue"
                checked={showOverdue}
                onChange={(e) => setShowOverdue(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="showOverdue" className="text-sm font-medium">
                Show Overdue Only
              </label>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Book</TableHead>
              <TableHead>Borrowed By</TableHead>
              <TableHead>Borrowed Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {borrows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No borrowed books found
                </TableCell>
              </TableRow>
            ) : (
              borrows.map((borrow) => (
                <TableRow key={borrow._id}>
                  <TableCell className="font-medium">{borrow.book.title}</TableCell>
                  <TableCell>{borrow.user.name}</TableCell>
                  <TableCell>{formatDate(borrow.borrowDate)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {formatDate(borrow.dueDate)}
                      {!borrow.returnDate && isOverdue(borrow.dueDate) && <Badge variant="destructive">Overdue</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>
                    {!borrow.returnDate && (
                      <Button size="sm" onClick={() => handleReturn(borrow._id)}>
                        Return
                      </Button>
                    )}
                    {borrow.returnDate && (
                      <span className="text-sm text-muted-foreground">Returned on {formatDate(borrow.returnDate)}</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
