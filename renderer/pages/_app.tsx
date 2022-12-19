import type { AppProps } from 'next/app';

import { WagmiConfig } from 'wagmi';
import { chains, wagmiClient } from '@/modules/providers/wagmi';
import { darkTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit';

import '@rainbow-me/rainbowkit/styles.css';
import { DaiBalanceContextProvider } from '../modules/dai/context/DaiBalance.context';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} theme={darkTheme()}>
        <DaiBalanceContextProvider>
          <Component {...pageProps} />
        </DaiBalanceContextProvider>
        <style jsx global>{`
          :root {
            --gap: 16pt;
            --black-background: black;
            --page-background-color: white;
            --primary: blue;
          }

          * {
            scroll-behavior: smooth;
          }

          @font-face {
            font-family: 'FT Polar Trial';
            src: url('/fonts/FTPolarTrial-Medium.woff2');
            font-weight: normal;
          }

          @font-face {
            font-family: 'FT Polar Trial';
            src: url('/fonts/FTPolarTrial-Bold.woff2');
            font-weight: bold;
          }

          body {
            font-family: 'FT Polar Trial', 'Helvetica Neue', sans-serif;
            margin: 0;
            padding: 0;
            color: var(--text-main-color);
            background: var(--page-background-color);
          }

          * {
            box-sizing: border-box;
          }

          img {
            max-width: 100%;
          }
        `}</style>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
