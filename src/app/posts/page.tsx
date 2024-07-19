'use client';

import {
  Center,
  Heading,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  Textarea,
  useToast,
  ToastId,
  HStack,
  Link,
  Box,
  chakra
} from "@chakra-ui/react";
import { useRef, useState } from 'react';
import { useAppSelector } from '~/lib/store';
import { useRouter } from 'next/navigation'
import { useForm, SubmitHandler } from 'react-hook-form';
import useAuth from '../../hooks/useAuth';

interface PostFormInputs {
  title: string;
  content: string;
}

const CreatePost = () => {
  useAuth();

  const toast = useToast();
  const toastIdRef = useRef<ToastId | undefined>(undefined);

  const token = useAppSelector((state) => state.auth.token);
  const router = useRouter();

  const { register, handleSubmit, setError, formState: { errors } } = useForm<PostFormInputs>();

  const onSubmit: SubmitHandler<PostFormInputs> = async (data) => {
    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      toastIdRef.current = toast({ status: "success", description: "post criado com sucesso!" });
      router.push('/');
    } else {
      const errorMessage = 'Falha ao criar post';
      setError('title', { type: 'manual', message: errorMessage });
      setError('content', { type: 'manual', message: errorMessage });
      toastIdRef.current = toast({ status: "error", description: errorMessage });
    }
  };

  return (
    <Center minH={"100vh"} flexDirection="column" gap={"4"}>
      <Heading>Post</Heading>

      <chakra.form w="100%" maxW="380px" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <FormControl mb={4} isInvalid={!!errors.title}>
          <FormLabel htmlFor="title">Título</FormLabel>
          <Input
            id="title"
            placeholder="Title"
            {...register('title', { required: 'Título é obrigatório' })}
          />
          {errors.title && <span>{errors.title.message}</span>}
        </FormControl>
        <FormControl mb={4} isInvalid={!!errors.content}>
          <FormLabel htmlFor="content">Conteúdo</FormLabel>
          <Textarea
            id="content"
            {...register('content', { required: 'Conteúdo é obrigatório' })}
          />
          {errors.content && <span>{errors.content.message}</span>}
        </FormControl>
        <Box>
          <Button type="submit" colorScheme="blue" color="white">
            Criar post
          </Button>
        </Box>
      </chakra.form>

      <HStack mt={16} gap={2}>
        <Button variant='ghost' color={"black"}>
          <Link href="/">Voltar para home</Link>
        </Button>
      </HStack>
    </Center>
  );
};

export default CreatePost;
