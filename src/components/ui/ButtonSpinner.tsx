import { BiLoaderAlt } from "react-icons/bi";

export default function ButtonSpinner({
  variation = "primary",
  type = "default",
}: {
  variation: "primary" | "transparent";
  type?: "default" | "small";
}) {
  return (
    <BiLoaderAlt
      className={`animate-spin ${type === "default" ? "w-6 h-6" : "w-5 h-5"} ${
        variation === "primary" ? "" : "text-primary/80"
      }`}
    />
  );
}

// Primary uses the inherited color of the component using this buttonSpinner component
