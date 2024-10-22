import CurrencySettingsForm from "@/components/admin/settings/CurrencySettingsForm";
import UserSettingsForm from "@/components/admin/settings/UserSettingsForm";
import { getSettings } from "@/data/settings";

export default async function Page() {
  const settings = await getSettings();

  return (
    <>
      <h1 className="text-2xl font-semibold">Update Settings</h1>
      <UserSettingsForm settings={settings!} />

      <div className="space-y-[10px]">
        <h3 className="font-medium text-base px-2">Currency Rates to USD</h3>
        <CurrencySettingsForm settings={settings!} />
      </div>
    </>
  );
}
