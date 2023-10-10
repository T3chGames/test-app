"use client";
import "./globals.css";
import React, { useEffect, useRef, useState } from "react";
import EmailEditor, {
  Editor,
  EditorRef,
  EmailEditorProps,
} from "react-email-editor";
import { googleLogout } from "@react-oauth/google";
import ModalRenderer from "./components/ModalRenderer";

export default function Page() {
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
  });

  const [containerHeight, setContainerHeight] = useState(600);

  const [attachments, setAttachments] = useState([]);

  const [templateName, setTemplateName] = useState("");

  const [templateDescription, setTemplateDescription] = useState("");

  const [templatePublic, setTemplatePublic] = useState(false);

  const [subject, setSubject] = useState(localStorage.getItem("subject"));

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  const [recipients, setRecipients] = useState(
    localStorage.getItem("recipients")
  );

  const [unlayer, setUnlayer] = useState(null);

  const [userDrafts, setUserDrafts] = useState([]);

  const [currentTemplateHtml, setCurrentTemplateHtml] = useState("");

  const [sendDate, setSendDate] = useState(null);

  const [sendTime, setSendTime] = useState(null);

  const [loaded, setLoaded] = useState(false);

  // get user drafts if a user is present
  const fetchDrafts = async () => {
    await fetch(`http://127.0.0.1:8000/api/drafts/?userId=${user.id}`).then(
      (res) => {
        res.json().then((drafts) => {
          setUserDrafts(drafts);
          console.log(drafts);
        });
      }
    );
  };

  useEffect(() => {
    setLoaded(true);
    // set the height of the editor to the page height
    setContainerHeight(
      document.getElementById("editorContainer")?.offsetHeight
    );
    if (user !== null) {
      // fetchTemplates();
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
        console.log(response);
      }
    );
  };

  // save template to db
  const openSendModal = () => {
    openModal("sendEmail", true);
  };
  const sendEmail = () => {
    fetchEmail().then((res) => {
      console.log(res);
    });
  };

  const fetchEmail = async () => {
    let form = new FormData();
    if (attachments.files) {
      let length = attachments.files.length;
      for (let i = 0; i < length; i++) {
        console.log(i);
        console.log(attachments.files[i]);
        form.append("fileToUpload[]", attachments.files[i]);
      }
    }
    form.append("template", currentTemplateHtml);
    form.append("user", JSON.stringify(user));
    if (subject) {
      form.append("subject", subject);
    }
    if (recipients) {
      form.append("recipients", recipients);
    }
    console.log(form.get("fileToUpload[]"));
    // return;
    const requestOptions = {
      method: "POST",
      "content-type": "multipart/form-data",
      body: form,
    };
    await fetch(`http://127.0.0.1:8000/api/email`, requestOptions).then(
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
    unlayer;
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
        sendOn:
          sendDate != null && sendTime !== null
            ? Date.parse(sendDate + " " + sendTime)
            : null,
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
          user={user}
          subject={subject}
          setSubject={setSubject}
          sendDate={sendDate}
          sendTime={sendTime}
          attachments={attachments}
          recipients={recipients}
          currentTemplateHtml={currentTemplateHtml}
        ></ModalRenderer>
      ) : (
        ""
      )}

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
                onClick={() => openModal("attachmentsTable", true)}
              >
                ATTACHMENTS
              </button>
              <button
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
            <input
              className="text-black w-40 p-2 rounded-m mt-1 mb-2 font-bold text-l shadow-xl block ml-auto"
              type="date"
              onChange={(e) => {
                console.log(e.target.value);
                setSendDate(e.target.value);
              }}
              name=""
              id=""
            />
            <input
              className="text-black w-40 p-2 rounded-m mt-1 mb-2 font-bold text-l shadow-xl block ml-auto"
              type="time"
              onChange={(e) => {
                console.log(new Date(`${sendDate} ${e.target.value}`));
                setSendTime(e.target.value);
              }}
              name=""
              id=""
            />
          </div>
          <div className="">
            <button
              className="bg-tropicalindigo font-bold w-40 mr-2 pl-2 pr-2 p-2 rounded-xl mt-1 mb-2 shadow-xl block ml-auto"
              onClick={() => openModal("recipientTable", true)}
            >
              RECIPIENTS
            </button>
            <button
              className="bg-ultraviolet font-bold mr-2 pl-5 pr-5 w-40 p-2 rounded-xl mt-1 mb-2 shadow-xl block ml-auto"
              onClick={() => {
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
