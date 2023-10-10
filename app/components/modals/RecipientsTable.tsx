import React, { useState } from "react";
import { Dialog } from "@headlessui/react";

interface recipient {
  email: string;
  copy: "bcc" | "cc" | "mainReciever";
}

export default function RecipientsTable(content) {
  //   console.log(content);
  // let [isOpen, setIscontent] = useState(content.isOpen);

  let [recipients, setRecipients] = useState(
    localStorage.getItem("recipients")
      ? JSON.parse(localStorage.getItem("recipients"))
      : { reciever: [], cc: [], bcc: [] }
  );

  // let [recipients, setRecipients] = useState<recipient[] | []>(
  //   localStorage.getItem("recipients")
  //     ? []
  //     : (JSON.parse(localStorage.getItem("recipients")) as recipient[])
  // );

  let inputChange = (e) => {
    content.setSubject(e.target.value);
    localStorage.setItem("subject", e.target.value);
    console.log(e.target.value);
  };

  let emptyInputFields = () => {
    console.log("reset fields");
    document.getElementById("copy").value = "";
    document.getElementById("emailInput").value = "";
  };

  // let checkForMainReciever = (): boolean => {
  //   if (
  //     recipients?.some((_recipient) => {
  //       return _recipient.copy == "mainReciever";
  //     })
  //   ) {
  //     alert("There can only be one main reciever");
  //     return true;
  //   } else {
  //     return false;
  //   }
  // };

  let addRecipient = () => {
    let _recipients = JSON.parse(JSON.stringify(recipients));
    let checkDuplicate = (array, item) => {
      if (array.lenght > 0) {
        return false;
      }
      if (
        array.some((_item) => {
          return _item == item;
        })
      ) {
        alert("Duplicate item");
      } else {
        return false;
      }
    };

    let email = document.getElementById("emailInput").value;
    let copy = document.getElementById("copy").value;
    if (!(email.length > 0 && copy.length > 0)) {
      alert("fields must be filled in");
      return;
    }

    console.log(copy);
    switch (copy) {
      case "mainReciever":
        _recipients.reciever = [email];
        break;
      case "cc":
        !checkDuplicate(_recipients.cc, email)
          ? _recipients.cc.push(email)
          : "";
        break;
      case "bcc":
        !checkDuplicate(_recipients.bcc, email)
          ? _recipients.bcc.push(email)
          : "";
        break;
    }
    console.log(_recipients);
    setRecipients(_recipients);
    emptyInputFields();
  };

  let removeRecipient = (key, index) => {
    console.log(recipients[key][index]);
    let _recipient = JSON.parse(JSON.stringify(recipients));
    _recipient[key].splice(index, 1);
    console.log(_recipient);
    setRecipients(_recipient);
  };

  let saveRecipients = () => {
    localStorage.setItem("recipients", JSON.stringify(recipients));
    content.closeModal(content._key);
  };

  return (
    <Dialog
      className="w-full h-full"
      open={content.isOpen[content._key]}
      onClose={() => content.closeModal(content._key)}
    >
      <Dialog.Panel>
        <Dialog.Title></Dialog.Title>
        <div className="fixed inset-0 flex items-center justify-center p-4 recipient-table">
          <div className="container flex align-middle items-center">
            <div className="bg-modalbackground w-2/3 h-2/3">
              <div className="flex">
                <button
                  className="ml-auto m-2 mr-3 font-bold text-2xl hover:text-red-600"
                  onClick={() => content.closeModal(content._key)}
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
                    {Object.keys(recipients).map((key) => {
                      if (recipients[key].length > 0) {
                        return recipients[key].map((item, index) => {
                          console.log(item);
                          console.log(recipients[key].length);
                          return (
                            <tr key={`${key + item} tr`} className="">
                              <th key={`${key + item}} empty`}></th>
                              <th
                                key={`${key + item} email`}
                                className="text-left border-b-4 border-r-4 border-tableborders uppercase"
                              >
                                {item}
                              </th>
                              <th
                                key={`${key + item} copy`}
                                className="text-left border-b-4 border-r-4 border-tableborders p-2 uppercase"
                              >
                                {key}
                              </th>
                              <th
                                key={`${key + item} delete`}
                                className="text-left border-b-4 border-tableborders p-1"
                              >
                                <a
                                  onClick={() => removeRecipient(key, index)}
                                  className="bg-tropicalindigo block w-8 h-8 leading-8 text-center font-extrabold ml-1 rounded-full text-black text-xl shadow-4xl hover:cursor-pointer hover:bg-ultraviolet"
                                >
                                  X
                                </a>
                              </th>
                            </tr>
                          );
                        });
                      }
                    })}

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
                            : content.subject
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
