import useSWR from "swr";
import { PageData } from "./api/getPage";
import { NamesData } from "./api/getNames";
import styles from "../styles/index.module.css";
import { useState, useEffect } from "react";
import Link from "next/link";
const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then((res) => res.json());

function Index() {
  const [pageNum, setPageNum] = useState(1);

  const { data: page, error: pageError } = useSWR<PageData>(`/api/getPage?id=${pageNum}`, fetcher);
  const { data: names, error: namesError } = useSWR<NamesData>("/api/getNames", fetcher);

  return (
    <>
      <div className={styles.header}>
        {namesError ? (
          <p>Failed to load pages</p>
        ) : names ? (
          names.map((name) => (
            <div
              className={pageNum === name.pageNum ? styles.pages + " " + styles.active : styles.pages}
              onClick={() => setPageNum(name.pageNum)}
              key={name.id}
            >
              {name.name}
            </div>
          ))
        ) : (
          "Loading..."
        )}
      </div>
      <div className={styles.page}>
        {pageError ? (
          <>
            <p>Failed to load page</p>
          </>
        ) : page ? (
          <>
            <div
              dangerouslySetInnerHTML={{
                __html: page.content,
              }}
            ></div>
          </>
        ) : (
          "Loading..."
        )}
      </div>
    </>
  );
}

export default Index;
