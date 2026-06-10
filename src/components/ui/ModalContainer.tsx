"use client";

import { useOutsideClick } from "@/hooks/useOutsideClick";
import { cloneElement, createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { HiXMark } from "react-icons/hi2";

type ModalContextValues = {
  openName: string | null;
  close: () => void;
  open: (id: string) => void;
};
export const ModalContext = createContext<ModalContextValues>({
  openName: "" || null,
  close: () => {},
  open: (id: string) => {},
});

function Modal({ children }: { children: React.ReactNode }) {
  const [openName, setOpenName] = useState<string | null>("");

  const close = () => setOpenName(null);
  const open = setOpenName;

  const contextValue: ModalContextValues = {
    openName,
    close,
    open,
  };

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
    </ModalContext.Provider>
  );
}

function Open({
  children,
  opens: opensWindowName,
}: {
  children: React.ReactElement;
  opens: string;
}) {
  const { open } = useContext(ModalContext);

  // we clone the button after passing the onClick prop
  return cloneElement(children, { onClick: () => open(opensWindowName) });
}

function Window({
  children,
  name,
}: {
  children: React.ReactElement;
  name: string;
}) {
  const { openName, close } = useContext(ModalContext);

  const ref = useOutsideClick(close);

  if (name !== openName) return null;

  // if the name is equal to the currently opened window
  return createPortal(
    <div className="fixed left-0 top-0 z-30 h-screen w-full backdrop-blur-sm bg-[#00000052] transition-all duration-500">
      <div
        ref={ref}
        className={`${
          name.startsWith("delete")
            ? "w-[90%] min-[440px]:w-auto top-[45%]"
            : "top-2/4"
        } fixed left-2/4 z-40 h-fit shadow-md -translate-x-2/4 -translate-y-2/4 backdrop:blur-lg overflow-y-auto rounded-[10px] bg-white transition-all duration-500`}
      >
        <button
          onClick={close}
          className="absolute right-4 top-3 rounded-md border-none bg-none p-1"
        >
          <HiXMark className="h-6 w-6 text-[#1F1F1F]" />
        </button>

        <div>{cloneElement(children, { onCloseModal: close })}</div>
      </div>
    </div>,
    document.body
  );
}

Modal.Open = Open;
Modal.Window = Window;

export default Modal;
