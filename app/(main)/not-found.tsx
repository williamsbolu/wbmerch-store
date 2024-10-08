import Link from "next/link";

export default function NotFound() {
  return (
    <section className="text-center my-20 space-y-4">
      <h1 className="text-3xl font-normal text-center tracking-wider ">
        This page could not be found
      </h1>
      <Link href="/" className="inline-block underline underline-offset-1">
        Return home
      </Link>
    </section>
  );
}
