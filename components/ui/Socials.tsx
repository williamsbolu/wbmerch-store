import { signIn } from "next-auth/react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { useSearchParams } from "next/navigation";

export default function Socials() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const onClick = (provider: "google" | "github" | "facebook") => {
    signIn(provider, {
      callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  };

  return (
    <div className="grid gap-[10px]">
      <Button
        href="/register"
        type="button"
        // onClick={() => SignInAction()} // we could also use the onClick prop for the server action
        variation="transparent"
        ring={false}
        classes={["flex justify-center gap-2 h-[45px] items-center"]}
        onClick={() => onClick("google")}
      >
        <Image
          src="https://authjs.dev/img/providers/google.svg"
          alt="Google logo"
          height={19}
          width={19}
        />
        <span className="text-xs">Login with Google</span>
      </Button>
      <Button
        href="/register"
        type="button"
        // onClick={() => SignInAction()} // we could also use the onClick prop for the server action
        variation="transparent"
        ring={false}
        classes={["flex justify-center gap-1 h-[45px] items-center"]}
        onClick={() => onClick("facebook")}
      >
        <Image
          src="https://authjs.dev/img/providers/facebook.svg"
          alt="Google logo"
          height={19}
          width={19}
        />
        <span className="text-xs">Login with Facebook</span>
      </Button>
    </div>
  );
}
