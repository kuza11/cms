import React, { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import useSWR, { useSWRConfig } from "swr";
import { PageData } from "../api/getPage";
import { NumsNamesData } from "../api/getNumsNames";
import { VersionsData } from "../api/getVersions";
import { useState } from "react";
import Editor from "ckeditor5-custom-build";
import styles from "../../styles/index.module.css";
import api from "../../../api.json";

interface CustomEditorProps {
  initialData: string;
  onChange: (event: any, editor: Editor) => void;
  onReady: (editor: Editor) => void;
}

const CustomEditor: React.ComponentType<CustomEditorProps> = dynamic(
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

const fetcher = (...args: Parameters<typeof fetch>) => {
  args[1] = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      key: api.key,
      edit: true,
    }),
  };
  return fetch(...args).then((res) => res.json());
};

function Index() {
  const [pageNum, setPageNum] = useState(1);
  const [pageVersion, setPageVersion] = useState<number | null>(null);
  const [pageContent, setPageContent] = useState<string | null>(null);
  const [saveState, setSaveState] = useState(SaveState.None);
  const [changed, setChanged] = useState(false);
  const [pageHidden, setPageHidden] = useState<boolean | null>(null);
  const editorRef = useRef<Editor | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pageContentOldRef = useRef<string | null>(null);
  const toolboxStateRef = useRef<boolean>(false);

  const { data: pageVersions, error: pageVersionsError } = useSWR<VersionsData>(
    `/api/getVersions?num=${pageNum}`,
    fetcher
  );

  console.log(pageVersions);
  const { data: page, error: pageError } = useSWR<PageData>(
    `/api/getPage?num=${pageNum}&version=${pageVersion}`,
    fetcher
  );
  const { data: numsNames, error: numsNamesError } = useSWR<NumsNamesData>("/api/getNumsNames", fetcher);

  const { mutate } = useSWRConfig();

  if (pageContent == null && page) {
    setPageContent(page.content ? page.content : "");
  }
  if (pageVersion == null && page) {
    setPageVersion(pageVersions ? pageVersions[0].pageVersion : null);
  }
  if (pageHidden == null && page) {
    setPageHidden(page.hidden);
  }

  useEffect(() => {
    setPageVersion(null);
    setChanged(false);
    setPageHidden(null);
    toolboxStateRef.current = false;
  }, [pageNum]);

  useEffect(() => {
    setChanged(false);
    setPageHidden(null);
    toolboxStateRef.current = false;
  }, [pageVersion]);

  function save() {
    if (!changed) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setSaveState(SaveState.Saving);
    pageContentOldRef.current = page?.content ? page.content : "";
    fetch("/api/setPage", {
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
        editorRef.current?.setData(pageContentOldRef.current != null ? pageContentOldRef.current : "");
      } else {
        setSaveState(SaveState.Error);
      }
      timeoutRef.current = setTimeout(() => {
        setSaveState(SaveState.None);
      }, 4000);
      mutate(`/api/getVersions?num=${pageNum}`);
      mutate(`/api/getPage?num=${pageNum}&version=${pageVersions ? pageVersions[0].pageVersion + 1 : ""}`);
      setPageVersion(pageVersions ? pageVersions[0].pageVersion + 1 : null);
    });
  }

  function cancel() {
    if (page?.content) editorRef.current?.setData(page?.content);
  }

  function addPage() {
    fetch("/api/addPage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key: api.key,
      }),
    }).then((res) => {
      if (res.status == 200) {
        mutate(`/api/getNumsNames`);
        setPageNum(numsNames ? numsNames[numsNames.length - 1].pageNum + 1 : pageNum);
      }
    });
  }

  function changeStataus() {
    console.log(pageHidden);
    fetch("/api/updatePage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: page?.id,
        hidden: !pageHidden,
        key: api.key,
      }),
    }).then((res) => {
      if (res.status == 200) {
        console.log(pageHidden);
        mutate(`/api/getNumsNames`);
        mutate(`/api/getVersions?num=${pageNum}`);
        mutate(`/api/getPage?num=${pageNum}&version=${pageVersion}`);
        setPageHidden(!pageHidden);
      }
    });
  }

  function rename() {}

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
        {numsNames ? (
          <div className={styles.plus} onClick={addPage}>
            +
          </div>
        ) : (
          ""
        )}
      </div>
      <div className={styles.versionsHeader}>
        <div style={{ marginRight: ".5rem" }}>Verze:</div>
        {pageVersionsError ? (
          <div>Failed to load versions</div>
        ) : pageVersions ? (
          pageVersions.map((version) => (
            <div
              className={
                `${
                  pageVersion === version.pageVersion ? styles.versions + " " + styles.activeVersion : styles.versions
                } ${version.hidden ? styles.black : styles.blue}`
              }
              onClick={() => setPageVersion(version.pageVersion)}
              key={version.pageVersion}
            >
              {version.pageVersion}
              {version.hidden ? "1" : "0"}
            </div>
          ))
        ) : (
          "Loading..."
        )}
      </div>
      {page ? (
        <div className={styles.options}>
          <button onClick={changeStataus}>{pageHidden ? "Zobrazit" : "Skrýt"}</button>
          <div>
            <input type="text" value={page?.name} />
            <button onClick={rename}>Přejmenovat</button>
          </div>
        </div>
      ) : (
        ""
      )}
      {pageError ? (
        <p>Failed to load page</p>
      ) : page ? (
        <>
          <div className={styles.cke}>
            <CustomEditor
              onChange={(event, editor) => {
                setPageContent(editor.getData());
                setChanged(true);
              }}
              initialData={page?.content ? page?.content : " "}
              onReady={(editor) => {
                editorRef.current = editor;
                // Insert the toolbar before the editable area.
                const editableElement = editor.ui.getEditableElement();
                const toolbarElement = editor.ui.view.toolbar.element;
                if (
                  editableElement instanceof HTMLElement &&
                  toolbarElement instanceof HTMLElement &&
                  !toolboxStateRef.current
                ) {
                  editableElement.parentElement?.insertBefore(toolbarElement, editableElement);
                  toolboxStateRef.current = true;
                }
              }}
            />
          </div>
          <div className={styles.buttons}>
            <button disabled={!changed} onClick={cancel}>
              Cancel
            </button>
            <button disabled={!changed} onClick={save}>
              Save
            </button>
            <div
              className={styles.saveIco}
              style={{
                color: saveState == SaveState.Saved ? "green" : saveState == SaveState.Error ? "red" : "black",
                textAlign: "right",
              }}
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
