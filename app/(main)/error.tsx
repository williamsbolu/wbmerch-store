"use client";

import Button from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="flex justify-center items-center flex-col gap-4 my-20">
      <h2 className="text-3xl font-normal text-center tracking-wider">
        Something went wrong!
      </h2>
      <p className="text-base tracking-wide text-center">{error.message}</p>
      <Button
        type="button"
        variation="primary"
        ring={false}
        classes={["px-6 mt-2"]}
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </Button>
    </section>
  );
}
