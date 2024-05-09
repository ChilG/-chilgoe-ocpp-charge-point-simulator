import React from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { AppCacheProvider } from '@mui/material-nextjs/v14-pagesRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../src/lib/mui/theme';
import TRPCProvider from '../src/core/provider/TRPCProvider';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import AppLayout from '../src/core/AppLayout';

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

export default function MyApp(props: AppProps) {
  const { Component, pageProps } = props;
  return (
    <AppCacheProvider {...props}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <TRPCProvider>
          <AppLayout>
            <Component {...pageProps} />
          </AppLayout>
        </TRPCProvider>
      </ThemeProvider>
    </AppCacheProvider>
  );
}
