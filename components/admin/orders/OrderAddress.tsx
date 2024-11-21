import { OrderAddressType } from "@/utils/types";

export default function OrderAddress({
  heading,
  address,
}: {
  heading: string;
  address: OrderAddressType;
}) {
  return (
    <div className="bg-white border border-solid border-gray-200 rounded-[7px]">
      <div className="px-5 py-4 border-b border-solid border-gray-200">
        <h2 className="font-medium text-base">{heading}</h2>
      </div>
      <div className="py-4 px-5 space-y-2 text-sm">
        <p className="text-gray-500">
          {address.firstName} {address.lastName}
        </p>
        <p className="text-gray-500">{address.phone}</p>
        <p className="text-gray-500">{address.address}</p>
        <p className="text-gray-500">
          {address.state} - {address.postalCode}
        </p>
        <p className="text-gray-500">{address.country}</p>
      </div>
    </div>
  );
}
