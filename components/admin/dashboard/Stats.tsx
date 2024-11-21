"use client";

import React from "react";
import Stat from "@/components/admin/dashboard/Stat";
import {
  HiOutlineBanknotes,
  HiOutlineBriefcase,
  HiOutlineUser,
} from "react-icons/hi2";
import { MdOutlinePendingActions } from "react-icons/md";
import { Status } from "@prisma/client";
import { formatCurrency } from "@/utils/helpers";

type OrderProp = {
  currency: string;
  status: Status;
  totalAmount: string;
  rateToUsd: number;
  createdAt: Date;
};

export default function Stats({
  orders,
  userCount,
}: {
  orders: OrderProp[];
  userCount: number;
}) {
  // We convert all the totals of all to orders based on different currencies to dollar for use to caculate the total sales.
  const sales = orders.reduce((acc, order) => {
    if (order.status === "delivered") {
      const priceInUsd = formatCurrency(
        Number(order.totalAmount) / order.rateToUsd
      );
      // console.log({ priceInUsd, totalAmount: order.totalAmount });
      return Number(priceInUsd) + acc;
    }
    return acc;
  }, 0);

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  ).length;

  return (
    <>
      <Stat
        title="Sales"
        color="green"
        icon={<HiOutlineBanknotes className="w-8 h-8 text-green-700" />}
        amount={sales}
      />
      <Stat
        title="Orders"
        color="sky"
        icon={<HiOutlineBriefcase className="w-8 h-8 text-sky-700" />}
        value={totalOrders}
      />
      <Stat
        title="Pending orders"
        color="yellow"
        icon={<MdOutlinePendingActions className="w-8 h-8 text-yellow-700" />}
        value={pendingOrders}
      />
      <Stat
        title="Registered users"
        color="sky"
        icon={<HiOutlineUser className="w-8 h-8 text-sky-700" />}
        value={userCount}
      />
    </>
  );
}
