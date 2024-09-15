import { BiLoaderAlt } from "react-icons/bi";

export default function ButtonSpinner({
  variation = "primary",
}: {
  variation: "primary" | "transparent";
}) {
  return (
    <BiLoaderAlt
      className={`w-6 h-6 animate-spin ${
        variation === "primary" ? "" : "text-primary/80"
      }`}
    />
  );
}
