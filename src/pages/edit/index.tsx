import React from "react";
import dynamic from "next/dynamic";
import useSWR from "swr";
import { PageData } from "../api/getPage";
import styles from "../../styles/edit.module.css";

const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args).then((res) => res.json());

const CustomEditor = dynamic(
  () => {
    return import("../../components/custom-editor");
  },
  { ssr: false }
);

function Index() {
  const { data: page, error: pageError } = useSWR<PageData>(`/api/getPage?id=${pageNum}`, fetcher);
  return (
    <>
      <div className={styles.header}>
        
      </div>
      <div className={styles.cke}>
        <CustomEditor initialData="<h1></h1>" />
      </div>
    </>
  );
}

export default Index;
