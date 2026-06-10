"use client";

import ModalContainer from "@/components/ui/ModalContainer";
import Button from "@/components/admin/ui/Button";
import ProductForm from "@/components/admin/products/ProductForm";

export default function AddProducts() {
  return (
    <div>
      <ModalContainer>
        <ModalContainer.Open opens="add-product">
          <Button>Add Product</Button>
        </ModalContainer.Open>
        <ModalContainer.Window name="add-product">
          <ProductForm />
        </ModalContainer.Window>
      </ModalContainer>
    </div>
  );
}
