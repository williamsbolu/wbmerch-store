"use client";

import { useOutsideClick } from "@/hooks/useOutsideClick";
import {
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { createPortal } from "react-dom";

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
  type,
  name,
}: {
  children: React.ReactElement;
  type: "menu" | "search-bar";
  name: "menu" | "search-bar";
}) {
  const { openName, close } = useContext(ModalContext);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (name === openName) {
      document.body.classList.add("stop-scrolling");
    } else {
      document.body.classList.remove("stop-scrolling");
    }
  }, [openName, name]);

  const ref = useOutsideClick(close);

  const modelStyles = {
    "search-bar": `fixed left-0 top-0 z-50 h-[90px] w-full bg-white ${
      name === openName ? "translate-y-0" : "-translate-y-[90px]"
    } transition-transform duration-200 ease-in-out`,
    menu: `fixed left-0 top-0 z-50 w-full h-full bg-white overflow-y-auto flex flex-col justify-between min-[350px]:w-[350px] min-[350px]:rounded-r-2xl ${
      name === openName ? "translate-x-0" : "-translate-x-full"
    } transition-transform duration-200 ease-in-out`,
  };

  if (!isClient) {
    return null; // Avoid rendering during SSR because of the document object used in the project
  }

  return (
    <>
      {createPortal(
        <div
          className={`fixed left-0 top-0 h-screen w-full bg-[#12121280] z-40 ${
            name === openName ? "visible opacity-100" : "invisible opacity-0"
          } transition-[opacity] duration-300`}
        ></div>,
        document.body
      )}
      {createPortal(
        <div className={modelStyles[type]} ref={name === openName ? ref : null}>
          {cloneElement(children, { onCloseModal: close })}
        </div>,
        document.body
      )}
    </>
  );
}

Modal.Open = Open;
Modal.Window = Window;

export default Modal;
