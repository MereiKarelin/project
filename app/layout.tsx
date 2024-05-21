import './styles/global.scss';

import { Metadata } from 'next';
import Script from 'next/script';

import { AuthProvider } from '@/features/Auth/useAuth/useAuth';
import { NotificationProvider } from '@/features/Notifications/useNotifications/useNotifications';
import { BodyWrapper } from '@/shared/components/BodyWrapper/BodyWrapper';
import { FollowRelationsProvider } from '@/shared/context/provider';
import StoreProvider from '@/shared/store/StoreProvider';

export const metadata: Metadata = {
  metadataBase: new URL('https://yourbandy.com'),
  title: 'Yourbandy',
  description:
    'Yourbandy — это революция в мире социальных сетей, предназначенная для тех, кто стремится к самовыражению и желает делиться своим творчеством с миром. Мы предлагаем вам не просто создать профиль, а вдохнуть в него жизнь с помощью расширенных кастомизаций: от изменения дизайна страницы до уникальных эффектов для ваших постов. Ваше творчество не знает границ — и наша платформа тоже!',
  icons: {
    icon: 'https://cdn.yourbandy.com/public/icons/whitecaticon.png',
  },
  openGraph: {
    title: 'Yourbandy',
    description:
      'Yourbandy — это революция в мире социальных сетей, предназначенная для тех, кто стремится к самовыражению и желает делиться своим творчеством с миром. Мы предлагаем вам не просто создать профиль, а вдохнуть в него жизнь с помощью расширенных кастомизаций: от изменения дизайна страницы до уникальных эффектов для ваших постов. Ваше творчество не знает границ — и наша платформа тоже!',
    url: 'https://yourbandy.com',
    type: 'website',
    locale: 'ru_RU',
    images: [
      'https://cdn.yourbandy.com/public/images/opengraph_preview_1.png',
      'https://cdn.yourbandy.com/public/icons/whitecaticon.png',
    ],
  },
};

type PropTypes = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: PropTypes) {
  return (
    <html lang="en" className="overflow-hidden">
      <head>
        {process.env.GA_TRACKING_ID && (
          <>
            <Script
              async={true}
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GA_TRACKING_ID}`}
            />
            <Script
              async={true}
              src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5250109617775201"
              crossOrigin="anonymous"
            />
            <Script
              id="gtag-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.GA_TRACKING_ID}');
                `,
              }}
            />
          </>
        )}
        <Script src={'https://yandex.ru/ads/system/context.js'} async={true}></Script>
      </head>
      <BodyWrapper>
        <StoreProvider>
          <AuthProvider>
            <NotificationProvider>
              <FollowRelationsProvider>{children}</FollowRelationsProvider>
            </NotificationProvider>
          </AuthProvider>
        </StoreProvider>
      </BodyWrapper>
    </html>
  );
}
