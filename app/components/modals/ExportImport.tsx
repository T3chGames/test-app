import { Dialog, Tab } from "@headlessui/react";
import { useState } from "react";

// function for joining classes together for the styling of tabs
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// load a template into the editor

function loadTemplate(unlayer, template) {
  if (template == undefined) {
    unlayer?.loadBlank();
    return;
  }
  if (Object.hasOwn(template, "templateData")) {
    localStorage.setItem("design", template.templateData);
    template = JSON.parse(template.templateData);
  }

  if (Object.hasOwn(template, "body") && Object.hasOwn(template, "counters")) {
    unlayer?.loadDesign(template);
  } else {
    alert("Please make sure the file is a template!");
  }
}

export default function ExportImportModal(content: any) {
  const [fileName, setFileName] = useState("");
  const [importedTemplate, setImportedTemplate] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const [user, setUser] = useState(localStorage.getItem("user"));

  // export template to json and then to a json file
  const exportJson = () => {
    const unlayer = content.unlayer;

    unlayer?.saveDesign((design) => {
      const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
        JSON.stringify(design)
      )}`;
      const link = document.createElement("a");
      link.href = jsonString;
      link.download = fileName.length ? `${fileName}.json` : "template.json";

      link.click();
    });
  };

  // convert a blob to a file by adding a lastmodified date and name

  const blobToFile = (theBlob: Blob, fileName: string): File => {
    const b: any = theBlob;
    b.lastModifiedDate = new Date();
    b.name = fileName;

    return theBlob as File;
  };

  // make a request to the backend to convert html to a pdf

  const exportPDF = async () => {
    let fdata = new FormData();
    fdata.append("html[]", content.html);
    const requestOptions = {
      body: fdata,
      method: "POST",
    };
    await fetch(`http://127.0.0.1:8000/api/download`, requestOptions).then(
      (response) => {
        response.blob().then((file) => {
          const fileURL = window.URL.createObjectURL(
            blobToFile(file, "joe.pdf")
          );

          // downloading the pdf
          let alink = document.createElement("a");
          alink.href = fileURL;
          alink.download = `${fileName}.pdf`;
          alink.click();
        });
      }
    );
  };

  // function for handeling a file upload

  const onFileUpload = (file) => {
    if (!file.length) {
      return;
    }
    setUploadedFileName(file[0].name);
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      let result = JSON.parse(reader.result);
      if (Object.keys(result).length > 0) {
        setImportedTemplate(result);
        localStorage.setItem("design", JSON.stringify(result));
      } else {
        return alert("empty file");
      }
    });
    reader.readAsText(file[0]);
  };

  return (
    <Dialog
      className="w-full h-full"
      open={content.isOpen[content._key]}
      onClose={() => content.closeModal(content._key)}
    >
      <Dialog.Panel>
        <Dialog.Title></Dialog.Title>
        <div className="fixed inset-0 flex items-center justify-center p-4 max-h-[120rem]">
          <div className="container flex align-middle items-center sm:mt-[2rem] mt-40 md:mb-16 md:h-3/4 sm:h-3/5 sm:mb-40">
            <div className="bg-modalbackground w-2/5 h-2/4 sm:h-[32rem] p-4">
              <div className="flex">
                <h1 className="font-bold text-3xl ml-auto uppercase">
                  Import/Export templates
                </h1>
                <button
                  className="ml-auto m-2 mr-3 font-bold text-2xl hover:text-red-600"
                  onClick={() => content.closeModal(content._key)}
                >
                  X
                </button>
              </div>
              <div className="h-3/5">
                <div className="w-full max-w-md px-2 py-4 sm:px-0 ml-auto mr-auto">
                  <Tab.Group>
                    <Tab.List className="flex space-x-1 rounded-xl bg-tropicalindigo p-1">
                      {user !== null ? (
                        <Tab
                          key="Import"
                          className={({ selected }) =>
                            classNames(
                              "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-white",
                              " focus:outline-none ",
                              selected
                                ? "bg-ultraviolet shadow"
                                : "text-white hover:bg-[#4f517db0] hover:text-white"
                            )
                          }
                        >
                          Import
                        </Tab>
                      ) : (
                        ""
                      )}
                      <Tab
                        key="Export"
                        className={({ selected }) =>
                          classNames(
                            "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-white",
                            " focus:outline-none ",
                            selected
                              ? "bg-ultraviolet shadow"
                              : "text-white hover:bg-[#4f517db0] hover:text-white"
                          )
                        }
                      >
                        Export
                      </Tab>
                      <Tab
                        key="ImportJson"
                        className={({ selected }) =>
                          classNames(
                            "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-white",
                            " focus:outline-none ",
                            selected
                              ? "bg-ultraviolet shadow"
                              : "text-white hover:bg-[#4f517db0] hover:text-white"
                          )
                        }
                      >
                        Import JSON
                      </Tab>
                    </Tab.List>
                    <Tab.Panels className="mt-2">
                      {user !== null ? (
                        <Tab.Panel
                          key="import"
                          className={classNames(
                            "rounded-xl bg-white p-3",
                            "focus:outline-none h-72"
                          )}
                        >
                          {renderTemplates(content.templates, content.unlayer)}
                        </Tab.Panel>
                      ) : (
                        ""
                      )}
                      <Tab.Panel
                        key="download"
                        className="rounded-xl bg-white p-1 
                        focus:outline-none"
                      >
                        <div className="grid grid-cols-2">
                          <div className="text-left">
                            <input
                              className="text-black outline-none h-full w-full"
                              placeholder="Filename"
                              type="text"
                              onChange={(e) => setFileName(e.target.value)}
                            />
                          </div>
                          <div className="text-right">
                            <button
                              className="text-white pr-2 p-1 w-40 ml-2 rounded-md bg-darkslate text-center"
                              onClick={exportJson}
                            >
                              DOWNLOAD JSON
                            </button>
                            <button
                              className="text-white mt-2 w-40 pr-2 p-1 ml-2 rounded-md bg-darkslate text-center"
                              onClick={exportPDF}
                            >
                              DOWNLOAD PDF
                            </button>
                          </div>
                        </div>
                      </Tab.Panel>
                      <Tab.Panel
                        key="import json"
                        className={classNames(
                          "rounded-xl bg-white p-3",
                          "focus:outline-none h-60"
                        )}
                      >
                        <h1 className="text-xl font-bold text-black">
                          Selected file:{" "}
                          {uploadedFileName == null ? "" : uploadedFileName}
                        </h1>
                        <input
                          type="file"
                          accept=".json"
                          onChange={(e) => onFileUpload(e.target.files)}
                        />
                        <button
                          className="bg-ultraviolet p-1 pl-2 pr-2 rounded-md text-xl mt-2"
                          onClick={() =>
                            loadTemplate(content.unlayer, importedTemplate)
                          }
                        >
                          Import
                        </button>
                      </Tab.Panel>
                    </Tab.Panels>
                  </Tab.Group>
                </div>
              </div>
              <div className="action-buttons mt-20">
                <button
                  id="save"
                  className="bg-tropicalindigo hover:bg-ultraviolet text-black font-bold text-xl p-1 pl-10 pr-10 ml-14 mr-6 mb-4 md:mt-4 sm:mt-44 rounded-2xl"
                  onClick={() => content.closeModal(content._key)}
                >
                  SAVE
                </button>
              </div>
            </div>
          </div>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}

function renderTemplates(templates, unlayer) {
  const filterOnPublic = (publicTemplate: boolean) => {
    let filteredTemplates = templates.filter((item) => {
      // returns the public templates
      if (publicTemplate) {
        if (item.publicTemplate > 0) {
          return item;
        } else {
          return;
        }
      } else {
        return item;
      }
    });
    return filteredTemplates;
  };

  return (
    <Tab.Group>
      <Tab.List className="flex space-x-1 rounded-xl bg-tropicalindigo p-1">
        <Tab
          key="Import"
          className={({ selected }) =>
            classNames(
              "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-white",
              " focus:outline-none ",
              selected
                ? "bg-ultraviolet shadow"
                : "text-white hover:bg-[#4f517db0] hover:text-white"
            )
          }
        >
          Personal
        </Tab>
        <Tab
          key="Export"
          className={({ selected }) =>
            classNames(
              "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-white",
              " focus:outline-none ",
              selected
                ? "bg-ultraviolet shadow"
                : "text-white hover:bg-[#4f517db0] hover:text-white"
            )
          }
        >
          Populair
        </Tab>
      </Tab.List>
      <Tab.Panels className="mt-2 max-h-56">
        <Tab.Panel
          key="export"
          className={classNames(
            "rounded-xl bg-white p-3",
            "focus:outline-none",
            "md:h-32",
            "sm:h-30"
          )}
        >
          <ul className="overflow-y-scroll h-[12rem]">
            <li
              key="blank"
              className="relative rounded-md p-3 hover:bg-gray-100"
            >
              <h3 className="text-sm font-medium text-black leading-5">
                Blank canvas
              </h3>

              <ul className="mt-1 flex space-x-1 text-xs font-normal leading-4 text-gray-500">
                <li>&middot;</li>
                <li>A blank canvas</li>
                {/* <li>&middot;</li> */}
                {/* <li>{template.timesUsed} users</li> */}
              </ul>

              <a
                onClick={() => loadTemplate(unlayer, undefined)}
                className={classNames(
                  "absolute inset-0 rounded-md",
                  "ring-blue-400 focus:z-10 focus:outline-none focus:ring-2"
                )}
              />
            </li>
            {filterOnPublic(false).map((template, index) => (
              <li
                id="templateCard"
                key={template.id}
                className="relative rounded-md p-3 hover:bg-gray-100"
              >
                <h3 className="text-sm font-medium text-black leading-5">
                  {template.name}
                </h3>

                <ul className="mt-1 flex space-x-1 text-xs font-normal leading-4 text-gray-500">
                  {/* <li>{new Date(template.created_at).toUTCString()}</li> */}
                  <li>&middot;</li>
                  <li>{template.description}</li>
                  {/* <li>&middot;</li> */}
                  {/* <li>{template.timesUsed} users</li> */}
                </ul>

                <a
                  onClick={() => loadTemplate(unlayer, template)}
                  className={classNames(
                    "absolute inset-0 rounded-md",
                    "ring-blue-400 focus:z-10 focus:outline-none focus:ring-2"
                  )}
                />
              </li>
            ))}
          </ul>
          {/* <div className="overflow-y-scroll h-full"></div> */}
        </Tab.Panel>
        <Tab.Panel
          key="download"
          className={classNames(
            "rounded-xl bg-white p-3",
            "focus:outline-none",
            "md:h-32",
            "sm:h-30"
          )}
        >
          <ul className="overflow-y-scroll h-[12rem]">
            {filterOnPublic(true).map((template, index) => (
              <li
                id="templateCard"
                key={template.id}
                className="relative rounded-md p-3 hover:bg-gray-100"
              >
                <h3 className="text-sm font-medium text-black leading-5">
                  {template.name}
                </h3>

                <ul className="mt-1 flex space-x-1 text-xs font-normal leading-4 text-gray-500">
                  {/* <li>{new Date(template.created_at).toUTCString()}</li> */}
                  <li>&middot;</li>
                  <li>{template.description}</li>
                  <li>&middot;</li>
                  <li>{template.timesUsed} users</li>
                </ul>

                <a
                  onClick={() => loadTemplate(unlayer, template)}
                  className={classNames(
                    "absolute inset-0 rounded-md",
                    "ring-blue-400 focus:z-10 focus:outline-none focus:ring-2"
                  )}
                />
              </li>
            ))}
          </ul>
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
}
