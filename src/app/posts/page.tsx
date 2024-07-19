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
  Box
} from "@chakra-ui/react";
import { useRef, useState } from 'react';
import { useAppSelector } from '~/lib/store';
import { useRouter } from 'next/navigation'
import useAuth from '../../hooks/useAuth';

const CreatePost = () => {
  useAuth();

  const toast = useToast()
  const toastIdRef = useRef<ToastId | undefined>(undefined);

  const token = useAppSelector((state) => state.auth.token);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const router = useRouter();

  function errorToast(msg: string) {
    toastIdRef.current = toast({ status: "error", description: msg })
  }

  const handleCreatePost = async () => {
    let bodyJSON = JSON.stringify({ title, content })

    console.log({ bodyJSON })
    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content }),
    });

    if (response.ok) {
      router.push('/');
    } else {
      errorToast('Falha ao criar post');
    }
  };

  return (
    <Center minH={"100vh"} flexDirection="column" gap={"4"}>
      <Heading>Post</Heading>

      <form action="" autoComplete="off">
        <FormControl mb={4}>
          <FormLabel htmlFor="title">título</FormLabel>
          <Input
            id="title"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel htmlFor="conteudo">conteúdo</FormLabel>
          <Textarea id="conteudo" value={content}
            onChange={(e) => setContent(e.target.value)} />
        </FormControl>
      </form>


      <Box>
        <Button colorScheme={"blue"} color={"white"} onClick={handleCreatePost}>
          Criar post
        </Button>
      </Box>
      <HStack mt={16} gap={2}>
        <Button variant='ghost' color={"black"}>
          <Link href="/">
            voltar para home
          </Link>
        </Button>
      </HStack>
    </Center>
  );
};

export default CreatePost;
