import React, { useState } from "react";
import { Dialog } from "@headlessui/react";

interface recipient {
  email: string;
  copy: "bcc" | "cc" | "mainReciever";
}

export default function attachmentsTable(open) {
  const [files, setFiles] = useState();
  const [fileDisplayArray, setFileDisplayArray] = useState([]);

  const deleteFile = (index) => {
    const dt = new DataTransfer();
    console.log(files);
    console.log(files.files);
    for (let i = 0; i < files.files.length; i++) {
      if (i !== index) {
        dt.items.add(files.files[i]);
      }
    }
    let newElement = files;
    newElement.files = dt.files;
    setFiles(newElement);

    console.log(files.files);
    let tempfiles = [...fileDisplayArray];
    tempfiles.splice(index, 1);
    setFileDisplayArray(tempfiles);
  };

  const saveAttachments = () => {
    // console.log(JSON.stringify(files));
    open.setAttachments(files);
    // localStorage.setItem("attachments", JSON.stringify(files));
    open.closeModal(open._key);
    console.log(files);
  };

  return (
    <Dialog
      className="w-full h-full"
      open={open.isOpen[open._key]}
      onClose={() => open.closeModal(open._key)}
    >
      <Dialog.Panel>
        <Dialog.Title></Dialog.Title>
        <div className="fixed inset-0 flex items-center justify-center p-4 recipient-table">
          <div className="container flex align-middle items-center">
            <div className="bg-modalbackground w-2/3 h-2/3">
              <div className="flex">
                <button
                  className="ml-auto m-2 mr-3 font-bold text-2xl hover:text-red-600"
                  onClick={() => open.closeModal(open._key)}
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
                        Filename
                      </th>

                      <th className="border-b-4 border-tableborders text-2xl pl-2 font-bold text-left w-1/6">
                        DELETE
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {fileDisplayArray !== null &&
                    fileDisplayArray.length > 0 ? (
                      fileDisplayArray.map((file, index) => {
                        return (
                          <tr key={`${file.name} tr`} className="">
                            <th key={`${file.name} empty`}></th>
                            <th
                              key={`${file.name} copy`}
                              className="text-left border-b-4 border-r-4 border-tableborders p-2 uppercase"
                            >
                              {file.name}
                            </th>
                            <th
                              key={`${file.name} delete`}
                              className="text-left border-b-4 border-tableborders p-1"
                            >
                              <a
                                onClick={() => deleteFile(index)}
                                className="bg-tropicalindigo block w-8 h-8 leading-8 text-center font-extrabold ml-1 rounded-full text-black text-xl shadow-4xl hover:cursor-pointer hover:bg-ultraviolet"
                              >
                                X
                              </a>
                            </th>
                          </tr>
                        );
                      })
                    ) : (
                      <tr></tr>
                    )}
                  </tbody>
                </table>
                <div className="container relative">
                  <div className="grid grid-cols-3 w-full absolute bottom-0">
                    <div>
                      <button
                        onClick={() => saveAttachments()}
                        className="bg-tropicalindigo hover:bg-ultraviolet text-black font-bold text-xl p-1 pl-10 pr-10 ml-12 mr-6 mb-4 rounded-2xl"
                      >
                        SAVE
                      </button>
                    </div>
                    <div></div>
                    <div className="ml-auto">
                      <input
                        className="text-black mr-10 text-center text-xl p-1 font-bold w-4/5 outline-none rounded-md"
                        type="file"
                        multiple
                        id="upload"
                        name="subject"
                        placeholder="subject"
                        onChange={(e) => {
                          console.log(e);
                          let tempArray = [...fileDisplayArray];
                          // if (fileDisplayArray) {
                          //   tempArray = files;
                          // } else {
                          //   tempArray = [];
                          // }
                          if (
                            document.getElementById("upload").files !== null
                          ) {
                            tempArray.push(
                              ...document.getElementById("upload").files
                            );
                          }
                          setFileDisplayArray(tempArray);
                          console.log(tempArray);
                          setFiles(document.getElementById("upload"));
                        }}
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
