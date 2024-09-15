import slugify from "slugify";
import { Sizes } from "@/utils/types";

export function calculateStock(sizes: Sizes): number {
  return sizes.s + sizes.m + sizes.l + sizes.xl + sizes.xxl + sizes.xxxl;
}

export function generateSlug(name: string): string {
  return slugify(name, { lower: true, remove: /[*+~.()'"!:@]/g });
}
