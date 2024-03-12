import useSWR from "swr";
import { PageData } from "./api/getPage";
import { NamesData } from "./api/getNames";
import styles from "../styles/index.module.css";
import { useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import {readFileSync} from "fs";
import { InferGetStaticPropsType } from "next";
const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then((res) => res.json());

export function getStaticProps() {
  const ckStyles = readFileSync("./src/styles/ckStyles.css", "utf8");
  return {
    props: { ckStyles },
  }
}

function Index({ckStyles}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [pageNum, setPageNum] = useState(1);

  const { data: page, error: pageError } = useSWR<PageData>(`/api/getPage?id=${pageNum}`, fetcher);
  const { data: names, error: namesError } = useSWR<NamesData>("/api/getNames", fetcher);

  return (
    <>
    <Head>
      <style>
        {ckStyles}
      </style>
    </Head>
    <div className={styles.container}>
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
            <div className="ck-content"
              dangerouslySetInnerHTML={{
                __html: page.content,
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
