import { PiArrowRightThin } from "react-icons/pi";
import { LiaInstagram } from "react-icons/lia";
import CurrencySwitcher from "@/components/ui/CurrencySwitcher";
import SubscriptionForm from "@/components/ui/SubscriptionForm";

export default function Footer() {
  return (
    <footer className="bg-white">
      <div className="max-w-screen-xl mx-auto px-5 my-5 flex">
        <SubscriptionForm />

        <button className="p-3 self-end">
          <LiaInstagram className="h-6 w-6" />
        </button>
      </div>

      <div className="h-[1px] bg-[#12121218]"></div>

      <div className="max-w-7xl mx-auto pb-10 pt-14 px-5 space-y-14">
        <CurrencySwitcher />
        <p className="text-[11px] text-[#121212BF]">&copy; 2024 - WB</p>
      </div>
    </footer>
  );
}
