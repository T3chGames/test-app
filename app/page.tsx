"use client";
import "./globals.css";
import React, { useRef, useState } from "react";
import EmailEditor, { EditorRef, EmailEditorProps } from "react-email-editor";
import RecipientTable from "./components/modals/RecipientsTable";
import PopupModal from "./components/modals/PopupModal";
import AttachmentsTable from "./components/modals/AttachmentsTable";

export default function Page() {
  const emailEditorRef = useRef<EditorRef>(null);
  const [allIsOpen, setAllIsOpen] = useState({
    recipientTable: false,
    templateName: false,
    attachmentsTable: false,
  });

  const [templateName, setTemplateName] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");

  const theme = {
    theme: "dark",
    panels: {
      tools: {
        dock: "left",
        collapsible: true,
        tabs: {
          body: {
            visible: true,
          },
        },
      },
    },
    features: {
      preview: true,
    },
  };

  const exportHtml = () => {
    const user = { id: 1, email: "breiderkoen13@gmail.com" };
    localStorage.setItem("user", JSON.stringify(user));
    // const unlayer = emailEditorRef.current?.editor;

    // unlayer?.exportHtml((data) => {
    //   const { design, html } = data;
    //   console.log("exportHtml", html);
    // });
  };
  const exportJson = () => {
    const unlayer = emailEditorRef.current?.editor;

    unlayer?.saveDesign((design) => {
      console.log("exportJson", JSON.stringify(design));
    });
  };

  const saveData = async (data) => {
    const requestOptions = {
      method: "POST",
      body: JSON.stringify(data),
    };

    await fetch(`http://127.0.0.1:8000/api/template`, requestOptions).then(
      (response) => {
        console.log(response);
      }
    );

    // const data = await laptops.json();
    // return {
    //   data: data,
    // };
  };

  const saveTemplate = () => {
    if (localStorage.getItem("user") == null) {
      localStorage.setItem(
        "user",
        JSON.stringify({ email: "breiderkoen13@gmail.com", id: 1 })
      );
    }

    if (!(templateName.length > 0 && templateDescription.length > 0)) {
      alert("template name and description are required");
      return;
    }

    console.log(localStorage.getItem("user"));
    const unlayer = emailEditorRef.current?.editor;
    unlayer?.saveDesign((design) => {
      const user = JSON.parse(localStorage.getItem("user"));
      const template = design;
      saveData({
        templateUser: user,
        template: template,
        templateName: templateName,
        templateDescription: templateDescription,
      });
      setAllIsOpen({ ...allIsOpen, templateName: false });
    });
  };

  const onReady: EmailEditorProps["onReady"] = (unlayer) => {
    // unlayer.loadTemplate(2);
  };

  const onLoad = () => {};

  const openModal = (id) => {
    return setAllIsOpen({ ...allIsOpen, [id]: !allIsOpen[id] });
  };

  const closeModal = (id) => {
    return setAllIsOpen({ ...allIsOpen, [id]: false });
  };
  const checkOpen = () => {
    for (var key in allIsOpen) {
      if (allIsOpen[key]) return true;
    }
  };

  return (
    <div className={`container w-full ${checkOpen() ? "blur-sm" : ""}`}>
      <EmailEditor
        id="iframe2"
        editorId="editor-container"
        ref={emailEditorRef}
        onReady={onReady}
        minHeight={600}
        appearance={theme}
        onLoad={onLoad}
      />

      <PopupModal
        isOpen={allIsOpen}
        setisOpen={setAllIsOpen}
        _key="templateName"
        title={<h1 className="text-3xl font-bold ml-auto">Template name</h1>}
        content={
          <div className="grid grid-rows-2 text-center mt-4 h-1/2">
            <div className="">
              <input
                placeholder="template name"
                className="w-2/3 input font-bold text-2xl text-black outline-none text-center"
                type="text"
                onChange={(e) => setTemplateName(e.target.value)}
              />
            </div>
            <div className="">
              <input
                placeholder="template description"
                className="w-2/3 input font-bold text-2xl text-black outline-none text-center"
                type="text"
                onChange={(e) => setTemplateDescription(e.target.value)}
              />
            </div>
          </div>
        }
        action={
          <div className="flex mt-2">
            <button
              onClick={saveTemplate}
              className="text-2xl font-bold ml-6 bg-tropicalindigo w-24 h-8 rounded-md shadow-2xl"
            >
              Save
            </button>
            <button
              onClick={() =>
                setAllIsOpen({ ...allIsOpen, templateName: false })
              }
              className="text-2xl font-bold bg-ultraviolet ml-auto mr-6 w-24 h-8 rounded-md shadow-2xl"
            >
              Cancel
            </button>
          </div>
        }
      ></PopupModal>

      <RecipientTable
        setisOpen={setAllIsOpen}
        _key="recipientTable"
        isOpen={allIsOpen}
      ></RecipientTable>

      <AttachmentsTable
        setisOpen={setAllIsOpen}
        _key="attachmentsTable"
        isOpen={allIsOpen}
      ></AttachmentsTable>

      <div className="grid bg-darkslate grid-cols-3">
        <div className="relative">
          <span className="absolute bottom-0 left-0 ml-4 m-2">
            <a className="font-bold text-lg shadow-xl" href="/login">
              LOGIN FOR COMPANY'S
            </a>
          </span>
        </div>
        <div className="grid grid-cols-2">
          {/* <button
            className="bg-tropicalindigo font-bold mr-2 p-2 rounded-xl mt-1 mb-2 shadow-xl "
            onClick={exportHtml}
          >
            Export HTML
          </button> */}
          {/* <div onClick={exportHtml} className="w-[266px] h-[51px]">
            <div className="p-2">
              <div className="relative w-[266px] h-[51px] bg-collection-1-tropical-indigo rounded-[25px] shadow-[0px_4px_4px_#00000040]">
                <div className="absolute w-[245px] top-[10px] left-[15px] [font-family:'Inter-Bold',Helvetica] font-bold text-collection-1-text text-[25px] tracking-[0] leading-[normal] whitespace-nowrap">
                  ADD ATTACHMENT
                </div>
              </div>
            </div>
          </div> */}
          <button
            className="bg-tropicalindigo font-bold mr-2 pl-5 pr-5 p-2 rounded-xl mt-1 mb-2 shadow-xl"
            onClick={() =>
              setAllIsOpen({ ...allIsOpen, attachmentsTable: true })
            }
          >
            ATTACHMENTS
          </button>
          <button
            className="bg-tropicalindigo font-bold mr-2 pl-2 pr-2 p-2 rounded-xl mt-1 mb-2 shadow-xl"
            onClick={() => setAllIsOpen({ ...allIsOpen, templateName: true })}
          >
            SAVE TEMPLATE
          </button>
          <button
            className="bg-ultraviolet font-bold mr-2 pl-5 pr-5 p-2 rounded-xl mt-1 mb-2 shadow-xl"
            onClick={exportJson}
          >
            EXPORT JSON
          </button>
          <button
            className="bg-ultraviolet font-bold mr-2 pl-2 pr-2 p-2 rounded-xl mt-1 mb-2 shadow-xl"
            onClick={() => openModal("recipientTable")}
          >
            RECIPIENTS
          </button>
        </div>
      </div>
    </div>
  );
}
