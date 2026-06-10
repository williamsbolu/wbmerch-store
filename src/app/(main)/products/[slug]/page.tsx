import { products } from "@prisma/client";
import ProductImageSlider from "@/components/products/ProductImageSlider";
import { getProduct } from "@/lib/data-service";
import ProductDetail from "@/components/products/ProductDetail";
import { ProductDetailtypes } from "@/utils/types";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const { name } = (await getProduct(params.slug)) as ProductDetailtypes;

  return {
    title: name,
  };
}

export default async function page({ params }: { params: { slug: string } }) {
  const product = (await getProduct(params.slug)) as products;

  return (
    <section className="max-w-[1100px] mt-5 mb-12 mx-auto px-4 grid grid-cols-1 gap-10 md:grid-cols-2 md:mb-10 md:gap-8 lg:gap-12 md:px-5 min-[1140px]:px-0">
      <ProductImageSlider
        coverImage={product.coverImage}
        images={product?.images || []}
        slug={product.slug}
      />

      <ProductDetail productInfo={product} />
    </section>
  );
}
