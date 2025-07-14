// app/api/dashboard/days-remaining/route.ts

import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const groupBy = searchParams.get("groupBy") || "category"; // 'category' or 'product'

    // Get current date for calculations
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Reset to start of day for accurate comparison

    // Query ingredients with their categories
    const ingredients = await prisma.ingredient.findMany({
      select: {
        id: true,
        name: true,
        weight: true,
        bbeDate: true,
        category: true,
      },
    });

    // Calculate days remaining for each ingredient
    const ingredientsWithDays = ingredients.map((ingredient) => {
      const bbeDate = new Date(ingredient.bbeDate);
      bbeDate.setHours(0, 0, 0, 0);
      const daysRemaining = Math.ceil((bbeDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      return {
        ...ingredient,
        daysRemaining,
        status: getDaysRemainingStatus(daysRemaining),
      };
    });

    let result;

    if (groupBy === "category") {
      // Group by category
      const categoryGroups = ingredientsWithDays.reduce(
        (acc, ingredient) => {
          const categoryName = ingredient.category.name;
          const categoryId = ingredient.category.id;

          if (!acc[categoryId]) {
            acc[categoryId] = {
              categoryId,
              categoryName,
              items: [],
              totalItems: 0,
              totalWeight: 0,
              statusCounts: {
                expired: 0,
                critical: 0,
                warning: 0,
                good: 0,
                longTerm: 0,
              },
            };
          }

          acc[categoryId].items.push(ingredient);
          acc[categoryId].totalItems += 1;
          acc[categoryId].totalWeight += ingredient.weight;
          acc[categoryId].statusCounts[ingredient.status] += 1;

          return acc;
        },
        {} as {
          [categoryId: string]: {
            categoryId: string;
            categoryName: string;
            items: typeof ingredientsWithDays;
            totalItems: number;
            totalWeight: number;
            statusCounts: {
              expired: number;
              critical: number;
              warning: number;
              good: number;
              longTerm: number;
            };
          };
        }
      );

      result = {
        type: "category",
        data: Object.values(categoryGroups).map((group) => ({
          ...group,
          items: undefined,
          averageDaysRemaining:
            group.items.reduce(
              (sum: number, item: { daysRemaining: number }) => sum + item.daysRemaining,
              0
            ) / group.items.length,
        })),
      };
    } else {
      // Group by product (ingredient name)
      const productGroups = ingredientsWithDays.reduce(
        (acc, ingredient) => {
          const productName = ingredient.name;

          if (!acc[productName]) {
            acc[productName] = {
              productName,
              items: [],
              totalItems: 0,
              totalWeight: 0,
              categories: new Set(),
              statusCounts: {
                expired: 0,
                critical: 0,
                warning: 0,
                good: 0,
                longTerm: 0,
              },
            };
          }

          acc[productName].items.push(ingredient);
          acc[productName].totalItems += 1;
          acc[productName].totalWeight += ingredient.weight;
          acc[productName].categories.add(ingredient.category.name);
          acc[productName].statusCounts[ingredient.status] += 1;

          return acc;
        },
        {} as {
          [productName: string]: {
            productName: string;
            items: typeof ingredientsWithDays;
            totalItems: number;
            totalWeight: number;
            categories: Set<string>;
            statusCounts: {
              expired: number;
              critical: number;
              warning: number;
              good: number;
              longTerm: number;
            };
          };
        }
      );

      result = {
        type: "product",
        data: Object.values(productGroups).map((group) => ({
          ...group,
          items: undefined, // Remove items array from response for performance
          categories: Array.from(group.categories),
          averageDaysRemaining:
            group.items.reduce(
              (sum: number, item: { daysRemaining: number }) => sum + item.daysRemaining,
              0
            ) / group.items.length,
        })),
      };
    }

    const allStatuses = ingredientsWithDays.map((i) => i.status);
    const summary = {
      totalItems: ingredientsWithDays.length,
      totalWeight: ingredientsWithDays.reduce((sum, item) => sum + item.weight, 0),
      overallStatusCounts: {
        expired: allStatuses.filter((s) => s === "expired").length,
        critical: allStatuses.filter((s) => s === "critical").length,
        warning: allStatuses.filter((s) => s === "warning").length,
        good: allStatuses.filter((s) => s === "good").length,
        longTerm: allStatuses.filter((s) => s === "longTerm").length,
      },
      averageDaysRemaining:
        ingredientsWithDays.reduce((sum, item) => sum + item.daysRemaining, 0) /
        ingredientsWithDays.length,
    };

    return NextResponse.json({
      success: true,
      ...result,
      summary,
    });
  } catch (error) {
    console.error("Error fetching days remaining data:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

function getDaysRemainingStatus(
  daysRemaining: number
): "expired" | "critical" | "warning" | "good" | "longTerm" {
  if (daysRemaining < 0) return "expired";
  if (daysRemaining <= 3) return "critical";
  if (daysRemaining <= 7) return "warning";
  if (daysRemaining <= 30) return "good";
  return "longTerm";
}
