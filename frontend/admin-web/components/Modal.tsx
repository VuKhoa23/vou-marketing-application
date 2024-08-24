import React, { useRef } from "react";
import cn from "classnames";

export type ModalProps = {
    children: React.ReactNode;
    open: boolean;
    disableClickOutside?: boolean;
    onClose(): void;
};

export default function Modal({ children, open, disableClickOutside, onClose }: ModalProps) {
    const modalClass = cn({
        "modal modal-bottom sm:modal-middle": true,
        "modal-open": open,
    });

    return (
        <dialog className={modalClass}>
            <div className="modal-box">{children}</div>
        </dialog>
    );
}
