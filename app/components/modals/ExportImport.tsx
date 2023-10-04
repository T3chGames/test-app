import { Dialog, Tab } from "@headlessui/react";
import { useState } from "react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
// const [templateIsImported, setTemplateIsImported] = useState(false);
// const [importedTemplate, setImportedTemplate] = useState(null);

function loadTemplate(unlayer, template) {
  if (template == undefined) {
    unlayer?.loadBlank();
    // setTemplateIsImported(false);
    // setImportedTemplate(null);
    return;
  }
  console.log(template);
  if (Object.hasOwn(template, "templateData")) {
    template = JSON.parse(template.templateData);
  }
  console.log(unlayer);
  console.log(template);
  unlayer?.loadDesign(template);
  //   setTemplateIsImported(true);
  //   setImportedTemplate(template);
}

export default function ExportImportModal(content: any) {
  const [fileName, setFileName] = useState("");
  const [importedTemplate, setImportedTemplate] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState(null);

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

  const onFileUpload = (file) => {
    if (!file.length) {
      return;
    }
    console.log(file[0].name);
    setUploadedFileName(file[0].name);
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      let result = JSON.parse(reader.result);
      if (Object.keys(result).length > 0) {
        setImportedTemplate(result);
        console.log(result);
      } else {
        return alert("empty file");
      }
    });
    reader.readAsText(file[0]);
  };

  console.log(content.templates);

  return (
    <Dialog
      className="w-full h-full"
      open={content.isOpen[content._key]}
      onClose={() => content.closeModal(content._key)}
    >
      <Dialog.Panel>
        <Dialog.Title></Dialog.Title>
        <div className="fixed inset-0 flex items-center justify-center p-4 recipient-table">
          <div className="container flex align-middle items-center mt-40">
            <div className="bg-modalbackground w-2/5 h-3/4 p-4">
              <div className="flex">
                <h1 className="font-bold text-3xl ml-auto uppercase">
                  Export/import templates
                </h1>
                <button
                  className="ml-auto m-2 mr-3 font-bold text-2xl hover:text-red-600"
                  onClick={() => content.closeModal(content._key)}
                >
                  X
                </button>
              </div>
              <div className="h-4/5">
                <div className="w-full max-w-md max-h-12 px-2 py-16 sm:px-0 ml-auto mr-auto">
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
                        Import
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
                    <Tab.Panels className="mt-2 max-h-56">
                      <Tab.Panel
                        key="export"
                        className={classNames(
                          "rounded-xl bg-white p-3",
                          "focus:outline-none h-60"
                        )}
                      >
                        {renderTemplates(content.templates, content.unlayer)}
                      </Tab.Panel>
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
                              className="text-white pl-2 pr-2 p-1 ml-2 rounded-md bg-darkslate text-right"
                              onClick={exportJson}
                            >
                              DOWNLOAD JSON
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
              <div className="action-buttons mt-auto">
                <button
                  className="bg-tropicalindigo hover:bg-ultraviolet text-black font-bold text-xl p-1 pl-10 pr-10 ml-14 mr-6 mb-4 rounded-2xl"
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
      if (item.publicTemplate > 0 && publicTemplate) {
        return item;
      } else {
        //returns the templates of the user

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
            "focus:outline-none"
          )}
        >
          <ul>
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
          className="rounded-xl bg-white p-1 
      focus:outline-none"
        >
          <ul>
            {filterOnPublic(true).map((template, index) => (
              <li
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
