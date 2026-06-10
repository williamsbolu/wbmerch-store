export default function CartTableHead() {
  return (
    <thead>
      <tr>
        <th className="text-[#121212BF] text-[10px] font-normal uppercase text-left tracking-widest pb-[18px]">
          Product
        </th>
        <th className="hidden text-[#121212BF] text-[10px] font-normal uppercase text-center tracking-widest pb-[18px] md:block">
          Quantity
        </th>
        <th className="text-[#121212BF] text-[10px] font-normal uppercase text-right tracking-widest pb-[18px]">
          Total
        </th>
      </tr>
    </thead>
  );
}
