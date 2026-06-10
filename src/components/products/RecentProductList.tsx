import ProductList from "./ProductList";
import { getRecentProducts } from "@/lib/data-service";

export default async function RecentProductList() {
  const products = await getRecentProducts();

  return <ProductList products={products} gridType="section" />;
}
