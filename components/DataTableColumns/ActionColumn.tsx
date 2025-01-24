import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil } from "lucide-react";
import Link from "next/link";
import DeleteButton from "../DeleteButton";
// import DeleteButton from "../dashboard/New/DeleteButton";

// Define the row type, assuming it holds some data structure
type RowData = {
  id: string;
  title: string;
  slug: string;
  description: string;
  maincategoryId: string;
  createdAt: Date;
  updatedAt: Date | null;
};

type ActionColumnProps = {
  id: string; // ID of the row/item
  row: {
    id: string;
    title?: string;
    slug?: string;
    description?: string;
    maincategoryId?: string;
    createdAt: Date;
    updatedAt: Date | null;
  }; // The row data
  model?: string; // Add the model prop here
  editEndpoint?: string; // URL for edit action
  deleteEndpoint: string; // API endpoint for the delete action
  resourceName: string; // Name of the resource (e.g., "Product")
  redirectAfterDelete: string; // Redirect path after deletion
  additionalActions?: Array<{ label: string; onClick: () => void }>; // Optional additional actions
};


export default function ActionColumn({
  id,
  row,
  model, // Accept the model prop
  editEndpoint,
  deleteEndpoint,
  resourceName,
  redirectAfterDelete,
  additionalActions = [],
}: ActionColumnProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuSeparator />

        <DropdownMenuLabel>
          <h2>Actions for {row.title}</h2> {/* Use row data here */}
        </DropdownMenuLabel>

        {/* Reusable DeleteButton */}
        <DropdownMenuItem>
          <DeleteButton
            apiEndPoint={deleteEndpoint} // Dynamic delete endpoint
            resource={resourceName} // Resource name (e.g., "Product")
            redirect={redirectAfterDelete} // Redirect path after deletion
            id={id} // ID of the item to delete
          />
        </DropdownMenuItem>

        {/* Edit Action */}
        {editEndpoint && (
          <DropdownMenuItem>
            <Link href={editEndpoint} className="flex items-center gap-2">
              <Pencil className="w-4 h-4" />
              <span>Edit</span>
            </Link>
          </DropdownMenuItem>
        )}

        {/* Additional Actions */}
        {additionalActions.map((action, index) => (
          <DropdownMenuItem key={index} onClick={action.onClick}>
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

