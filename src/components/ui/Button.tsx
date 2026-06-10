import Link from "next/link";
import ButtonSpinner from "@/components/ui/ButtonSpinner";

type ButtonProps = {
  type: "link" | "button";
  variation: "primary" | "transparent";
  href?: string;
  classes?: string[];
  ring?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
};

export default function Button({
  type,
  variation,
  href,
  classes,
  onClick,
  disabled = false,
  children,
  ring = true,
}: ButtonProps) {
  const primaryColor = !disabled ? "bg-primary" : "bg-primary/85";

  const buttonVariants = {
    primary: `${primaryColor} text-white border border-solid ${
      ring ? "border-primary/40" : "border-primary"
    } ${ring && "hover:ring-1 hover:ring-primary"}`,
    transparent: `border border-solid border-primary/40 ${
      ring && "hover:ring-1 hover:ring-primary"
    }`,
  };

  // There will always be an added class because of the width and the padding
  const addedClasses = classes?.join(" ");

  if (type === "link") {
    return (
      <Link
        href={href!}
        className={`inline-block text-[15px] py-3 tracking-wider rounded-[5px] ${buttonVariants[variation]} ${addedClasses}`}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`inline-block text-[15px] py-3 tracking-wider rounded-[5px] ${buttonVariants[variation]} ${addedClasses} disabled:cursor-not-allowed`}
      disabled={disabled}
    >
      {disabled ? <ButtonSpinner variation={variation} /> : children}
    </button>
  );
}
