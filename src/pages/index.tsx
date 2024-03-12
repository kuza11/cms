import useSWR from "swr";
import { PageData } from "./api/getPage";
import { NumsNamesData } from "./api/getNumsNames";
import styles from "../styles/index.module.css";
import { useState, useEffect } from "react";
import Head from "next/head";
import { readFileSync } from "fs";
import { InferGetStaticPropsType } from "next";
const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then((res) => res.json());

export function getStaticProps() {
  const ckStyles = readFileSync("./src/styles/ckStyles.css", "utf8");
  return {
    props: { ckStyles },
  };
}

function Index({ ckStyles }: InferGetStaticPropsType<typeof getStaticProps>) {
  const [pageNum, setPageNum] = useState(1);

  const { data: page, error: pageError } = useSWR<PageData>(`/api/getPage?num=${pageNum}`, fetcher);
  const { data: numsNames, error: numsNamesError } = useSWR<NumsNamesData>("/api/getNumsNames", fetcher);

  return (
    <>
      <Head>
        <style>{ckStyles}</style>
      </Head>
      <div className={styles.container}>
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
        <div className={styles.page}>
          {pageError ? (
            <>
              <p>Failed to load page</p>
            </>
          ) : page ? (
            <>
              <div
                className="ck-content"
                dangerouslySetInnerHTML={{
                  __html: page.content ? page.content : "",
                }}
              ></div>
            </>
          ) : (
            "Loading..."
          )}
        </div>
      </div>
    </>
  );
}

export default Index;
