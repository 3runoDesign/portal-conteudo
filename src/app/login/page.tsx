"use client"

import {
  Center,
  Heading,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  useToast,
  ToastId,
  HStack,
  Link,
  Box
} from "@chakra-ui/react";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation'
import { useAppDispatch, RootState, useAppSelector } from '~/lib/store';
import { setToken, clearToken } from '~/lib/slices/authSlice';

const Login = () => {
  const toast = useToast()
  const toastIdRef = useRef<ToastId | undefined>(undefined);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isClient, setIsClient] = useState(false);

  const token = useAppSelector((state) => state.auth.token);

  const router = useRouter();
  const dispatch = useAppDispatch();

  function errorToast() {
    toastIdRef.current = toast({ status: "error", description: 'informe um usuario e senha correta!' })
  }

  useEffect(() => {
    setIsClient(token != null);
  }, [isClient]);

  const handleLogin = async () => {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const { token, username, userId } = await response.json();
      console.log("page ok::", { token, username, userId })

      dispatch(setToken({ token, username, userId }));
      router.push('/');
    } else {
      errorToast()
    }
  };

  const handleLogout = () => {
    dispatch(clearToken());
    setIsClient(false);
    router.push('/login');
  };

  return (
    <Center minH={"100vh"} flexDirection="column" gap={"4"}>
      <Heading>Login page</Heading>

      <form action="" autoComplete="off">
        <FormControl mb={4}>
          <FormLabel htmlFor="email">usuário</FormLabel>
          <Input id="email" value={username}
            onChange={(e) => setUsername(e.target.value)} />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel htmlFor="password">senha</FormLabel>
          <InputGroup>
            <Input id="password" type={"password"} value={password}
              onChange={(e) => setPassword(e.target.value)} />
          </InputGroup>
        </FormControl>
      </form>

      <Box>
        <Button colorScheme={"green"} color={"white"} onClick={handleLogin}>
          Entrar
        </Button>
      </Box>

      <HStack mt={16} gap={2}>
        <Button colorScheme={"blue"} color={"white"}>
          <Link href="register/">
            criar conta
          </Link>
        </Button>

        <Button variant='ghost' color={"black"}>
          <Link href="/">
            voltar para home
          </Link>
        </Button>
      </HStack>
    </Center>
  );
};

export default Login;
