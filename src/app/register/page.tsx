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
  VStack,
  Link,
  HStack,
  Box
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation'
import { useAppSelector } from '~/lib/store';
import Header from "~/common/components/header";

const Register = () => {
  const toast = useToast()
  const toastIdRef = useRef<ToastId | undefined>(undefined);
  const token = useAppSelector((state) => state.auth.token);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  

function errorToast(msg: string) {
    toastIdRef.current = toast({ status: "error", description: msg })
  }

  useEffect(() => {
    if (token) {
      router.push('/');
    }
  }, [router]);

  const handleRegister = async () => {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      router.push('/login');
    } else {
      errorToast('Falha ao criar registro');
    }
  };

  return (
    <>
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
          <Button colorScheme={"blue"} color={"white"} onClick={handleRegister}>
            Registrar
          </Button>
        </Box>
        <HStack mt={16} gap={2}>
          <Button colorScheme={"green"} color={"white"}>
            <Link href="login/">
              Logar
            </Link>
          </Button>

          <Button variant='ghost' color={"black"}>
            <Link href="/">
              voltar para home
            </Link>
          </Button>
        </HStack>
      </Center>
    </>
  );
};

export default Register;
