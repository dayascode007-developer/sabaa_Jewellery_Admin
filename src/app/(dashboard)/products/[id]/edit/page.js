import AddProductForm from "@/components/products/AddProductForm";

export const metadata = {
  title: "Edit Product - SaBaa Jewellery Admin",
};

export default function EditProduct({ params }) {
  return <AddProductForm productId={params.id} />;
}
