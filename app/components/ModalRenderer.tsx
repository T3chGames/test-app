import { useEffect, useState } from "react";
import AttachmentsTable from "./modals/AttachmentsTable";
import ExportImportModal from "./modals/ExportImport";
import PopupModal from "./modals/PopupModal";
import RecipientsTable from "./modals/RecipientsTable";
import moment from "moment";

export default function components(content: any) {
  const allIsOpen = content.allIsOpen;
  const setTemplateName = content.setTemplateName;
  const closeModal = content.closeModal;
  const setTemplateDescription = content.setTemplateDescription;
  const setTemplatePublic = content.setTemplatePublic;
  const saveTemplate = content.saveTemplate;
  const saveDraft = content.saveDraft;
  const emailEditorRef = content.emailEditorRef;
  const setAttachments = content.setAttachments;
  const user = content.user;
  const subject = content.subject;
  const setSubject = content.setSubject;
  const sendDate = content.sendDate;
  const sendTime = content.sendTime;
  const attachments = content.attachments;
  const recipients = content.recipients;
  const currentTemplateHtml = content.currentTemplateHtml;
  const fetchDrafts = content.fetchDrafts;
  const fetchTemplates = content.fetchTemplates;
  const templates = content.templates;

  // get all templates the current user has access to

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
    form.append("templateJson", localStorage.getItem("design"));
    form.append("user", JSON.stringify(user));
    if (subject) {
      form.append("subject", subject);
    }
    if (recipients) {
      form.append("recipients", recipients);
    }
    if (sendDate && sendTime) {
      if (
        new Date(`${sendDate} ${sendTime}`).getTime() <= new Date().getTime()
      ) {
        return;
      } else {
        const date = String(new Date(`${sendDate} ${sendTime}`).getTime());
        form.append("sendOn", date);
        console.log("date is there");
      }
    }
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

  return (
    <div className="">
      <PopupModal
        isOpen={allIsOpen}
        closeModal={closeModal}
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
        closeModal={closeModal}
        _key="loginError"
        title={
          <h1 className="font-bold text-xl ml-auto">
            Error, you must be logged in to use this feature!
          </h1>
        }
        content={
          <div className="grid grid-rows-2 text-center h-1/2">
            {" "}
            <div className=""></div>
            <div className=""></div>
            <div className=""></div>
          </div>
        }
        action={
          <div className="flex mt-2">
            <button
              onClick={() => (window.location.href = "/login")}
              className="text-2xl font-bold ml-6 bg-tropicalindigo w-24 h-8 rounded-md shadow-2xl"
            >
              Login
            </button>
            <button
              onClick={() => closeModal("loginError")}
              className="text-2xl font-bold bg-ultraviolet ml-auto mr-6 w-24 h-8 rounded-md shadow-2xl"
            >
              Cancel
            </button>
          </div>
        }
      ></PopupModal>
      <PopupModal
        isOpen={allIsOpen}
        closeModal={closeModal}
        _key="saveSucces"
        title={
          <h1 className="font-bold text-xl ml-auto">
            Design successfully saved!
          </h1>
        }
        content={
          <div className="grid grid-rows-2 text-center h-1/2">
            {" "}
            <div className=""></div>
            <div className=""></div>
            <div className=""></div>
          </div>
        }
        action={
          <div className="flex mt-2">
            <button
              onClick={() => closeModal("saveSucces")}
              className="text-2xl font-bold bg-ultraviolet ml-6 mr-6 w-24 h-8 rounded-md shadow-2xl"
            >
              OK
            </button>
          </div>
        }
      ></PopupModal>
      <PopupModal
        isOpen={allIsOpen}
        closeModal={closeModal}
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
      <RecipientsTable
        closeModal={closeModal}
        _key="recipientTable"
        isOpen={allIsOpen}
        subject={subject}
        setSubject={setSubject}
      ></RecipientsTable>
      <AttachmentsTable
        closeModal={closeModal}
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
        fetchTemplates={fetchTemplates}
      ></ExportImportModal>
      <PopupModal
        closeModal={closeModal}
        _key="sendModal"
        isOpen={allIsOpen}
      ></PopupModal>
      <PopupModal
        closeModal={closeModal}
        _key="sendEmail"
        isOpen={allIsOpen}
        title={<h1 className="font-bold text-2xl ml-auto">Send email</h1>}
        content={
          <div className="text-center h-[15vh]">
            <h2 className="text-2xl">subject: {subject}</h2>
            <h2 className="text-2xl mt-1">
              Send on:
              {content.sendDate
                ? new Date(`${sendDate} ${sendTime}`).getTime() <=
                  new Date().getTime()
                  ? " Now (input date is past)"
                  : `${moment(new Date(`${sendDate} ${sendTime}`)).format(
                      "MMMM Do YYYY, h:mm:ss a"
                    )}`
                : " Now"}
            </h2>
          </div>
        }
        action={
          <div className="flex mt-2">
            <button
              onClick={() => {
                fetchEmail().then((res) => {
                  closeModal("sendEmail");
                });
                // closeModal("sendEmail");
              }}
              className="text-2xl font-bold ml-6 bg-tropicalindigo w-24 h-8 rounded-md shadow-2xl"
            >
              Confirm
            </button>
            <button
              onClick={() => {
                closeModal("sendEmail");
              }}
              className="text-2xl font-bold bg-ultraviolet ml-auto mr-6 w-24 h-8 rounded-md shadow-2xl"
            >
              Cancel
            </button>
          </div>
        }
      ></PopupModal>
    </div>
  );
}
