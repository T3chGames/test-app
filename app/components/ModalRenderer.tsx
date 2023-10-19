import { useEffect, useState } from "react";
import AttachmentsTable from "./modals/AttachmentsTable";
import ExportImportModal from "./modals/ExportImport";
import PopupModal from "./modals/PopupModal";
import RecipientsTable from "./modals/RecipientsTable";
import loadDraft from "./modals/LoadDraft";
import moment from "moment";
import LoadDraft from "./modals/LoadDraft";

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
  const startDate = content.startDate;
  const setStartDate = content.setStartDate;
  const attachments = content.attachments;
  const recipients = content.recipients;
  const currentTemplateHtml = content.currentTemplateHtml;
  const userDrafts = content.drafts;
  const fetchTemplates = content.fetchTemplates;
  const templates = content.templates;
  const errorMessages = content.errorMessages;
  const [loadedDraft, setLoadedDraft] = useState(null);

  // get all templates the current user has access to

  const fetchEmail = async () => {
    if (errorMessages.sendEmail.error) {
      return;
    }
    let form = new FormData();
    console.log(attachments);
    // return;
    if (attachments.element?.files) {
      let length = attachments.element.files.length;
      for (let i = 0; i < length; i++) {
        console.log(i);
        console.log(attachments.element.files[i]);
        form.append("fileToUpload[]", attachments.element.files[i]);
      }
    }
    if (attachments.oldFiles?.length > 0) {
      form.append("oldFiles", JSON.stringify(attachments.oldFiles));
    }
    if (loadedDraft !== null) {
      form.append("draftId", loadedDraft.id);
    }
    form.append("template", currentTemplateHtml);
    form.append("templateJson", localStorage.getItem("design"));
    form.append("user", JSON.stringify(user));
    if (subject) {
      form.append("subject", subject);
    }
    if (recipients) {
      console.log(recipients);
      // return;
      form.append("recipients", JSON.stringify(recipients));
    }
    form.append("sendOn", new Date(startDate).getTime());

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
              id="save"
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
        recipients={recipients}
        setRecipients={content.setRecipients}
      ></RecipientsTable>
      <AttachmentsTable
        closeModal={closeModal}
        _key="attachmentsTable"
        isOpen={allIsOpen}
        setAttachments={setAttachments}
        attachments={attachments}
        setFileDisplayArray={content.setFileDisplayArray}
        fileDisplayArray={content.fileDisplayArray}
      ></AttachmentsTable>
      <ExportImportModal
        closeModal={closeModal}
        _key="exportImport"
        isOpen={allIsOpen}
        unlayer={emailEditorRef.current?.editor}
        html={currentTemplateHtml}
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
            <h2 id="sendOnText" className="text-2xl mt-1">
              {"Send on: "}
              {content.startDate
                ? new Date(startDate).getTime() <= new Date().getTime()
                  ? " Now (input date is past)"
                  : `${moment(new Date(startDate)).format(
                      "MMMM Do YYYY, h:mm:ss a"
                    )}`
                : startDate
                ? ` Today at ${startDate}`
                : " Now"}
            </h2>
            <h2 className="text-red-800 pt-6 font-extrabold text-2xl">
              {errorMessages.sendEmail.message}
            </h2>
          </div>
        }
        action={
          <div className="flex mt-2">
            <button
              id="confirm"
              onClick={() => {
                fetchEmail().then((res) => {
                  console.log(res);
                  closeModal("sendEmail");
                });
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
      <LoadDraft
        closeModal={closeModal}
        _key="loadDraft"
        isOpen={allIsOpen}
        drafts={userDrafts}
        unlayer={emailEditorRef.current?.editor}
        setRecipients={content.setRecipients}
        setSubject={setSubject}
        setStartDate={setStartDate}
        setSendDate={content.setSendDate}
        setFileDisplayArray={content.setFileDisplayArray}
        fileDisplayArray={content.fileDisplayArray}
        setAttachments={setAttachments}
        setLoadedDraft={setLoadedDraft}
      ></LoadDraft>
    </div>
  );
}
