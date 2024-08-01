
"use client";

import { Button, Modal } from "flowbite-react";
import { useParams } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";


export interface IModal {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    confirm: () => void
}

export function DeleteModal({ confirm, open, setOpen }: IModal) {

    const { id } = useParams<{ id: string; }>() || { id: null }

    function handleConfirm() {
        confirm()
        setOpen(false)
    }

    return (
        <>
            <Modal show={open} size="md" onClose={() => setOpen(false)} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Você tem certeza que deseja confirmar a ação?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" onClick={handleConfirm}>
                                {"Sim, tenho certeza."}
                            </Button>
                            <Button color="gray" onClick={() => setOpen(false)}>
                                Não, cancelar.
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}
