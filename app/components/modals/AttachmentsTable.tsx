import React, { useState } from "react";
import { Dialog } from "@headlessui/react";

interface recipient {
  email: string;
  copy: "bcc" | "cc" | "mainReciever";
}

export default function attachmentsTable(open) {
  const [files, setFiles] = useState(
    open.attachments.length > 0 ? open.attachments : []
  );

  const deleteFile = (index) => {
    let tempfiles = [...files];
    tempfiles.splice(index, 1);

    setFiles(tempfiles);
  };

  const saveAttachments = () => {
    open.setAttachments(files);
    console.log(files);
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
                        Filename
                      </th>

                      <th className="border-b-4 border-tableborders text-2xl pl-2 font-bold text-left w-1/6">
                        DELETE
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {files.length > 0 ? (
                      files.map((file, index) => {
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
                          //   let tempArray;
                          //   if (files !== undefined) {
                          //     tempArray = files;
                          //   } else {
                          //     tempArray = [];
                          //   }
                          let tempArray = [...files];
                          if (
                            document.getElementById("upload").files !== null
                          ) {
                            tempArray.push(
                              ...document.getElementById("upload").files
                            );
                            setFiles(tempArray);
                          }
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
