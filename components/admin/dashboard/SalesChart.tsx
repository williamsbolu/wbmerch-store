"use client";

import { formatCurrency } from "@/utils/helpers";
import { Status } from "@prisma/client";
import {
  eachDayOfInterval,
  format,
  formatDate,
  isSameDay,
  subDays,
} from "date-fns";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type OrderProp = {
  currency: string;
  status: Status;
  totalAmount: string;
  rateToUsd: number;
  createdAt: Date;
};

export default function SalesChart({
  orders,
  numDays,
}: {
  orders: OrderProp[];
  numDays: number;
}) {
  const allDates = eachDayOfInterval({
    start: subDays(new Date(), numDays - 1),
    end: new Date(),
  });

  const data = allDates.map((date) => {
    return {
      label: formatDate(date, "MMM dd"),
      totalSales: orders
        .filter((order) => isSameDay(date, new Date(order.createdAt)))
        .reduce((acc, cur) => {
          if (cur.status === "delivered") {
            // Convert the totalAmount to USD the default currency, because many of the totals are in different currencies
            const priceInUsd = formatCurrency(
              Number(cur.totalAmount) / cur.rateToUsd
            );
            return Number(priceInUsd) + acc;
          }
          return acc;
        }, 0),
    };
  });

  const colors = {
    totalSales: { stroke: "#4f46e5", fill: "#c7d2fe" },
    text: "#374151",
    background: "#fff",
  };

  return (
    <div className="col-span-full bg-white border border-solid border-gray-200 rounded-lg p-8 flex flex-col gap-6">
      <h2 className="text-xl font-semibold leading-snug">
        Sales in USD from {format(allDates.at(0)!, "MMM dd yyyy")} &mdash;{" "}
        {format(allDates.at(-1)!, "MMM dd yyyy")}{" "}
      </h2>

      <ResponsiveContainer height={300} width="100%">
        <AreaChart data={data} height={300} width={700}>
          <XAxis
            dataKey="label"
            tick={{ fill: colors.text }}
            tickLine={{ stroke: colors.text }}
          />
          <YAxis
            unit="$"
            tick={{ fill: colors.text }}
            tickLine={{ stroke: colors.text }}
          />
          <CartesianGrid strokeDasharray="4" />
          <Tooltip contentStyle={{ backgroundColor: colors.background }} />
          <Area
            dataKey="totalSales"
            type="monotone"
            stroke={colors.totalSales.stroke}
            fill={colors.totalSales.fill}
            strokeWidth={2}
            name="Total Sales"
            unit="$"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
