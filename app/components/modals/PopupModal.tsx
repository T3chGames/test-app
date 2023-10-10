import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

export default function popup(content) {
  // const [open, setIsOpen] = useState(content.isOpen);
  return (
    <Dialog
      className=" w-full h-full"
      open={content.isOpen[content._key]}
      onClose={() => content.closeModal(content._key)}
    >
      <Dialog.Panel>
        <Dialog.Title></Dialog.Title>
        <div className="fixed inset-0 flex items-center justify-center p-4 recipient-table">
          <div className="container flex align-middle items-center mt-96">
            <div className="bg-modalbackground w-1/4 h-1/3 p-4">
              <div className="flex">
                {content.title}
                <button
                  className="ml-auto m-2 mr-3 font-bold text-2xl hover:text-red-600"
                  onClick={() => content.closeModal(content._key)}
                >
                  X
                </button>
              </div>
              {content.content}
              <div className="action-buttons">{content.action}</div>
            </div>
          </div>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
