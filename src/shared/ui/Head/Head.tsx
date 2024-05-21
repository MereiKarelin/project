'use client';
import Head from 'next/head';
import Script from 'next/script';
import { useEffect, useState } from 'react';

type PropTypes = {
  gaTrackingId: string | undefined;
};

export const HeadComponent = ({ gaTrackingId }: PropTypes) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => setIsLoading(false), []);

  if (isLoading) {
    return null;
  }

  return (
    <Head>
      <title>Yourbandy</title>
      {gaTrackingId && (
        <>
          <Script
            async={true}
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${gaTrackingId}`}
          />
          <Script
            async={true}
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5250109617775201"
            crossOrigin="anonymous"
          />
          <Script src={'https://yandex.ru/ads/system/context.js'} async={true}></Script>
          <Script
            id="gtag-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaTrackingId}');
          `,
            }}
          />
        </>
      )}
    </Head>
  );
};
