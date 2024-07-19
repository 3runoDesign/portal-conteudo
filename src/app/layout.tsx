import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import StoreProvider from '~/lib/Provider/StoreProvider';
import { UIProvider } from '~/lib/Provider/UIProvider';
import {
  Flex,
  Box,
} from '@chakra-ui/react';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "portal conteúdo",
  description: "portal de gerenciamento de conteúdo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StoreProvider>
      <html lang="en">
        <body className={inter.className}>
          <UIProvider>
            <Flex
              as="section"
              w="full"
              top="0"
              flexDir="column"
              justifyContent="center"
              alignItems="center">
              <Box w="full" maxW={{ base: 'xl', md: '7xl' }} mx="auto" pos="relative" w="full">
                {children}
              </Box>
            </Flex>
          </UIProvider>
        </body>
      </html>
    </StoreProvider>
  );
}
