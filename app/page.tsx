import '@root/global.scss';
import '@root/animations.scss';

import * as React from 'react';
import DemoSearchComponentTwo from '@demos/DemoSearchComponentTwo';
import DefaultLayout from '@components/DefaultLayout';

export async function generateMetadata({ params, searchParams }) {
  const title = "AI Image Generator";
  const description = "Generate images using artificial intelligence";
  const url = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:10000';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{
        url,
      }],
      type: 'website',
    },
    icons: {
      icon: '/favicon-32x32.png',
      shortcut: '/favicon-16x16.png',
    },
  };
}

export default async function Page(props) {
  return (
    <DefaultLayout>
      <DemoSearchComponentTwo />
    </DefaultLayout>
  );
}
