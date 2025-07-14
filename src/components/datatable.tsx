"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useIngredients } from "@/hooks/use-ingredients";
import { useToast } from "@/hooks/use-toast";
import { API } from "@/lib/api";
import { SortOrder } from "@/types/api";
import { IngredientSortField as SortField } from "@/types/api/ingredients";
import { User } from "@prisma/client";
import dayjs from "dayjs";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Calendar,
  MoreHorizontal,
  RefreshCw,
  Search,
  Star,
  Trash,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

interface SortableTableHeadProps {
  field: SortField;
  currentSort: SortField;
  currentOrder: SortOrder;
  onSort: (field: SortField) => void;
  children: React.ReactNode;
  className?: string;
}

export function SortableTableHead({
  field,
  currentSort,
  currentOrder,
  onSort,
  children,
  className,
}: SortableTableHeadProps) {
  const isSorted = currentSort === field;

  const getSortIcon = () => {
    if (!isSorted) return <ArrowUpDown className="ml-2 h-4 w-4" />;
    return currentOrder === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  return (
    <TableHead className={className}>
      <Button
        variant="ghost"
        onClick={() => onSort(field)}
        className="h-auto p-0 font-medium hover:bg-transparent"
      >
        {children}
        {getSortIcon()}
      </Button>
    </TableHead>
  );
}

export default function IngredientsDataTable({ users }: { users: User[] }) {
  const {
    data,
    loading,
    error,
    pagination,
    filters,
    sorting,
    updatePagination,
    updateFilters,
    updateSorting,
    refetch,
  } = useIngredients();

  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const { data: session } = useSession();
  const { toast } = useToast();

  const handleDeleteIngredient = async (ingredientId: string, ingredientName: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${ingredientName}"? This action cannot be undone.`
      )
    ) {
      try {
        await API.deleteIngredient(ingredientId);
        await refetch();
        toast({
          title: "Ingredient deleted",
          description: `"${ingredientName}" has been successfully deleted.`,
        });
      } catch (error) {
        toast({
          title: "Error deleting ingredient",
          description: `Failed to delete "${ingredientName}". Please try again later.`,
          variant: "destructive",
        });
        console.error("Error deleting ingredient:", error);
      }
    }
  };

  const toggleFavorite = (ingredientId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(ingredientId)) {
        newFavorites.delete(ingredientId);
      } else {
        newFavorites.add(ingredientId);
      }
      return newFavorites;
    });
  };

  const getInitials = (name: string) => {
    if (!name) return "??";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getCategoryColor = (color: string | null) => {
    return color || "#6b7280"; // Default gray
  };

  const isExpiringSoon = (bbeDate: string | Date) => {
    const now = new Date();
    const expiry = new Date(bbeDate);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ingredients</CardTitle>
          <CardDescription>An error occurred while loading ingredients</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md bg-red-50 p-4 text-red-800 dark:bg-red-950 dark:text-red-200">
            {error}
          </div>
          <Button className="mt-4" onClick={refetch}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Ingredients</CardTitle>
          <CardDescription>
            Manage your ingredient inventory ({pagination.total} total items)
          </CardDescription>
        </div>
        <Button onClick={refetch} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </CardHeader>

      {loading && data.length === 0 ? (
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="size-8 animate-spin rounded-full border-b-2 border-primary" />
          </div>
        </CardContent>
      ) : (
        <CardContent>
          {/* Filters */}
          <div className="mb-6 flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search ingredients..."
                value={filters.search}
                onChange={(e) => updateFilters({ search: e.target.value })}
                className="pl-10"
              />
            </div>

            <Select
              value={filters.categoryId || "all"}
              onValueChange={(value) => updateFilters({ categoryId: value === "all" ? "" : value })}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="fruit">Fruit</SelectItem>
                <SelectItem value="dairy">Dairy</SelectItem>
                <SelectItem value="bakery">Bakery</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.ownerId || "all"}
              onValueChange={(value) => updateFilters({ ownerId: value === "all" ? "" : value })}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="All Owners" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Owners</SelectItem>
                {users.map((owner) => (
                  <SelectItem key={owner.id} value={owner.id}>
                    {owner.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.expiringSoon || "all"}
              onValueChange={(value) =>
                updateFilters({ expiringSoon: value === "all" ? "" : value })
              }
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Expiry Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Items</SelectItem>
                <SelectItem value="7">Expiring in 7 days</SelectItem>
                <SelectItem value="14">Expiring in 14 days</SelectItem>
                <SelectItem value="30">Expiring in 30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Star className="h-4 w-4" />
                  </TableHead>
                  <SortableTableHead
                    field="name"
                    currentSort={sorting.sortBy}
                    currentOrder={sorting.sortOrder}
                    onSort={updateSorting}
                  >
                    Name
                  </SortableTableHead>
                  <SortableTableHead
                    field="weight"
                    currentSort={sorting.sortBy}
                    currentOrder={sorting.sortOrder}
                    onSort={updateSorting}
                  >
                    Weight (kg)
                  </SortableTableHead>
                  <SortableTableHead
                    field="bbeDate"
                    currentSort={sorting.sortBy}
                    currentOrder={sorting.sortOrder}
                    onSort={updateSorting}
                  >
                    Best Before Date
                  </SortableTableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Owner</TableHead>
                  <SortableTableHead
                    field="createdAt"
                    currentSort={sorting.sortBy}
                    currentOrder={sorting.sortOrder}
                    onSort={updateSorting}
                  >
                    Added
                  </SortableTableHead>
                  <TableHead className="w-[50px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                      No ingredients found. Try adjusting your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((ingredient) => (
                    <TableRow key={ingredient.id}>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-transparent"
                          onClick={() => toggleFavorite(ingredient.id)}
                        >
                          <Star
                            className={`h-4 w-4 transition-colors ${
                              favorites.has(ingredient.id)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300 hover:text-yellow-400"
                            }`}
                          />
                        </Button>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {isExpiringSoon(ingredient.bbeDate) && (
                            <AlertTriangle className="h-4 w-4 text-orange-500" />
                          )}
                          {ingredient.name}
                        </div>
                      </TableCell>
                      <TableCell>{ingredient.weight.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span
                            className={
                              isExpiringSoon(ingredient.bbeDate)
                                ? "text-orange-600 font-medium"
                                : ""
                            }
                          >
                            {dayjs(ingredient.bbeDate).format("MMM DD, YYYY")}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          style={{
                            backgroundColor: getCategoryColor(ingredient.category.color),
                            color: "white",
                          }}
                        >
                          {ingredient.category.name}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {getInitials(ingredient.owner?.name || "")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{ingredient.owner?.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {dayjs(ingredient.createdAt).format("MMM DD, YYYY")}
                      </TableCell>
                      <TableCell>
                        {session?.user?.id === ingredient.owner.id && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-600"
                                onClick={() =>
                                  handleDeleteIngredient(ingredient.id, ingredient.name)
                                }
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rows per page:</span>
              <Select
                value={pagination.limit.toString()}
                onValueChange={(value) => updatePagination({ limit: parseInt(value, 10), page: 1 })}
              >
                <SelectTrigger className="w-[70px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Page {pagination.page} of {pagination.pages} ({pagination.total} total)
              </span>

              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updatePagination({ page: 1 })}
                  disabled={!pagination.hasPrev || loading}
                >
                  First
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updatePagination({ page: pagination.page - 1 })}
                  disabled={!pagination.hasPrev || loading}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updatePagination({ page: pagination.page + 1 })}
                  disabled={!pagination.hasNext || loading}
                >
                  Next
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updatePagination({ page: pagination.pages })}
                  disabled={!pagination.hasNext || loading}
                >
                  Last
                </Button>
              </div>
            </div>
          </div>

          {loading && (
            <div className="mt-4 flex items-center justify-center">
              <div className="size-4 animate-spin rounded-full border-b-2 border-primary" />
              <span className="ml-2 text-sm text-muted-foreground">Loading...</span>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
