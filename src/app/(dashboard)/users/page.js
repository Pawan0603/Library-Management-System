import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { UsersList } from "@/components/users-list"
import { AddUserDialog } from "@/components/add-user-dialog"
import { TableSkeleton } from "@/components/table-skeleton"

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">Manage library users</p>
        </div>
        <AddUserDialog>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </AddUserDialog>
      </div>

      <Suspense fallback={<TableSkeleton columns={4} />}>
        <UsersList />
      </Suspense>
    </div>
  )
}

