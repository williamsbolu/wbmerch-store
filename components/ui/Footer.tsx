import Image from "next/image";
import { PiArrowRightThin } from "react-icons/pi";
import { LiaInstagram } from "react-icons/lia";

export default function Footer() {
  return (
    <footer className="bg-white">
      <div className="max-w-screen-xl mx-auto px-5 my-5 flex">
        <form className="flex-1">
          <h1 className="text-lg text-primary mb-3 tracking-wide">
            Subscribe to our emails
          </h1>

          <div className="relative max-w-[360px] flex items-center">
            <input
              type="email"
              placeholder="Enter"
              className="border border-primary rounded-[5px] px-5 h-11 w-full transition-all placeholder:text-[#121212BF] hover:ring-1 hover:ring-primary focus:outline-none"
              required
            />
            <button className="absolute right-2 py-1 px-[2px]">
              <PiArrowRightThin className="w-6 h-5" />
            </button>
          </div>
        </form>

        <button className="p-3 self-end">
          <LiaInstagram className="h-6 w-6" />
        </button>
      </div>

      <div className="h-[1px] bg-[#12121218]"></div>

      <div className="max-w-7xl mx-auto pb-10 pt-14 px-5 space-y-14">
        <form>
          <p className="text-[13px] text-[#121212BF] mb-2">Country/region</p>

          <select className="text-primary border border-primary rounded-[5px] text-[13px] px-4 h-11 focus:outline-none">
            <option value="">Nigeria (NGN &#8358;)</option>
            <option value="">United Kindom (GBP &euro;)</option>
            <option value="">United States (USD &#36;)</option>
          </select>
        </form>

        <p className="text-[11px] text-[#121212BF]">&copy; 2024 - WB</p>
      </div>
    </footer>
  );
}
