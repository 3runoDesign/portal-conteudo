"use client"

import {
  Center,
  Heading,
  Button,
  FormControl,
  FormLabel,
  Textarea,
  HStack,
  VStack,
  Link,
  Box,
  chakra,
  Card,
  CardBody,
  Icon,
  Text,
  useToast,
  ToastId
} from "@chakra-ui/react";
import { ChatIcon } from '@chakra-ui/icons'
import React, { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '../../../lib/store';
import { useParams, useRouter } from 'next/navigation'
import { Comment } from '../../../types';
import { useForm, SubmitHandler } from 'react-hook-form';

interface CommentFormInputs {
  content: string;
}

const Comments = () => {
  const toast = useToast();
  const toastIdRef = useRef<ToastId | undefined>(undefined);

  const auth = useAppSelector((state) => state.auth);
  const [comments, setComments] = useState<Comment[]>([]);
  const router = useRouter();
  const params = useParams();
  const postId = params.postId as string;

  const { register, handleSubmit, setError, reset, formState: { errors } } = useForm<CommentFormInputs>();

  useEffect(() => {
    const fetchComments = async () => {
      const response = await fetch(`/api/comments?postId=${postId}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      const data = await response.json();
      setComments(data);
    };

    if (auth.token) {
      fetchComments();
    } else {
      router.push('/login');
    }
  }, [auth, postId, router]);

  const onSubmit: SubmitHandler<CommentFormInputs> = async (data) => {
    const userId = auth.userId;
    const response = await fetch('/api/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.token}`,
      },
      body: JSON.stringify({ ...data, postId, userId }),
    });

    if (response.ok) {
      const newComment = await response.json();
      setComments((prev) => [...prev, newComment]);
      reset();
    } else {
      const errorMessage = 'Falha ao adicionar o comentário';
      setError('content', { type: 'manual', message: errorMessage });
      toastIdRef.current = toast({ status: "error", description: errorMessage});
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const response = await fetch(`/api/comments?commentId=${encodeURIComponent(commentId)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (response.status === 204) {
        setComments((prev) => prev.filter((comment) => comment.id !== commentId));
      } else {
        const errorData = await response.json();
        toastIdRef.current = toast({ status: "error", description:`Falha ao deletar o comentário: ${errorData.message || 'Unknown error'}`})
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      toastIdRef.current = toast({ status: "error", description:'Ocorreu um erro ao tentar excluir o comentário.'});
    }
  };

  return (
    <>
    <Center minH={"50vh"} flexDirection="column" gap={"4"}>
      <Heading>Post</Heading>

      <chakra.form w="100%" maxW="380px" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <FormControl mb={4} isInvalid={!!errors.content}>
          <FormLabel htmlFor="content">Conteúdo</FormLabel>
          <Textarea
            id="content"
            placeholder="Adicione um comentário"
            {...register('content', { required: 'Conteúdo é obrigatório' })}
          />
          {errors.content && <span>{errors.content.message}</span>}
        </FormControl>
        <Box>
          <Button type="submit" colorScheme={"blue"} color={"white"}>
            Criar comentário
          </Button>
        </Box>
      </chakra.form>

      <chakra.h1
        maxW='14ch'
        mx='auto'
        fontSize="14px"
        fontFamily='heading'
        letterSpacing='tighter'
        fontWeight='extrabold'
        mb='16px'
        textAlign="center"
        lineHeight='1'
      >
        Comentários
      </chakra.h1>

      <VStack gap={4}>
        {comments.map((comment) => (
          <Card key={comment.id} maxW={450}>
            <CardBody>
              <HStack gap={2}>
                <Icon as={ChatIcon} color='blue.500' />
                <HStack gap={4}>
                  <Text>{comment.content}</Text>

                  {auth.userId === comment.userId ? (
                    <Button px={8} colorScheme='red' size='xs' onClick={() => handleDeleteComment(comment.id)}>Delete</Button>
                  ) : null}
                </HStack>
              </HStack>
            </CardBody>
          </Card>
        ))}
      </VStack>
    </Center>

    <Center minH={"50vh"} flexDirection="column" gap={"4"}>
      <HStack mt={16} gap={2}>
        <Button variant='ghost' color={"black"}>
          <Link href="/">Voltar para home</Link>
        </Button>
      </HStack>
    </Center>
  </>
  );
};

export default Comments;
