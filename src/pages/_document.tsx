import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" style={{ minHeight: "100vh" }}>
      <Head />
      <body style={{ margin: 0, minHeight: "100vh" }}>
        <Main/>
        <NextScript />
      </body>
    </Html>
  );
}
