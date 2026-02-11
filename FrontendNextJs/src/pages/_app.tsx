import Head from 'next/head';
import '@/styles/globals.css'
import { ThemeProvider } from "@/components/theme-provider"
import { ClerkProvider } from "@clerk/nextjs";

import type { AppProps } from 'next/app'
import { Toaster } from '@/components/ui/toaster';
import {LoadingProvider} from '../custom components/LoadingContext';
import {ProgressLoadingProvider} from '../custom components/ProgressLoadingContext';
export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="min-w-0 w-full">
      <Head>
        <title>Rentalux</title>
      </Head>
      <Toaster />
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
      >

      <ClerkProvider {...pageProps}>
        <LoadingProvider>
        <ProgressLoadingProvider>
        <Component {...pageProps} />
        </ProgressLoadingProvider>
        </LoadingProvider>
      </ClerkProvider>
      </ThemeProvider>
    </div>
  );
}
