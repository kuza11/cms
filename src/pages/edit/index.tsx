import React, { useRef } from "react";
import dynamic from "next/dynamic";
import useSWR from "swr";
import { PageData } from "../api/getPage";
import { NumsNamesData } from "../api/getNumsNames";
import { useState } from "react";
import Editor from "ckeditor5-custom-build";
import styles from "../../styles/index.module.css";
import api from "../../../api.json";

const CustomEditor = dynamic(
  () => {
    return import("../../components/custom-editor");
  },
  { ssr: false }
);

enum SaveState {
  Saved = "Saved",
  Saving = "Saving",
  Error = "Error",
  None = "None",
}

let timeout: NodeJS.Timeout;

const fetcher = (...args: Parameters<typeof fetch>) => {
  args[1] = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      key: api.key,
    }),
  };
  return fetch(...args).then((res) => res.json());
};

function Index() {
  const [pageNum, setPageNum] = useState(1);
  const [pageContent, setPageContent] = useState("");
  const [saveState, setSaveState] = useState(SaveState.None);
  const editorRef = useRef<Editor | null>(null);

  const { data: page, error: pageError } = useSWR<PageData>(`/api/getPage?num=${pageNum}`, fetcher);

  if (pageContent == "" && page) setPageContent(page.content ? page.content : "");

  const { data: numsNames, error: numsNamesError } = useSWR<NumsNamesData>("/api/getNumsNames", fetcher);

  function save() {
    if (timeout) clearTimeout(timeout);
    setSaveState(SaveState.Saving);
    if (page) {
      page.content = pageContent;
    }
    const res = fetch("/api/setPage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: page?.id,
        content: pageContent,
        key: api.key,
      }),
    }).then((res) => {
      if (res.status == 200) {
        setSaveState(SaveState.Saved);
      } else {
        setSaveState(SaveState.Error);
      }
      timeout = setTimeout(() => {
        setSaveState(SaveState.None);
      }, 4000);
    });
  }

  function cancel() {
    if (page?.content) editorRef.current?.setData(page?.content);
  }

  return (
    <>
      <div className={styles.header}>
        {numsNamesError ? (
          <p>Failed to load pages</p>
        ) : numsNames ? (
          numsNames.map((numName) => (
            <div
              className={pageNum === numName.pageNum ? styles.pages + " " + styles.active : styles.pages}
              onClick={() => setPageNum(numName.pageNum)}
              key={numName.pageNum}
            >
              {numName.name}
            </div>
          ))
        ) : (
          "Loading..."
        )}
      </div>
      {pageError ? (
        <p>Failed to load page</p>
      ) : page ? (
        <>
          <div className={styles.cke}>
            <CustomEditor
              onChange={(event, editor) => {
                setPageContent(editor.getData());
              }}
              initialData={page?.content ? page?.content : " "}
              onReady={(editor) => {
                editorRef.current = editor;
                // Insert the toolbar before the editable area.
                const editableElement = editor.ui.getEditableElement();
                const toolbarElement = editor.ui.view.toolbar.element;
                if (editableElement instanceof HTMLElement && toolbarElement instanceof HTMLElement) {
                  editableElement.parentElement?.insertBefore(toolbarElement, editableElement);
                }
              }}
            />
          </div>
          <div className={styles.buttons}>
            <button onClick={cancel}>Cancel</button>
            <button onClick={save}>Save</button>
            <div
              className={styles.saveIco}
              style={{ color: saveState == SaveState.Saved ? "green" : saveState == SaveState.Error ? "red" : "black", textAlign: "right" }}
            >
              {saveState == SaveState.Saving
                ? "..."
                : saveState == SaveState.Saved
                ? "✓"
                : saveState == SaveState.Error
                ? "✗"
                : ""}
            </div>
          </div>
        </>
      ) : (
        "Loading..."
      )}
    </>
  );
}

export default Index;
