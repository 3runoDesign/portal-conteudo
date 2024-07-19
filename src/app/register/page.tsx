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
  Link,
  HStack,
  Box,
  chakra
} from "@chakra-ui/react";
import { useEffect, useRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation'
import { useAppSelector } from '~/lib/store';

interface RegisterFormInputs {
  username: string;
  password: string;
}

const Register = () => {
  const toast = useToast();
  const toastIdRef = useRef<ToastId | undefined>(undefined);
  const token = useAppSelector((state) => state.auth.token);

  const { register, handleSubmit, setError, formState: { errors } } = useForm<RegisterFormInputs>();

  const router = useRouter();

function errorToast(msg: string) {
    toastIdRef.current = toast({ status: "error", description: msg })
  }

  useEffect(() => {
    if (token) {
      router.push('/');
    }
  }, [router]);

  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      toastIdRef.current = toast({ status: "success", description: "usuário criado com sucesso!" });
      router.push('/login');
    } else {
      const errorMessage = 'Falha ao criar registro';
      setError('username', { type: 'manual', message: errorMessage });
      setError('password', { type: 'manual', message: errorMessage });
      toastIdRef.current = toast({ status: "error", description: errorMessage });
    }
  };
  return (
    <>
      <Center minH={"100vh"} flexDirection="column" gap={"4"}>
      <Heading>Página de Registro</Heading>

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
          <Button type="submit" colorScheme="blue" color="white">
            Registrar
          </Button>
        </Box>
      </chakra.form>

      <HStack mt={16} gap={2}>
        <Button colorScheme="green" color="white">
          <Link href="login/">Logar</Link>
        </Button>
        <Button variant="ghost" color="black">
          <Link href="/">Voltar para home</Link>
        </Button>
      </HStack>
    </Center>
    </>
  );
};

export default Register;
