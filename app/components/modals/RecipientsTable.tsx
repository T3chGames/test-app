import React, { useState } from "react";
import { Dialog } from "@headlessui/react";

interface recipient {
  email: string;
  copy: "bcc" | "cc" | "mainReciever";
}

export default function RecipientsTable(open) {
  //   console.log(open);
  // let [isOpen, setIsOpen] = useState(open.isOpen);
  let [subject, setSubject] = useState("");
  let [recipients, setRecipients] = useState<recipient[] | []>(
    localStorage.getItem("recipients")
      ? []
      : (JSON.parse(localStorage.getItem("recipients")) as recipient[])
  );

  let inputChange = (e) => {
    setSubject(e.target.value);
    localStorage.setItem("subject", e.target.value);
    console.log(e.target.value);
  };

  let emptyInputFields = () => {
    console.log("reset fields");
    document.getElementById("copy").value = "";
    document.getElementById("emailInput").value = "";
  };

  let checkForMainReciever = (): boolean => {
    if (
      recipients?.some((_recipient) => {
        return _recipient.copy == "mainReciever";
      })
    ) {
      alert("There can only be one main reciever");
      return true;
    } else {
      return false;
    }
  };

  let addRecipient = () => {
    let copy = document.getElementById("copy").value;
    if (copy === "mainReciever") if (checkForMainReciever()) return;

    let email = document.getElementById("emailInput").value;
    if (!(email.length > 0 && copy.length > 0)) {
      alert("fields must be filled in");
      return;
    }
    let recipient = { email: email, copy: copy };
    if (recipients != null) {
      if (
        recipients.some((_recipient) => {
          return _recipient.email == recipient.email;
        })
      ) {
        alert("Error, recipient already exists");
        return;
      } else {
        let tempArray = [...recipients];
        tempArray.push(recipient);
        setRecipients(tempArray);
      }
    } else {
      let tempArray = [recipient];
      setRecipients(tempArray);
    }
    emptyInputFields();
  };

  let removeRecipient = (index) => {
    console.log(index);
    let tempArray = [...recipients];
    tempArray.splice(index, 1);
    console.log(tempArray);
    setRecipients(tempArray);
  };

  let saveRecipients = () => {
    localStorage.setItem("recipients", JSON.stringify(recipients));
    open.setisOpen({ ...open.isOpen, [open._key]: false });
  };

  return (
    <Dialog
      className="w-full h-full"
      open={open.isOpen[open._key]}
      onClose={() => open.setisOpen({ ...open.isOpen, [open._key]: false })}
    >
      <Dialog.Panel>
        <Dialog.Title></Dialog.Title>
        <div className="fixed inset-0 flex items-center justify-center p-4 recipient-table">
          <div className="container flex align-middle items-center">
            <div className="bg-modalbackground w-2/3 h-2/3">
              <div className="flex">
                <button
                  className="ml-auto m-2 mr-3 font-bold text-2xl hover:text-red-600"
                  onClick={() =>
                    open.setisOpen({ ...open.isOpen, [open._key]: false })
                  }
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
                    {recipients !== null
                      ? recipients.map((recipient, index) => {
                          return (
                            <tr key={`${recipient.email} tr`} className="">
                              <th key={`${recipient.email} empty`}></th>
                              <th
                                key={`${recipient.email} email`}
                                className="text-left border-b-4 border-r-4 border-tableborders uppercase"
                              >
                                {recipient.email}
                              </th>
                              <th
                                key={`${recipient.email} copy`}
                                className="text-left border-b-4 border-r-4 border-tableborders p-2 uppercase"
                              >
                                {recipient.copy}
                              </th>
                              <th
                                key={`${recipient.email} delete`}
                                className="text-left border-b-4 border-tableborders p-1"
                              >
                                <a
                                  onClick={() => removeRecipient(index)}
                                  className="bg-tropicalindigo block w-8 h-8 leading-8 text-center font-extrabold ml-1 rounded-full text-black text-xl shadow-4xl hover:cursor-pointer hover:bg-ultraviolet"
                                >
                                  X
                                </a>
                              </th>
                            </tr>
                          );
                        })
                      : ""}

                    <tr className="">
                      <th></th>
                      <th className="text-left border-b-4 border-r-4 border-tableborders text-black">
                        <input
                          type="email"
                          id="emailInput"
                          placeholder="email"
                          className="text-black text-xl font-bold w-2/5 outline-none rounded-md"
                        />
                      </th>
                      <th className="text-left border-b-4 border-r-4 border-tableborders p-2 text-black">
                        <select
                          name=""
                          id="copy"
                          className="font-bold text-black text-xl outline-none rounded-md"
                        >
                          <option value=""></option>
                          <option value="mainReciever">MAIN RECIEVER</option>
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
                      <button
                        onClick={saveRecipients}
                        className="bg-tropicalindigo hover:bg-ultraviolet text-black font-bold text-xl p-1 pl-10 pr-10 ml-12 mr-6 mb-4 rounded-2xl"
                      >
                        SAVE
                      </button>
                      <button
                        onClick={addRecipient}
                        className="bg-tropicalindigo hover:bg-ultraviolet text-black font-bold text-2xl p-1 pl-3 pr-3 mb-4 rounded-full text-center leading-7"
                      >
                        +
                      </button>
                    </div>
                    <div></div>
                    <div className="ml-auto">
                      <input
                        className="text-black mr-10 text-center text-xl p-1 font-bold w-4/5 outline-none rounded-md"
                        type="text"
                        name="subject"
                        placeholder="subject"
                        value={
                          localStorage.getItem("subject") !== null
                            ? localStorage.getItem("subject")
                            : subject
                        }
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
