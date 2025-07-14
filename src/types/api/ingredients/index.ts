import { Category, Ingredient, User } from "@/types/db";
import { SortOrder } from "..";

export type IngredientSortField = "name" | "weight" | "bbeDate" | "createdAt" | "updatedAt";
export type IngredientWithCategoryAndOwner = Omit<Ingredient, "categoryId" | "ownerId"> & {
  category: Pick<Category, "id" | "name" | "description" | "color">;
  owner: Pick<User, "id" | "name" | "email">;
};
export interface IngredientsQueryParams {
  page?: number;
  limit?: number;
  categoryId?: string;
  ownerId?: string;
  search?: string;

  expiringSoon?: number;
  sortBy?: Pick<Ingredient, "name" | "weight" | "bbeDate" | "createdAt" | "updatedAt">;
  sortOrder?: SortOrder;
}
