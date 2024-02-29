import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import Editor from "ckeditor5-custom-build";
import { useEffect } from "react";

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
function CustomEditor(props) {
  return (
    <div>
    <CKEditor
      editor={Editor}
      data={props.initialData}
      config={editorConfiguration2}
      onChange={(event, editor) => {
        const data = editor.getData();
        //console.log({ event, editor, data });
      }}
      onReady={(editor) => {
        //console.log("Editor is ready to use!", editor.ui.getEditableElement());

        // Insert the toolbar before the editable area.
        if(editor.ui.getEditableElement()){
          editor.ui
            .getEditableElement()
            .parentElement.insertBefore(
              editor.ui.view.toolbar.element,
              editor.ui.getEditableElement()
            );
        }


        //this.editor = editor;
      }}
    />
    </div>
  );
}

export default CustomEditor;
