import { Status } from "@prisma/client";
import { format, isToday } from "date-fns";

export default function OrderStatus({
  status,
  createdAt,
  confirmedAt,
  deliveredAt,
  cancelledAt,
}: {
  status: Status;
  createdAt: Date;
  confirmedAt: Date | null;
  deliveredAt: Date | null;
  cancelledAt: Date | null;
}) {
  // checks for if the order has beed ordered or cancelled
  const orderConfirmedOrCancelled = confirmedAt || cancelledAt;
  const orderDeliveredOrCancelled = deliveredAt || cancelledAt;

  return (
    <div className="flex flex-col items-start px-5 py-6">
      <div className={`relative flex items-start mb-8`}>
        <div className="absolute left-[10px] top-7 h-full border-dotted border-l-2 border-gray-300"></div>

        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center bg-indigo-500`}
        >
          <span className="bg-white w-1 h-1 rounded-full"></span>
        </div>

        <div className="ml-4">
          <p className={`text-sm text-gray-700`}>Order Placed</p>
          <p className="text-gray-500 text-xs">
            {isToday(new Date(createdAt))
              ? "Today"
              : format(new Date(createdAt), "dd-MM-yyyy")}
          </p>
        </div>
      </div>

      <div className={`relative flex items-start mb-8`}>
        <div className="absolute left-[10px] top-7 h-full border-dotted border-l-2 border-gray-300"></div>

        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center bg-indigo-500`}
        >
          <span className="bg-white w-1 h-1 rounded-full"></span>
        </div>

        <div className="ml-4">
          <p className={`text-sm text-gray-700`}>Pending Confirmation</p>
          <p className="text-gray-500 text-xs">
            {isToday(new Date(createdAt))
              ? "Today"
              : format(new Date(createdAt), "dd-MM-yyyy")}
          </p>
        </div>
      </div>

      <div
        className={`relative flex items-start ${
          confirmedAt || cancelledAt ? "mb-8" : ""
        }`}
      >
        {orderConfirmedOrCancelled && (
          <div className="absolute left-[10px] top-7 h-full border-dotted border-l-2 border-gray-300"></div>
        )}

        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center ${
            confirmedAt ? "bg-indigo-500" : "bg-gray-300"
          }`}
        >
          <span className="bg-white w-1 h-1 rounded-full"></span>
        </div>

        <div className="ml-4">
          <p className={`text-sm text-gray-700`}>Waiting to be Shipped</p>
          {confirmedAt && (
            <p className="text-gray-500 text-xs">
              {isToday(new Date(confirmedAt))
                ? "Today"
                : format(new Date(confirmedAt), "dd-MM-yyyy")}
            </p>
          )}

          {!confirmedAt && (
            <p className="text-gray-500 mt-2 text-sm">
              After confirmation, order is to be shipped to the customer.
            </p>
          )}
        </div>
      </div>

      {confirmedAt && (
        <div className={`relative flex items-start mb-8`}>
          <div className="absolute left-[10px] top-7 h-full border-dotted border-l-2 border-gray-300"></div>

          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center bg-indigo-500`}
          >
            <span className="bg-white w-1 h-1 rounded-full"></span>
          </div>

          <div className="ml-4">
            <p className={`text-sm text-gray-700`}>Shipped</p>
            {confirmedAt && (
              <p className="text-gray-500 text-xs">
                {isToday(new Date(confirmedAt))
                  ? "Today"
                  : format(new Date(confirmedAt), "dd-MM-yyyy")}
              </p>
            )}
          </div>
        </div>
      )}

      {confirmedAt && (
        <div
          className={`relative flex items-start ${
            deliveredAt || cancelledAt ? "mb-8" : ""
          }`}
        >
          {orderDeliveredOrCancelled && (
            <div className="absolute left-[10px] top-7 h-full border-dotted border-l-2 border-gray-300"></div>
          )}

          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center ${
              deliveredAt ? "bg-indigo-500" : "bg-gray-300"
            }`}
          >
            <span className="bg-white w-1 h-1 rounded-full"></span>
          </div>

          <div className="ml-4">
            <p className={`text-sm text-gray-700`}>Out For Delivery</p>
            <p className="text-gray-500 text-xs">
              {isToday(new Date(confirmedAt))
                ? "Today"
                : format(new Date(confirmedAt), "dd-MM-yyyy")}
            </p>
            {!deliveredAt && (
              <p className="text-gray-500 mt-2 text-sm">
                Order is out for delivery by the logistics team.
              </p>
            )}
          </div>
        </div>
      )}

      {deliveredAt && (
        <div className={`relative flex items-start`}>
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center bg-green-500`}
          >
            <span className="bg-white w-1 h-1 rounded-full"></span>
          </div>

          <div className="ml-4">
            <p className={`text-sm text-green-600`}>Delivered</p>
            <p className="text-gray-500 text-xs">
              {isToday(new Date(deliveredAt))
                ? "Today"
                : format(new Date(deliveredAt), "dd-MM-yyyy")}
            </p>
            <p className="text-gray-500 mt-2 text-sm">
              item/order has been delivered.
            </p>
          </div>
        </div>
      )}

      {cancelledAt && (
        <div className={`relative flex items-start`}>
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center bg-red-400`}
          >
            <span className="bg-white w-1 h-1 rounded-full"></span>
          </div>

          <div className="ml-4">
            <p className={`text-sm text-red-700`}>Cancelled</p>
            <p className="text-gray-500 text-xs">
              {isToday(new Date(cancelledAt))
                ? "Today"
                : format(new Date(cancelledAt), "dd-MM-yyyy")}
            </p>
            <p className="text-gray-500 mt-2 text-sm">
              item/order has been cancelled.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
