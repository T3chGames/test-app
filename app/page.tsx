"use client";
import "./globals.css";
import React, { useEffect, useRef, useState } from "react";
import EmailEditor, { EditorRef, EmailEditorProps } from "react-email-editor";
import { googleLogout } from "@react-oauth/google";
import ModalRenderer from "./components/ModalRenderer";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

export default function Page(this: any) {
  const emailEditorRef = useRef<EditorRef>(null);

  const [allIsOpen, setAllIsOpen] = useState({
    recipientTable: false,
    templateName: false,
    attachmentsTable: false,
    saveAsDraft: false,
    exportImport: false,
    sendModal: false,
    saveSucces: false,
    loginError: false,
    sendEmail: false,
    loadDraft: false,
  });
  const [startDate, setStartDate] = useState(new Date());

  const [containerHeight, setContainerHeight] = useState(600);

  const [attachments, setAttachments] = useState([]);

  const [templateName, setTemplateName] = useState("");

  const [templates, setTemplates] = useState([]);

  const [templateDescription, setTemplateDescription] = useState("");

  const [templatePublic, setTemplatePublic] = useState(false);

  const [subject, setSubject] = useState(localStorage.getItem("subject"));

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  const [recipients, setRecipients] = useState(
    localStorage.getItem("recipients") != null
      ? JSON.parse(localStorage.getItem("recipients"))
      : { reciever: [], bcc: [], cc: [] }
  );

  const [unlayer, setUnlayer] = useState(null);

  const [userDrafts, setUserDrafts] = useState([]);

  const [currentTemplateHtml, setCurrentTemplateHtml] = useState("");

  const [loaded, setLoaded] = useState(false);

  const [errorMessages, setErrorMessages] = useState({
    sendEmail: { message: "", error: false },
  });

  const [fileDisplayArray, setFileDisplayArray] = useState([]);

  // get user drafts if a user is present
  const fetchDrafts = async () => {
    await fetch(`http://127.0.0.1:8000/api/drafts/?userId=${user.id}`).then(
      (res) => {
        res.json().then((drafts) => {
          setUserDrafts(drafts);
          if (drafts.length > 0) {
            openModal("loadDraft", false);
          }
          console.log(drafts);
        });
      }
    );
  };

  const fetchTemplates = async () => {
    if (user === null) {
      return;
    }
    await fetch(
      `http://127.0.0.1:8000/api/template/?userId=${user.id}&userEmail=${user.email}`
    ).then((res) => {
      res.json().then((data) => {
        console.log(data.templates);
        return setTemplates(data.templates);
      });
    });
  };

  useEffect(() => {
    setLoaded(true);
    // set the height of the editor to the page height
    setContainerHeight(
      document.getElementById("editorContainer")?.offsetHeight
    );
    if (user !== null) {
      fetchTemplates();
      fetchDrafts();
    }
  }, []);

  // theme for the editor
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

  // save template to db
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

  // save a draft to db
  const saveDraftRequest = async (data) => {
    console.log(data.attachments.files);
    // console.log(data.length);
    let form = new FormData();
    if (data.attachments.files) {
      let length = data.attachments.files.length;
      for (let i = 0; i < length; i++) {
        console.log(i);
        console.log(data.attachments.files[i]);
        form.append("fileToUpload[]", data.attachments.files[i]);
      }
    }
    form.append("draft", JSON.stringify(data));
    // form.append("file", data.attachments.files[0]);
    // form.append("name", data.attachments.files[0].name);

    // console.log(form.get("file"));
    data.test = form;
    const requestOptions = {
      method: "POST",
      "content-type": "multipart/form-data",
      body: form,
    };
    await fetch(`http://127.0.0.1:8000/api/draft`, requestOptions).then(
      (response) => {
        fetchDrafts().then((drafts) => {
          console.log(drafts);
        });
        console.log(response);
      }
    );
  };

  // save template to db
  const openSendModal = () => {
    openModal("sendEmail", true);
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
    unlayer;
    unlayer?.saveDesign((design) => {
      const template = design;
      saveTemplateRequest({
        templateUser: user,
        template: template,
        templateName: templateName,
        templateDescription: templateDescription,
        publicTemplate: templatePublic,
      }).then(() => {
        fetchTemplates().then(() => {
          console.log(templates);
        });
        closeModal("templateName");
      });
    });
  };

  // the logic for saving a draft and then calling db store function
  const saveDraft = () => {
    console.log(attachments);
    // return;
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
        sendOn: startDate,
      });
      closeModal("saveAsDraft");
    });
  };

  const onReady: EmailEditorProps["onReady"] = (unlayer) => {
    if (localStorage.getItem("design")) {
      unlayer.loadDesign(JSON.parse(localStorage.getItem("design")));
    }
    unlayer.exportHtml((html) => {
      setCurrentTemplateHtml(html.html);
      console.log(html);
    });
    setUnlayer(unlayer);
    unlayer.addEventListener("design:updated", (data) => {
      let design = unlayer.saveDesign((design) => {
        localStorage.setItem("design", JSON.stringify(design));
      });
      unlayer.exportHtml((html) => {
        setCurrentTemplateHtml(html.html);
      });
    });
  };

  const onLoad = () => {};

  // modal handler checks if user must be logged in to show modal
  const openModal = (id, loginRequired) => {
    if (loginRequired) {
      if (user !== null) {
        return setAllIsOpen({ ...allIsOpen, [id]: true });
      } else {
        if (id === "templateName") {
          const unlayer = emailEditorRef.current?.editor;
          unlayer.saveDesign((design) => {
            localStorage.setItem("design", JSON.stringify(design));
            openModal("saveSucces", false);
          });
        } else {
          return setAllIsOpen({ ...allIsOpen, loginError: true });
        }
      }
    } else {
      return setAllIsOpen({ ...allIsOpen, [id]: true });
    }
  };

  // close modal by id
  const closeModal = (id) => {
    return setAllIsOpen({ ...allIsOpen, [id]: false });
  };

  // checks if a modal is open used to blur background
  const checkOpen = () => {
    for (var key in allIsOpen) {
      if (allIsOpen[key]) return true;
    }
  };

  // check before submitting email if all required fields are filled in
  const checkRequired = () => {
    console.log("checking");
    console.log(recipients.reciever, subject);
    let _sendEmail = { message: "", error: false };
    if (!recipients.reciever[0]) {
      console.log(recipients.reciever);
      _sendEmail.message = "Error, reciever is required!";
      _sendEmail.error = true;
      setErrorMessages({
        ...errorMessages,
        sendEmail: _sendEmail,
      });
      return;
    }
    if (subject != null) {
      console.log(subject.length);
      if (!(subject.length > 1)) {
        _sendEmail.message = "Error, subject is required!";
        _sendEmail.error = true;
        setErrorMessages({
          ...errorMessages,
          sendEmail: _sendEmail,
        });
        return;
      }
    } else {
      _sendEmail.message = "Error, subject is required!";
      _sendEmail.error = true;
      setErrorMessages({
        ...errorMessages,
        sendEmail: _sendEmail,
      });
      return;
    }
    setErrorMessages({
      ...errorMessages,
      sendEmail: _sendEmail,
    });
  };

  // log the user out
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
      {loaded ? (
        <ModalRenderer
          allIsOpen={allIsOpen}
          setAllIsOpen={setAllIsOpen}
          setTemplateName={setTemplateName}
          closeModal={closeModal}
          setTemplateDescription={setTemplateDescription}
          setTemplatePublic={setTemplatePublic}
          saveTemplate={saveTemplate}
          saveDraft={saveDraft}
          emailEditorRef={emailEditorRef}
          setAttachments={setAttachments}
          setFileDisplayArray={setFileDisplayArray}
          fileDisplayArray={fileDisplayArray}
          user={user}
          subject={subject}
          setSubject={setSubject}
          startDate={startDate}
          setStartDate={setStartDate}
          attachments={attachments}
          recipients={recipients}
          setRecipients={setRecipients}
          currentTemplateHtml={currentTemplateHtml}
          drafts={userDrafts}
          fetchTemplates={fetchTemplates}
          templates={templates}
          errorMessages={errorMessages}
        ></ModalRenderer>
      ) : (
        ""
      )}

      <div className="grid bg-darkslate grid-cols-[450px_450px_auto] w-screen">
        <div className="relative col-span-1 text-left">
          <span id="login" className="absolute bottom-0 left-0 ml-4 m-2">
            {user === null ? (
              <a className="font-bold text-lg shadow-xl login" href="/login">
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
                onClick={() => openModal("attachmentsTable", true)}
              >
                ATTACHMENTS
              </button>
              <button
                id="importExport"
                className="bg-ultraviolet w-44 font-bold mr-2 pl-5 pr-5 p-2 rounded-xl mt-1 mb-2 shadow-xl"
                onClick={() => openModal("exportImport", false)}
              >
                IMPORT/EXPORT
              </button>
            </div>
            <div className="w-60 ml-2">
              <button
                className="bg-tropicalindigo w-44 font-bold mr-2 pl-2 pr-2 p-2 rounded-xl mt-1 mb-2 shadow-xl"
                onClick={() => openModal("saveAsDraft", true)}
              >
                SAVE AS DRAFT
              </button>
              <button
                id="saveTemplate"
                className="bg-ultraviolet w-44 font-bold mr-2 pl-2 pr-2 p-2 rounded-xl mt-1 mb-2 shadow-xl"
                onClick={() => openModal("templateName", true)}
              >
                SAVE TEMPLATE
              </button>
            </div>
          </div>
        </div>
        <div className="flex col-span-1">
          <div className="ml-auto mr-2">
            <DatePicker
              id="sendDate"
              selected={startDate}
              onChange={(date) => {
                setStartDate(date);
                console.log(date);
              }}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={5}
              dateFormat="Pp"
              className="text-black w-48 p-2 rounded-m mt-1 mb-2 font-bold text-l shadow-xl block ml-auto"
            />
          </div>
          <div className="">
            <button
              id="recipients"
              className="bg-tropicalindigo font-bold w-40 mr-2 pl-2 pr-2 p-2 rounded-xl mt-1 mb-2 shadow-xl block ml-auto"
              onClick={() => openModal("recipientTable", true)}
            >
              RECIPIENTS
            </button>
            <button
              id="send"
              className="bg-ultraviolet font-bold mr-2 pl-5 pr-5 w-40 p-2 rounded-xl mt-1 mb-2 shadow-xl block ml-auto"
              onClick={() => {
                checkRequired();
                openSendModal();
              }}
            >
              SEND
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
