export default function PaymentFailed() {
  return (
    <section className="max-w-[1100px] mt-[90px] py-32 mx-auto flex flex-col justify-center items-center gap-5 px-4">
      <h1 className="text-2xl tracking-wide text-center md:text-3xl">
        Your payment was not successful!
      </h1>

      <p className="tracking-wide text-center text-sm md:text-base">
        Try initiating another payment or contact our support concerning any
        issues contacted.
      </p>
    </section>
  );
}
