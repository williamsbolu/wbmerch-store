import Product from "@/components/products/Product";
import Pagination from "../ui/Pagination";

type TProduct = {
  id: string;
  name: string;
  price: number;
  coverImage: string;
  slug: string;
};

type ProductListProps = {
  gridType?: "section" | "page";
  products: TProduct[];
  count?: number;
};

export default function ProductList({
  products,
  gridType = "page",
  count,
}: ProductListProps) {
  return (
    <div className="space-y-16">
      <ul
        className={`grid ${
          gridType === "section"
            ? "grid-cols-2 gap-x-3 gap-y-5 md:grid-cols-3 md:gap-x-4 md:gap-y-8 mb-10"
            : "grid-cols-2 gap-x-3 gap-y-5 md:grid-cols-4 md:gap-y-8 lg:gap-x-5"
        }`}
      >
        {products.map((product) => (
          <Product key={product.id} product={product} />
        ))}
      </ul>

      {gridType === "page" && <Pagination count={count!} />}
    </div>
  );
}
