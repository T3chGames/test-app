import { Dialog, Tab } from "@headlessui/react";

// load drafts gets openend if the user has pending drafts

export default function LoadDraft(content) {
  // function for joining classes together for the styling of tabs

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  // load drafts and set all values that are saved in the draft

  function loadDraft(draft) {
    unlayer = content.unlayer;
    if (draft == undefined) {
      unlayer?.loadBlank();
      return;
    }

    if (Object.hasOwn(draft, "recipients")) {
      content.setRecipients(JSON.parse(draft.recipients));
      localStorage.setItem("recipients", draft.recipients);
    }

    if (Object.hasOwn(draft, "subject")) {
      content.setSubject(draft.subject);
      localStorage.setItem("subject", draft.subject);
    }

    if (draft.attachments !== null) {
      content.setFileDisplayArray(JSON.parse(draft.attachments));
      content.setAttachments({
        element: [],
        oldFiles: JSON.parse(draft.attachments),
      });
    }
    content.setLoadedDraft(draft);
    if (draft.sendOn !== null) {
      const date = new Date(parseInt(draft.sendOn));
      content.setStartDate(date);
    }

    if (Object.hasOwn(draft, "templateData")) {
      localStorage.setItem("design", draft.templateData);
      draft = JSON.parse(draft.templateData);
    }

    if (Object.hasOwn(draft, "body") && Object.hasOwn(draft, "counters")) {
      unlayer?.loadDesign(draft);
    } else {
      alert("Please make sure the file is a draft!");
    }
  }

  return (
    <Dialog
      className=" w-full h-full"
      open={content.isOpen[content._key]}
      onClose={() => content.closeModal(content._key)}
    >
      <Dialog.Panel>
        <Dialog.Title></Dialog.Title>
        <div className="fixed inset-0 flex items-center justify-center p-4 recipient-table">
          <div className="container flex align-middle items-center mt-44">
            <div className="bg-modalbackground w-1/3 h-2/3 p-4">
              <div className="flex">
                <h1 className="text-2xl font-bold text-white uppercase">
                  drafts
                </h1>
                <button
                  className="ml-auto m-2 mr-3 font-bold text-2xl hover:text-red-600"
                  onClick={() => content.closeModal(content._key)}
                >
                  X
                </button>
              </div>
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
                    Open draft
                  </Tab>
                </Tab.List>
                <Tab.Panels className="mt-2">
                  <Tab.Panel
                    key="import"
                    className={classNames(
                      "rounded-xl bg-white p-3",
                      "focus:outline-none h-72"
                    )}
                  >
                    <ul className="overflow-y-scroll h-[16rem]">
                      {content.drafts.map((draft, index) => (
                        <li
                          id="templateCard"
                          key={draft.id}
                          className="relative rounded-md p-3 hover:bg-gray-100"
                        >
                          <h3 className="text-sm font-medium text-black leading-5">
                            {draft.name}
                          </h3>

                          <ul className="mt-1 flex space-x-1 text-xs font-normal leading-4 text-gray-500">
                            {/* <li>{new Date(draft.created_at).toUTCString()}</li> */}
                            <li>&middot;</li>
                            <li>{draft.subject}</li>
                            <li>&middot;</li>
                            <li>
                              attachments:{" "}
                              {JSON.parse(draft?.attachments)?.length}
                            </li>

                            {/* <li>&middot;</li> */}
                            {/* <li>{draft.timesUsed} users</li> */}
                          </ul>

                          <a
                            onClick={() => loadDraft(draft)}
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
              <div className="action-buttons -mt-3">
                <button
                  id="save"
                  className="bg-tropicalindigo hover:bg-ultraviolet text-black font-bold text-xl p-1 pl-10 pr-10 mr-6 mb-4 md:mt-4 sm:mt-44 rounded-2xl"
                  onClick={() => content.closeModal(content._key)}
                >
                  OPEN
                </button>
              </div>
            </div>
          </div>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
