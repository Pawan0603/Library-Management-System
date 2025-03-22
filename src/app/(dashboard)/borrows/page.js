import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { BorrowsList } from "@/components/borrows-list"
import { BorrowBookDialog } from "@/components/borrow-book-dialog"
import { TableSkeleton } from "@/components/table-skeleton"

export default function BorrowsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Borrowed Books</h1>
          <p className="text-muted-foreground">Manage book borrowing and returns</p>
        </div>
        <BorrowBookDialog>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Borrow Book
          </Button>
        </BorrowBookDialog>
      </div>

      <Suspense fallback={<TableSkeleton columns={5} />}>
        <BorrowsList />
      </Suspense>
    </div>
  )
}

