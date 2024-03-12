import React from "react";
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
  onReady: (editor: Editor) => void;
}

const CustomEditor = ({ initialData, onChange,  onReady}: CustomEditorProps) => {


  return (
    <div>
      <CKEditor
        editor={Editor}
        data={initialData}
        config={editorConfiguration2}
        onChange={onChange}
        onReady={onReady}
      />
    </div>
  );
};

CustomEditor.displayName = "CustomEditor";

export default CustomEditor;
