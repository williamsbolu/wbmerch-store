"use client";

import { Order, Status } from "@prisma/client";
import {
  PieChart,
  ResponsiveContainer,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const startData = [
  { currency: "USD", value: 0, color: "#ef4444" },
  { currency: "NGN", value: 0, color: "#4ade80" },
  { currency: "GBP", value: 0, color: "#1e40af" },
  { currency: "EUR", value: 0, color: "#fde047" },
  { currency: "GHS", value: 0, color: "#14b8a6" },
  { currency: "CAD", value: 0, color: "#fca5a5" },
];

type dataProp = {
  currency: string;
  value: number;
  color: string;
};

type OrderProp = {
  currency: string;
  status: Status;
  totalAmount: string;
  rateToUsd: number;
  createdAt: Date;
};

function prepareData(startData: dataProp[], orders: OrderProp[]) {
  function incArrayValue(arr: dataProp[], field: string) {
    return arr.map((obj) =>
      obj.currency === field ? { ...obj, value: obj.value + 1 } : obj
    );
  }

  const data = orders
    .filter((order) => order.status === "delivered")
    .reduce((arr, cur) => {
      if (cur.currency === "USD") return incArrayValue(arr, "USD");
      if (cur.currency === "NGN") return incArrayValue(arr, "NGN");
      if (cur.currency === "GBP") return incArrayValue(arr, "GBP");
      if (cur.currency === "CAD") return incArrayValue(arr, "CAD");
      if (cur.currency === "EUR") return incArrayValue(arr, "EUR");
      if (cur.currency === "GHS") return incArrayValue(arr, "GHS");

      return arr;
    }, startData)
    .filter((obj) => obj.value > 0);

  return data;
}

export default function CurrencyChart({ orders }: { orders: OrderProp[] }) {
  const data = prepareData(startData, orders);

  return (
    <div className="col-span-2 bg-white border border-solid border-gray-200 rounded-lg py-6 px-8">
      <h2 className="text-xl font-semibold leading-snug mb-4">
        Sales by Currency
      </h2>

      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            nameKey="currency"
            dataKey="value"
            innerRadius={85}
            outerRadius={110}
            cx="50%"
            cy="50%"
            paddingAngle={3}
          >
            {data.map((entry) => (
              <Cell
                fill={entry.color}
                stroke={entry.color}
                key={entry.currency}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend
            verticalAlign="middle"
            align="right"
            width={100}
            // width={"30%"}
            layout="vertical"
            iconSize={15}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
