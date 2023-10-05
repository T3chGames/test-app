"use client";
import "./globals.css";
import React, { useEffect, useRef, useState } from "react";
import EmailEditor, { EditorRef, EmailEditorProps } from "react-email-editor";
import RecipientTable from "./components/modals/RecipientsTable";
import PopupModal from "./components/modals/PopupModal";
import AttachmentsTable from "./components/modals/AttachmentsTable";
import { googleLogout } from "@react-oauth/google";
import ExportImportModal from "./components/modals/ExportImport";

export default function Page() {
  const emailEditorRef = useRef<EditorRef>(null);
  const [allIsOpen, setAllIsOpen] = useState({
    recipientTable: false,
    templateName: false,
    attachmentsTable: false,
    saveAsDraft: false,
    exportImport: false,
  });

  const [containerHeight, setContainerHeight] = useState(600);
  const [templates, setTemplates] = useState([]);
  const [attachments, setAttachments] = useState(
    localStorage.getItem("attachments") == null
      ? null
      : JSON.parse(localStorage.getItem("attachments"))
  );
  const [templateName, setTemplateName] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");
  const [templatePublic, setTemplatePublic] = useState(false);

  const [subject, setSubject] = useState(
    localStorage.getItem("subject") == null
      ? null
      : localStorage.getItem("subject")
  );
  const [user, setUser] = useState(
    localStorage.getItem("user") == null
      ? null
      : JSON.parse(localStorage.getItem("user"))
  );
  const [recipients, setRecipients] = useState(
    localStorage.getItem("recipients") == null
      ? null
      : JSON.parse(localStorage.getItem("recipients"))
  );

  const [userDrafts, setUserDrafts] = useState([]);

  const [sendDate, setSendDate] = useState(null);
  const [sendTime, setSendTime] = useState(null);

  const fetchDrafts = async () => {
    const drafts = await fetch(
      `http://127.0.0.1:8000/api/drafts/?userId=${user.id}`
    ).then((res) => {
      res.json().then((drafts) => {
        setUserDrafts(drafts);
        console.log(drafts);
      });
    });
  };

  useEffect(() => {
    setContainerHeight(
      document.getElementById("editorContainer")?.offsetHeight
    );
    getTemplates();
    fetchDrafts();
  }, []);

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

  // const importTemplate = (index) => {
  //   const unlayer = emailEditorRef.current?.editor;
  //   if (templates[index] == undefined) {
  //     unlayer?.loadBlank();
  //     setTemplateIsImported(false);
  //     setImportedTemplate(null);
  //     return;
  //   }
  //   console.log(templates[index]);
  //   unlayer?.loadDesign(JSON.parse(templates[index].templateData));
  //   setTemplateIsImported(true);
  //   setImportedTemplate(templates[index]);
  // };

  const saveTemplateRequest = async (data) => {
    const requestOptions = {
      method: "POST",
      body: JSON.stringify(data),
    };

    await fetch(`http://127.0.0.1:8000/api/template`, requestOptions).then(
      (response) => {
        console.log(response);
      }
    );
  };

  const getTemplates = async () => {
    await fetch(
      `http://127.0.0.1:8000/api/template/?userId=${user.id}&userEmail=${user.email}`
    ).then((res) => {
      res.json().then((data) => {
        console.log(data.templates);
        return setTemplates(data.templates);
      });
    });
  };

  const saveDraftRequest = async (data) => {
    const requestOptions = {
      method: "POST",
      body: JSON.stringify(data),
    };
    await fetch(`http://127.0.0.1:8000/api/draft`, requestOptions).then(
      (response) => {
        console.log(response);
      }
    );
  };

  const saveTemplate = () => {
    if (user == null) {
      alert("you must be logged in to save a template");
      return;
    }

    if (!(templateName.length > 0 && templateDescription.length > 0)) {
      alert("template name and description are required");
      return;
    }

    console.log(user);
    const unlayer = emailEditorRef.current?.editor;
    unlayer?.saveDesign((design) => {
      const template = design;
      saveTemplateRequest({
        templateUser: user,
        template: template,
        templateName: templateName,
        templateDescription: templateDescription,
        publicTemplate: templatePublic,
      });
      closeModal("templateName");
    });
  };

  const saveDraft = () => {
    if (user == null) {
      alert("you must be logged in to save a template");
      return;
    }

    if (!(templateName.length > 0 && templateDescription.length > 0)) {
      alert("template name and description are required");
      return;
    }
    console.log(user);
    const unlayer = emailEditorRef.current?.editor;
    unlayer?.saveDesign((design) => {
      const template = design;
      saveDraftRequest({
        templateUser: user,
        template: template,
        templateName: templateName,
        templateDescription: templateDescription,
        recipients: recipients,
        attachments: attachments,
        subject: subject,
        sendOn:
          sendDate != null && sendTime !== null
            ? Date.parse(sendDate + " " + sendTime)
            : null,
      });
      closeModal("saveAsDraft");
    });
  };

  const onReady: EmailEditorProps["onReady"] = (unlayer) => {};

  const onLoad = () => {};

  const openModal = (id) => {
    console.log(attachments);
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

  const logout = () => {
    googleLogout();
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <div
      className={`container text-center w-full ${checkOpen() ? "blur-sm" : ""}`}
    >
      <EmailEditor
        className="h-full"
        id="iframe2"
        editorId="editor-container"
        ref={emailEditorRef}
        onReady={onReady}
        minHeight={containerHeight}
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
                className="w-2/3 input font-bold text-xl text-black outline-none text-center"
                type="text"
                onChange={(e) => setTemplateName(e.target.value)}
              />
            </div>
            <div className="">
              <input
                placeholder="template description"
                className="w-2/3 input font-bold text-xl text-black outline-none text-center"
                type="text"
                onChange={(e) => setTemplateDescription(e.target.value)}
              />
            </div>
            <div className="text-xl font-bold">
              <label htmlFor="public">Public template: </label>
              <input
                onChange={(e) => setTemplatePublic(e.target.checked)}
                type="checkbox"
                name="public"
                id="public"
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
              onClick={() => closeModal("templateName")}
              className="text-2xl font-bold bg-ultraviolet ml-auto mr-6 w-24 h-8 rounded-md shadow-2xl"
            >
              Cancel
            </button>
          </div>
        }
      ></PopupModal>
      <PopupModal
        isOpen={allIsOpen}
        setisOpen={setAllIsOpen}
        _key="saveAsDraft"
        title={<h1 className="font-bold text-3xl ml-auto">Save as draft</h1>}
        content={
          <div className="grid grid-rows-2 text-center mt-4 h-1/2">
            <div className="">
              <input
                placeholder="template name"
                className="w-2/3 input font-bold text-xl text-black outline-none text-center"
                type="text"
                onChange={(e) => setTemplateName(e.target.value)}
              />
            </div>
            <div className="">
              <input
                placeholder="template description"
                className="w-2/3 input font-bold text-xl text-black outline-none text-center"
                type="text"
                onChange={(e) => setTemplateDescription(e.target.value)}
              />
            </div>
            <h1 className="text-3xl">
              subject: {localStorage.getItem("subject")}
            </h1>
          </div>
        }
        action={
          <div className="flex mt-2">
            <button
              onClick={saveDraft}
              className="text-2xl font-bold ml-6 bg-tropicalindigo w-24 h-8 rounded-md shadow-2xl"
            >
              Save
            </button>
            <button
              onClick={() => closeModal("saveAsDraft")}
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
        setAttachments={setAttachments}
      ></AttachmentsTable>
      <ExportImportModal
        closeModal={closeModal}
        _key="exportImport"
        isOpen={allIsOpen}
        unlayer={emailEditorRef.current?.editor}
        templates={templates}
      ></ExportImportModal>
      <div className="grid bg-darkslate grid-cols-[450px_450px_auto] w-screen">
        <div className="relative col-span-1 text-left">
          <span className="absolute bottom-0 left-0 ml-4 m-2">
            {user === null ? (
              <a className="font-bold text-lg shadow-xl" href="/login">
                LOGIN FOR COMPANYS
              </a>
            ) : (
              <a
                className="font-bold text-lg shadow-xl hover:cursor-pointer"
                onClick={logout}
              >
                {" "}
                LOGOUT
              </a>
            )}
          </span>
        </div>
        <div className="col-span-1">
          <div className="flex w-6/8">
            <div className="w-1/3 text-left">
              <button
                className="bg-tropicalindigo w-44 font-bold mr-2 pl-5 pr-5 p-2 rounded-xl mt-1 mb-2 shadow-xl"
                onClick={() => openModal("attachmentsTable")}
              >
                ATTACHMENTS
              </button>
              <button
                className="bg-ultraviolet w-44 font-bold mr-2 pl-5 pr-5 p-2 rounded-xl mt-1 mb-2 shadow-xl"
                onClick={() => openModal("exportImport")}
              >
                IMPORT/EXPORT
              </button>
            </div>
            <div className="w-60 ml-2">
              <button
                className="bg-tropicalindigo w-44 font-bold mr-2 pl-2 pr-2 p-2 rounded-xl mt-1 mb-2 shadow-xl"
                onClick={() => openModal("saveAsDraft")}
              >
                SAVE AS DRAFT
              </button>
              <button
                className="bg-ultraviolet w-44 font-bold mr-2 pl-2 pr-2 p-2 rounded-xl mt-1 mb-2 shadow-xl"
                onClick={() => openModal("templateName")}
              >
                SAVE TEMPLATE
              </button>
            </div>
          </div>
        </div>
        <div className="flex col-span-1">
          <div className="ml-auto mr-2">
            <input
              className="text-black w-40 p-2 rounded-m mt-1 mb-2 font-bold text-l shadow-xl block ml-auto"
              type="date"
              onChange={(e) => {
                setSendDate(e.target.value);
              }}
              name=""
              id=""
            />
            <input
              className="text-black w-40 p-2 rounded-m mt-1 mb-2 font-bold text-l shadow-xl block ml-auto"
              type="time"
              onChange={(e) => {
                setSendTime(e.target.value);
              }}
              name=""
              id=""
            />
          </div>
          <div className="">
            <button
              className="bg-tropicalindigo font-bold w-40 mr-2 pl-2 pr-2 p-2 rounded-xl mt-1 mb-2 shadow-xl block ml-auto"
              onClick={() => openModal("recipientTable")}
            >
              RECIPIENTS
            </button>
            <button className="bg-ultraviolet font-bold mr-2 pl-5 pr-5 w-40 p-2 rounded-xl mt-1 mb-2 shadow-xl block ml-auto">
              SEND
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
