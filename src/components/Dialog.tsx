import React, { ReactNode } from "react";
import { PropsWithChildren, useEffect, useState } from "react";
import { createPortal } from "react-dom";

const Portal = ({ children }: PropsWithChildren) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    return mounted ? createPortal(<>{children}</>, document.body) : null;
};

interface Props {
    isOpen: boolean;
    onClose: () => void;
    children?: ReactNode;
    blur?: boolean;
}

const Icon = () => (
    <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
        />
    </svg>
);

const Dialog = ({ isOpen, onClose, blur = false, children }: Props) => {
    if (!isOpen) {
        return null;
    }

    return (
        <Portal>
            <div className="fixed inset-0 z-[2000] flex items-center justify-center ">
                <div
                    onClick={onClose}
                    className={`fixed inset-0 bg-black/30  ${
                        blur ? "backdrop-blur-sm" : ""
                    }`}
                ></div>
                <div className="relative bg-white p-6 rounded shadow-md">
                    {children}
                </div>
            </div>
        </Portal>
    );
};

export default Dialog;
