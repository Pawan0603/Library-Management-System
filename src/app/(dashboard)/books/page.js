import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { BooksList } from "@/components/books-list"
import { AddBookDialog } from "@/components/add-book-dialog"
import { TableSkeleton } from "@/components/table-skeleton"

export default function BooksPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Books</h1>
          <p className="text-muted-foreground">Manage your library books</p>
        </div>
        <AddBookDialog>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Book
          </Button>
        </AddBookDialog>
      </div>

      <Suspense fallback={<TableSkeleton columns={5} />}>
        <BooksList />
      </Suspense>
    </div>
  )
}

