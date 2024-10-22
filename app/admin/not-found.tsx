import Link from "next/link";

export default function NotFound() {
  return (
    <section className="bg-gray-50 flex items-center justify-center p-12">
      <div className="bg-white border border-solid border-gray-100 rounded-[7px] p-12 flex-grow-0 flex-shrink text-center">
        <h1 className="mb-8 text-2xl font-semibold">
          This page could not be found 😪
        </h1>

        <Link className="" href="/admin">
          &larr; Go back
        </Link>
      </div>
    </section>
  );
}
