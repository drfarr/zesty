import { auth } from "@/lib/auth";
import { PaginatedResponse } from "@/types/api";
import { IngredientWithCategoryAndOwner } from "@/types/api/ingredients";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "25")));
    const skip = (page - 1) * limit;

    const categoryId = searchParams.get("categoryId");
    const ownerId = searchParams.get("ownerId");
    const search = searchParams.get("search");
    const isActive = searchParams.get("isActive");
    const expiringSoon = searchParams.get("expiringSoon"); // days

    const sortBy = searchParams.get("sortBy") || "bbeDate";
    const sortOrder = searchParams.get("sortOrder") === "desc" ? "desc" : "asc";

    const where: PrismaClient["ingredient"]["findMany"]["arguments"]["where"] = {};

    if (categoryId) {
      // Support both category ID and category name
      if (categoryId.length > 10) {
        // Assume it's a cuid (category ID)
        where.categoryId = categoryId;
      } else {
        // Assume it's a category name
        where.category = {
          name: {
            equals: categoryId,
            mode: "insensitive",
          },
        };
      }
    }

    if (ownerId) {
      where.ownerId = ownerId;
    }

    if (search && search.trim()) {
      where.name = {
        contains: search.trim(),
        mode: "insensitive",
      };
    }

    // Active status filter
    if (isActive !== null && isActive !== undefined && isActive !== "") {
      where.isActive = isActive === "true";
    }

    // Expiring soon filter
    if (expiringSoon) {
      const days = parseInt(expiringSoon);
      if (!isNaN(days) && days > 0) {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + days);
        where.bbeDate = {
          lte: futureDate,
          gte: new Date(), // Only future dates
        };
      }
    }

    const orderBy: Record<string, string> = {};

    const validSortFields = ["name", "weight", "bbeDate", "createdAt", "updatedAt"];

    if (validSortFields.includes(sortBy)) {
      orderBy[sortBy] = sortOrder;
    } else {
      orderBy.bbeDate = "asc"; // default sort by expiry date
    }

    // Execute queries in parallel for performance
    const [ingredients, totalCount] = await Promise.all([
      prisma.ingredient.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              description: true,
              color: true,
            },
          },
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.ingredient.count({ where }),
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    const response: PaginatedResponse<IngredientWithCategoryAndOwner> = {
      data: ingredients,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: totalPages,
        hasNext,
        hasPrev,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching ingredients:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch ingredients",
        details: process.env.NODE_ENV === "development" ? "Failed to fetch ingredients" : undefined,
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const session = await auth();

    console.log(session);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorizezzzzd" }, { status: 401 });
    }

    const { user } = session;
    const ownerId = user.id as string;
    const { name, categoryId, weight, bbeDate } = body;

    if (!name || !categoryId || !weight || !bbeDate) {
      return NextResponse.json(
        { error: "Missing required fields: name, categoryId, weight, bbeDate" },
        { status: 400 }
      );
    }

    // Validate data types
    const parsedWeight = parseFloat(weight);
    if (isNaN(parsedWeight) || parsedWeight <= 0) {
      return NextResponse.json({ error: "Weight must be a positive number" }, { status: 400 });
    }

    // Validate date
    const parsedDate = new Date(bbeDate);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json({ error: "Invalid date format for bbeDate" }, { status: 400 });
    }

    // Validate that category and owner exist
    const [category, owner] = await Promise.all([
      prisma.category.findUnique({ where: { id: categoryId } }),
      prisma.user.findUnique({ where: { id: ownerId } }),
    ]);

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 400 });
    }
    if (!owner) {
      return NextResponse.json({ error: "Owner not found" }, { status: 400 });
    }

    // Create the ingredient
    const ingredient = await prisma.ingredient.create({
      data: {
        name: name.trim(),
        categoryId,
        weight: parsedWeight,
        bbeDate: parsedDate,
        ownerId: owner.id,
        notes: body.notes?.trim() || null,
        isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            description: true,
            color: true,
          },
        },
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(ingredient, { status: 201 });
  } catch (error) {
    console.error("Error creating ingredient:", error);

    return NextResponse.json(
      {
        error: "Failed to create ingredient",
        details: process.env.NODE_ENV === "development" ? "Failed to create ingredient" : undefined,
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export interface CreateIngredientRequest {
  name: string;
  categoryId: string;
  weight: number;
  bbeDate: string;
  ownerId: string;
  notes?: string;
  isActive?: boolean;
}
