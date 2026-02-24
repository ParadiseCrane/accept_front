// import { ServerStyles, createStylesServer } from '@mantine/next';
import { ColorSchemeScript } from "@mantine/core";
import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document";

// const stylesServer = createStylesServer();

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return {
      ...initialProps,
      styles: [
        initialProps.styles,
        // <ServerStyles
        //   html={initialProps.html}
        //   server={stylesServer}
        //   key="styles"
        // />,
      ],
    };
  }
  render() {
    return (
      <Html lang="ru" suppressHydrationWarning>
        <Head>
          <link rel="shortcut" href="/favicon.ico" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Exo+2&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Red+Hat+Mono&display=swap"
            rel="stylesheet"
          />
          <script
            defer
            src="https://cloud.umami.is/script.js"
            data-website-id="05d82b05-8d63-46e3-98d4-4366e22b0e65"
          ></script>
          <ColorSchemeScript defaultColorScheme="auto" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
