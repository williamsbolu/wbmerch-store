"use client";

import { getExchangeRates } from "@/lib/data-service";
import { createContext, useContext, useEffect, useState } from "react";

export type Currency = "USD" | "NGN" | "EUR" | "GBP" | "CAD" | "GHS";

type CurrencyContextType = {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  rates: Record<string, number>;
  convertPrice: (amount: number) => number;
};

export const CurrencyContext = createContext<CurrencyContextType>({
  currency: "USD",
  setCurrency: () => {},
  rates: {},
  convertPrice: () => 0,
});

export const CurrencyProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currency, setCurrency] = useState<Currency>("USD");
  const [rates, setRates] = useState<Record<string, number>>({});
  console.log({ rates });

  const fetchRates = async () => {
    try {
      const fetchedRates = await getExchangeRates();
      setRates(fetchedRates!);
    } catch (err) {
      console.log({ err });
      setCurrency("USD");
    }
  };

  useEffect(() => {
    // Ensure localStorage is only accessed in the client
    if (typeof window !== "undefined") {
      const storedCurrency = localStorage.getItem("currency") as Currency;
      if (storedCurrency) {
        setCurrency(storedCurrency);
      } else {
        localStorage.setItem("currency", "USD");
      }
    }

    fetchRates();
  }, []);

  const setCurrencyHandler = (currency: Currency) => {
    localStorage.setItem("currency", currency);
    setCurrency(currency as Currency);
  };

  const convertPrice = (amount: number) => {
    return rates[currency] ? amount * rates[currency] : amount;
  };

  return (
    <CurrencyContext.Provider
      value={{ currency, setCurrency: setCurrencyHandler, rates, convertPrice }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};
