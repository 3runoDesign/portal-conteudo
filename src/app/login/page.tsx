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
  Box,
  chakra
} from "@chakra-ui/react";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation'
import { useAppDispatch, RootState, useAppSelector } from '~/lib/store';
import { setToken, clearToken } from '~/lib/slices/authSlice';
import { SubmitHandler, useForm } from "react-hook-form";

interface LoginFormInputs {
  username: string;
  password: string;
}

const Login = () => {
  const toast = useToast();
  const toastIdRef = useRef<ToastId | undefined>(undefined);

  const { register, handleSubmit, setError, formState: { errors } } = useForm<LoginFormInputs>();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const { token, username, userId } = await response.json();
      dispatch(setToken({ token, username, userId }));
      toastIdRef.current = toast({ status: "success", description: "seja bem-vindo!" });
      router.push('/');
    } else {
      const errorMessage = 'Usuário ou senha incorretos!';
      setError('username', { type: 'manual', message: "informe outro usuário" });
      setError('password', { type: 'manual', message: "informe outra senha" });
      toastIdRef.current = toast({ status: "error", description: errorMessage });
    }
  };

  const handleLogout = () => {
    dispatch(clearToken());
    router.push('/login');
  };

  return (
    <Center minH={"100vh"} flexDirection="column" gap={"4"}>
      <Heading>Login page</Heading>

      <chakra.form w="100%" maxW="380px" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <FormControl mb={4} isInvalid={!!errors.username}>
          <FormLabel htmlFor="username">Usuário</FormLabel>
          <Input
            id="username"
            {...register('username', { required: 'Usuário é obrigatório' })}
          />
          {errors.username && <span>{errors.username.message}</span>}
        </FormControl>
        <FormControl mb={4} isInvalid={!!errors.password}>
          <FormLabel htmlFor="password">Senha</FormLabel>
          <InputGroup>
            <Input
              id="password"
              type="password"
              {...register('password', { required: 'Senha é obrigatória' })}
            />
          </InputGroup>
          {errors.password && <span>{errors.password.message}</span>}
        </FormControl>
        <Box>
          <Button type="submit" colorScheme="green" color="white">
            Entrar
          </Button>
        </Box>
      </chakra.form>

      <HStack mt={16} gap={2}>
        <Button colorScheme="blue" color="white">
          <Link href="register/">Criar conta</Link>
        </Button>
        <Button variant="ghost" color="black">
          <Link href="/">Voltar para home</Link>
        </Button>
      </HStack>
    </Center>
  );
};

export default Login;
