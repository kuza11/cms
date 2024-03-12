import React, {useRef}  from "react";
import dynamic from "next/dynamic";
import useSWR from "swr";
import { PageData } from "../api/getPage";
import { NamesData } from "../api/getNames";
import { useState } from "react";
import Editor from "ckeditor5-custom-build";
import styles from "../../styles/index.module.css";

import api from "../../../api.json";

const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then((res) => res.json());


const CustomEditor = dynamic(
  () => {
    return import("../../components/custom-editor");
  },
  { ssr: false }
);

interface CustomEditorProps {
  onChange: (event: any, editor: Editor) => void;
  initialData?: string;
}



function Index() {
  const [id, setid] = useState(1);
  const [pageContent, setPageContent] = useState("");
  const editorRef = useRef<Editor | null>(null);

  const { data: page, error: pageError } = useSWR<PageData>(`/api/getPage?id=${id}`, fetcher);

  if (pageContent == "" && page) setPageContent(page.content);

  const { data: names, error: namesError } = useSWR<NamesData>("/api/getNames", fetcher);

  function save() {
    fetch("/api/setPage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        content: pageContent,
        key: api.key,
      }),
    });
  }

  function cancel() {
    if(page?.content)
    editorRef.current?.setData(page?.content);
  }

  return (
    <>
      <div className={styles.header}>
        {namesError ? (
          <p>Failed to load pages</p>
        ) : names ? (
          names.map((name) => (
            <div
              className={id === name.id ? styles.pages + " " + styles.active : styles.pages}
              onClick={() => setid(name.id)}
              key={name.id}
            >
              {name.name}
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
              initialData={page?.content}
              onReady={(editor) => {
                //console.log("Editor is ready to use!", editor.ui.getEditableElement());
                editorRef.current = editor;
                // Insert the toolbar before the editable area.
                const editableElement = editor.ui.getEditableElement();
                const toolbarElement = editor.ui.view.toolbar.element;
                if (editableElement instanceof HTMLElement && toolbarElement instanceof HTMLElement) {
                  editableElement.parentElement?.insertBefore(toolbarElement, editableElement);
                }
      
                //this.editor = editor;
              }}
            />
          </div>
          <div className={styles.buttons}>
          <button onClick={cancel}>Cancel</button>
          <button onClick={save}>Save</button>
          </div>
        </>
      ) : (
        "Loading..."
      )}
    </>
  );
}

export default Index;