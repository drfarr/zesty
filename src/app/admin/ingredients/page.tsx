import Ingredients from "@/components/ingredients";
import { API } from "@/lib/api";

export default async function Page() {
  const { data: categories } = await API.getCategories();
  const { data: users } = await API.getUsers();

  return <Ingredients categories={categories} users={users} />;
}
