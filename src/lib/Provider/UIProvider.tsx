import React from 'react';
import { ChakraProvider } from '@chakra-ui/react'

export function UIProvider({ children }: { children: React.ReactNode }) {
  return <ChakraProvider>{children}</ChakraProvider>
}