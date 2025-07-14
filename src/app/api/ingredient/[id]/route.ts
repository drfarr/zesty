// app/api/ingredients/[id]/route.ts
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const data = await prisma?.ingredient.findFirst({
      where: { id, ownerId: session.user.id as string },
    });

    if (!data) {
      return NextResponse.json(
        { error: "Ingredient not found or you do not have permission to delete it" },
        { status: 404 }
      );
    }

    await prisma?.ingredient.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        message: "Ingredient deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting ingredient:", error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Invalid input",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    // Handle database errors
    if (error instanceof Error) {
      // Check for specific database errors
      if (error.message.includes("foreign key constraint")) {
        return NextResponse.json(
          { error: "Cannot delete ingredient: it is referenced by other records" },
          { status: 409 }
        );
      }
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
