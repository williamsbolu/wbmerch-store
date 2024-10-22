"use client";

import { useTransition } from "react";
import toast from "react-hot-toast";
import { Settings } from "@prisma/client";
import { useForm } from "react-hook-form";
import Button from "@/components/admin/ui/Button";
import { updateSettings, getLiveUpdates } from "@/actions/settings";

export default function CurrencySettingsForm({
  settings,
}: {
  settings: Settings;
}) {
  const [isPending, startTransition] = useTransition();
  const { register, handleSubmit, reset } = useForm<Settings>({
    defaultValues: settings,
  });

  function handleLiveUpdates() {
    if (confirm("Are you sure you want to use live updates?"))
      startTransition(() => {
        getLiveUpdates(settings.id)
          .then((data) => {
            if (data?.error) {
              toast.error(data.error, {
                position: "top-center",
              });
            }

            if (data.success) {
              toast.success(data.success, {
                position: "top-center",
              });
              reset();
            }
          })
          .catch(() =>
            toast.error("Something went wrong", {
              position: "top-center",
            })
          );
      });
  }

  function handleUpdate(e: React.FocusEvent<HTMLInputElement>, field: string) {
    const value = Number(e.target.value);
    if (!value) return;

    if (confirm("Are you sure you want to update this fleld?"))
      startTransition(() => {
        updateSettings({ [field]: value }, settings.id)
          .then((data) => {
            if (data?.error) {
              toast.error(data.error, {
                position: "top-center",
              });
            }

            if (data.success) {
              toast.success(data.success, {
                position: "top-center",
              });
            }
          })
          .catch(() => toast.error("Something went wrong"));
      });
  }

  const inputStyles =
    "border border-solid border-gray-300 bg-white rounded-[5px] shadow-sm py-2 px-3 focus:outline-2 outline-indigo-600 disabled:bg-gray-200";

  return (
    <div className="flex flex-col items-end gap-3">
      <form
        onSubmit={handleSubmit(() => null)}
        className="py-6 px-10 w-full bg-white border border-gray-200 rounded-lg text-sm space-y-6"
      >
        <div className="grid grid-cols-[200px_1fr_1.2fr] gap-6 items-center">
          <label className="font-medium">Nigerian Naira(₦)</label>
          <input
            type="number"
            className={inputStyles}
            {...register("NGN", {
              onBlur: (e) => handleUpdate(e, "NGN"),
            })}
            disabled={isPending}
          />
        </div>
        <div className="grid grid-cols-[200px_1fr_1.2fr] gap-6 items-center">
          <label className="font-medium">British Pound Sterling(£)</label>
          <input
            type="number"
            className={inputStyles}
            {...register("GBP", {
              onBlur: (e) => handleUpdate(e, "GBP"),
            })}
            disabled={isPending}
          />
        </div>
        <div className="grid grid-cols-[200px_1fr_1.2fr] gap-6 items-center">
          <label className="font-medium">Canadian Dollar($)</label>
          <input
            type="number"
            className={inputStyles}
            {...register("CAD", {
              onBlur: (e) => handleUpdate(e, "CAD"),
            })}
            disabled={isPending}
          />
        </div>
        <div className="grid grid-cols-[200px_1fr_1.2fr] gap-6 items-center">
          <label className="font-medium">Ghanaian Cedi(₵)</label>
          <input
            type="number"
            className={inputStyles}
            {...register("GHS", {
              onBlur: (e) => handleUpdate(e, "GHS"),
            })}
            disabled={isPending}
          />
        </div>
        <div className="grid grid-cols-[200px_1fr_1.2fr] gap-6 items-center">
          <label className="font-medium">Euro(€)</label>
          <input
            type="number"
            className={inputStyles}
            {...register("EUR", {
              onBlur: (e) => handleUpdate(e, "EUR"),
            })}
            disabled={isPending}
          />
        </div>
      </form>

      <Button disabled={isPending} onClick={handleLiveUpdates}>
        Get Live Updates
      </Button>
    </div>
  );
}
