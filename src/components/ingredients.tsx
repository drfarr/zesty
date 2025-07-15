"use client";

import { PlusIcon } from "lucide-react";
import { useState } from "react";

import DataTable from "./datatable";
import { Button } from "./ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

interface CreateIngredientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

import { useToast } from "@/hooks/use-toast";
import { API } from "@/lib/api";
import { Category, User } from "@/types/db";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface CreateIngredientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories?: Category[];
}

interface IngredientForm {
  name: string;
  categoryId: string;
  weight: string;
  bbeDate: string;
  notes: string;
}

function CreateIngredientDialog({ open, onOpenChange, categories }: CreateIngredientDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [ingredientForm, setIngredientForm] = useState<IngredientForm>({
    name: "",
    categoryId: "",
    weight: "",
    bbeDate: "",
    notes: "",
  });

  const handleClose = () => {
    onOpenChange(false);

    setIngredientForm({
      name: "",
      categoryId: "",
      weight: "",
      bbeDate: "",
      notes: "",
    });
  };

  const handleInputChange = (field: keyof IngredientForm, value: string) => {
    setIngredientForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCreateIngredient = async () => {
    setIsLoading(true);
    try {
      await API.createIngredient({
        name: ingredientForm.name,
        categoryId: ingredientForm.categoryId,
        weight: parseFloat(ingredientForm.weight),
        bbeDate: ingredientForm.bbeDate,
        notes: ingredientForm.notes,
      });

      handleClose();
      toast({
        title: "Ingredient Created",
        description: "Your ingredient has been successfully created.",
      });
    } catch (error) {
      console.error("Error creating ingredient:", error);
      toast({
        title: "Error Creating Ingredient",
        description: "There was an error creating the ingredient. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    ingredientForm.name.trim() !== "" &&
    ingredientForm.categoryId !== "" &&
    ingredientForm.weight.trim() !== "" &&
    ingredientForm.bbeDate !== "" &&
    !isNaN(parseFloat(ingredientForm.weight)) &&
    parseFloat(ingredientForm.weight) > 0;

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split("T")[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Ingredient</DialogTitle>
          <DialogDescription>
            Add a new ingredient to your inventory. Fill in the required fields below.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name *
            </Label>
            <Input
              id="name"
              value={ingredientForm.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="col-span-3"
              placeholder="e.g., Apple, Milk (Whole)"
            />
          </div>

          {categories && categories?.length > 0 && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category *
              </Label>
              <Select
                value={ingredientForm.categoryId}
                onValueChange={(value) => handleInputChange("categoryId", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                  {categories.length === 0 && (
                    <SelectItem value="no-categories" disabled>
                      No categories available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="weight" className="text-right">
              Weight (kg) *
            </Label>
            <Input
              id="weight"
              type="number"
              step="0.01"
              min="0.01"
              value={ingredientForm.weight}
              onChange={(e) => handleInputChange("weight", e.target.value)}
              className="col-span-3"
              placeholder="Weight in kilograms"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="bbeDate" className="text-right">
              Best Before *
            </Label>
            <Input
              id="bbeDate"
              type="date"
              value={ingredientForm.bbeDate}
              onChange={(e) => handleInputChange("bbeDate", e.target.value)}
              className="col-span-3"
              min={today}
            />
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="notes" className="text-right">
              Notes
            </Label>
            <Textarea
              id="notes"
              value={ingredientForm.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              className="col-span-3"
              placeholder="Optional notes about the ingredient"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleCreateIngredient}
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? "Creating..." : "Create Ingredient"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
interface DashboardPageProps {
  categories: Category[];
  users: User[];
}

export default function IngredientsPage({ categories, users }: DashboardPageProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <Button onClick={handleOpenDialog}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Create Ingredient
        </Button>
      </div>
      <div className="px-4 lg:px-6">
        <DataTable users={users} />
      </div>

      <CreateIngredientDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        categories={categories}
      />
    </div>
  );
}
