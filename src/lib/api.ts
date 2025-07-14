import { PaginatedResponse } from "@/types/api";
import { IngredientsQueryParams, IngredientWithCategoryAndOwner } from "@/types/api/ingredients";
import { Category } from "@/types/db";
import { User } from "@prisma/client";

export class API {
  private static getBaseUrl(): string {
    // Check if we're on the client side
    if (typeof window !== "undefined") {
      return "/api";
    }

    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const host = process.env.VERCEL_PROJECT_PRODUCTION_URL || "localhost:3000";
    return `${protocol}://${host}/api`;
  }

  static async getUsers(): Promise<PaginatedResponse<User>> {
    const baseUrl = this.getBaseUrl() + "/users";
    const response = await fetch(baseUrl);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    return data;
  }

  static async getDaysRemainingByCategory(): Promise<PaginatedResponse<Category[]>> {
    const baseUrl = this.getBaseUrl() + "/analytics/ingredients/days-remaining?groupBy=category";
    const response = await fetch(baseUrl);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  }

  static async getCategories(): Promise<PaginatedResponse<Category>> {
    const baseUrl = this.getBaseUrl() + "/categories";

    console.log(baseUrl, "BASEURL");
    const response = await fetch(baseUrl);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  static async getIngredients(
    params: IngredientsQueryParams = {}
  ): Promise<PaginatedResponse<IngredientWithCategoryAndOwner>> {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const baseUrl = this.getBaseUrl() + "/ingredients";
    const url = `${baseUrl}?${searchParams.toString()}`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  static async createIngredient(ingredient: {
    name: string;
    categoryId: string;
    weight: number;
    bbeDate: string;
    notes?: string;
  }): Promise<IngredientWithCategoryAndOwner[]> {
    const baseUrl = this.getBaseUrl() + "/ingredients";

    const response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ingredient),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  static async deleteIngredient(id: string): Promise<void> {
    const baseUrl = this.getBaseUrl() + `/ingredient/${id}`;

    const response = await fetch(baseUrl, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }
  }
}
