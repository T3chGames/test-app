import React, { useState } from "react";
import { Dialog } from "@headlessui/react";

interface recipient {
  email: string;
  copy: "bcc" | "cc";
}

export default function table(open) {
  //   console.log(open);
  let [isOpen, setIsOpen] = useState(open.open);
  let [subject, setSubject] = useState("");
  let [recipients, setRecipients] = useState<recipient[] | undefined>(
    undefined
  );

  let inputChange = (e) => {
    setSubject(e.target.value);
    console.log(e.target.value);
  };

  let addRecipient = () => {
    let email = document.getElementById("emailInput").value;
    let copy = document.getElementById("copy").value;
    let recipient = { email: email, copy: copy };
    if (recipients != undefined) {
      recipients.push(recipient);
      setRecipients(recipients);
    } else {
      let tempArray = [recipient];
      setRecipients(tempArray);
    }
  };

  return (
    <Dialog
      className="w-full h-full"
      open={isOpen}
      onClose={() => open.setIsOpen(false)}
    >
      <Dialog.Panel>
        <Dialog.Title></Dialog.Title>
        <div className="fixed inset-0 flex items-center justify-center p-4 recipient-table">
          <div className="container flex align-middle items-center">
            <div className="bg-modalbackground w-2/3 h-2/3">
              <div className="flex">
                <button
                  className="ml-auto m-2 mr-3 font-bold text-2xl hover:text-red-600"
                  onClick={() => open.setIsOpen(false)}
                >
                  X
                </button>
              </div>
              <div className="container flex bg-modalbackground">
                <table className="mr-12">
                  <thead>
                    <tr>
                      <th className="w-4"></th>
                      <th className="border-b-4 border-r-4 border-tableborders text-2xl font-bold uppercase text-left">
                        Recipient email
                      </th>
                      <th className="border-b-4 border-r-4 border-tableborders text-2xl pl-2 font-bold text-left">
                        BCC/CC
                      </th>
                      <th className="border-b-4 border-tableborders text-2xl pl-2 font-bold text-left w-1/6">
                        DELETE
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recipients !== undefined
                      ? recipients.map((recipient) => {
                          "abc";
                          //   <tr className="">
                          //     <th></th>
                          //     <th className="text-left border-b-4 border-r-4 border-tableborders">
                          //       {recipient.email}
                          //     </th>
                          //     <th className="text-left border-b-4 border-r-4 border-tableborders p-2">
                          //       {recipient.copy}
                          //     </th>
                          //     <th className="text-left border-b-4 border-tableborders p-2">
                          //       DELETE
                          //     </th>
                          //   </tr>;
                          {
                            console.log(recipients);
                          }
                        })
                      : ""}

                    <tr className="">
                      <th></th>
                      <th className="text-left border-b-4 border-r-4 border-tableborders text-black">
                        <input type="email" id="emailInput" />
                      </th>
                      <th className="text-left border-b-4 border-r-4 border-tableborders p-2 text-black">
                        <select name="" id="copy">
                          <option value=""></option>
                          <option value="bcc">BCC</option>
                          <option value="cc">CC</option>
                        </select>
                      </th>
                      <th className="text-left border-b-4 border-tableborders p-2">
                        DELETE
                      </th>
                    </tr>
                  </tbody>
                </table>
                <div className="container relative">
                  <div className="grid grid-cols-3 w-full absolute bottom-0">
                    <div>
                      <button className="bg-tropicalindigo text-black font-bold text-xl p-1 pl-10 pr-10 ml-12 mr-6 mb-4 rounded-2xl">
                        SAVE
                      </button>
                      <button
                        onClick={addRecipient}
                        className="bg-tropicalindigo text-black font-bold text-2xl p-1 pl-3 pr-3 mb-4 rounded-full text-center leading-7"
                      >
                        +
                      </button>
                    </div>
                    <div></div>
                    <div className="ml-auto">
                      <input
                        className="text-black mr-10 text-center text-xl p-1 font-bold w-4/5 outline-none rounded-md"
                        type="text"
                        name="title"
                        placeholder="title"
                        id=""
                        onChange={(e) => inputChange(e)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
