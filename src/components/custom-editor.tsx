import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import Editor from "ckeditor5-custom-build";

const editorConfiguration2 = {
  toolbar: [
    "heading",
    "|",
    "fontSize",
    "fontFamily",
    "|",
    "fontColor",
    "fontBackgroundColor",
    "horizontalLine",
    "|",
    "bold",
    "italic",
    "underline",
    "strikethrough",
    "highlight",
    "subscript",
    "superscript",
    "findAndReplace",
    "selectAll",
    "|",
    "alignment",
    "|",
    "numberedList",
    "bulletedList",
    "|",
    "outdent",
    "indent",
    "|",
    "todoList",
    "link",
    "blockQuote",
    "imageInsert",
    "insertTable",
    "mediaEmbed",
    "code",
    "codeBlock",
    "htmlEmbed",
    "|",
    "undo",
    "redo",
  ],
};

export interface CustomEditorProps {
  initialData?: string;
  onChange: (event: any, editor: Editor) => void;
}

export interface CustomEditorRef {
  setContent: (content: string) => void;
}

const CustomEditor = forwardRef<CustomEditorRef, CustomEditorProps>(({ initialData, onChange }, ref) => {
  const editorRef = useRef<Editor | null>(null);

  useImperativeHandle(ref, () => ({
    setContent: (content: string) => {
      if (editorRef.current) {
        editorRef.current.setData(content);
      }
    },
  }));

  return (
    <div>
      <CKEditor
        editor={Editor}
        data={initialData}
        config={editorConfiguration2}
        onChange={onChange}
        onReady={(editor) => {
          //console.log("Editor is ready to use!", editor.ui.getEditableElement());
          editorRef.current = editor;
          console.log(editorRef);
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
  );
});

CustomEditor.displayName = "CustomEditor";

export default CustomEditor;
