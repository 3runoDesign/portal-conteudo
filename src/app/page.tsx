'use client';

import {
  Box,
  Button,
  Center,
  Circle,
  Flex,
  FlexProps,
  Grid,
  HStack,
  VStack,
  Heading,
  Icon,
  Link,
  SimpleGrid,
  Stack,
  Text,
  Wrap,
  WrapItem,
  StackDivider,
  chakra,
  Card,
  CardBody,
  CardFooter,
  Divider,
  ButtonGroup,
} from '@chakra-ui/react'
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons'
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '~/lib/store';
import { Post } from '~/types';
import { useInView } from 'react-intersection-observer'
import { useRouter } from 'next/navigation';
import Container from '~/common/components/container';
import Header from '~/common/components/header';

const Home = () => {
  const token = useAppSelector((state) => state.auth.token);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isDescending, setIsDescending] = useState(true);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView()

  const sortedPosts = [...posts].sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return isDescending ? dateB - dateA : dateA - dateB;
  });

  const router = useRouter();

  const toggleOrder = () => {
    setIsDescending(!isDescending);
  };

  const fetchPosts = async (page: number) => {
    console.log("opa 2", { loading, hasMore })
    if (loading) return;

    setLoading(true);
    const response = await fetch(`/api/posts?offset=${page * 2}&limit=10`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data: Post[] = await response.json();

    if (data.length === 0) {
      setHasMore(false);
    } else {
      setPosts((prevPosts) => {
        // Remove duplicatas antes de adicionar novos posts
        const newPosts = data.filter(
          (newPost: Post) => !prevPosts.some((prevPost: Post) => prevPost.id === newPost.id)
        );
        return [...prevPosts, ...newPosts];
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  useEffect(() => {
    if (inView) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [inView])

  return (
    <>
      <Header />
      <Box mb={20}>
        <Box as='section' pt='6rem' pb={{ base: '0', md: '2rem' }}>
          <Container>
            <Box textAlign='center'>
              <chakra.h1
                maxW='14ch'
                mx='auto'
                fontSize={{ base: '2.25rem', sm: '3rem', lg: '4rem' }}
                fontFamily='heading'
                letterSpacing='tighter'
                fontWeight='extrabold'
                mb='16px'
                lineHeight='1.2'
              >
                Seu portal de
                <chakra.span color='blue.500' _dark={{ color: 'blue.300' }}>
                  {' '}
                  conteúdo
                </chakra.span>
              </chakra.h1>
            </Box>
          </Container>
        </Box>
      </Box>

      <Box>
        <Box as='section'>
          <Container>
            <Box as='section'>
              <Container>
                <Box mb="20px">
                <Button leftIcon={
                  isDescending ? 
                  <TriangleUpIcon />
                  :
                  <TriangleDownIcon />
                  } colorScheme='pink' variant='solid' onClick={toggleOrder}>
                  {isDescending ? 'Sort Ascending' : 'Sort Descending'}
                  </Button>
                </Box>

                {
                  sortedPosts.length > 0 ? (
                    <>
                      <VStack
                        divider={<StackDivider borderColor='gray.200' />}
                        spacing={4}
                        align='stretch'
                      >
                        {
                          sortedPosts.map((post) => (
                            <Card key={post.id}>
                              <CardBody>
                                <Stack mt='6' spacing='3'>
                                  <Heading size='md'>{post.title}</Heading>
                                  <Text>
                                    {post.content}
                                  </Text>
                                </Stack>
                              </CardBody>
                              <StackDivider borderColor='gray.200' />
                              <CardFooter>
                                <ButtonGroup spacing='2'>
                                  <Button variant='solid' colorScheme='blue' onClick={() => router.push(`/comments/${post.id}`)}>
                                    Add comment
                                  </Button>
                                </ButtonGroup>
                              </CardFooter>
                            </Card>
                          ))
                        }
                      </VStack>

                      <Box mt="20px" textAlign='center' ref={ref}>
                        Loading...
                      </Box>
                    </>
                  ) : (<>

                    <Box textAlign='center'>
                      <chakra.h1
                        maxW='14ch'
                        mx='auto'
                        fontSize="1rem"
                        fontFamily='heading'
                        letterSpacing='tighter'
                        fontWeight='extrabold'
                        mb='4px'
                        lineHeight='1'
                      >
                        não tem post, seja o
                        <chakra.span color='blue.500' _dark={{ color: 'blue.300' }}>
                          {' '}
                          primeiro
                        </chakra.span>
                      </chakra.h1>

                      <Button
                        mt="30px"
                        h='3rem'
                        px='40px'
                        fontSize='1rem'
                        size='sm'
                        variant='solid'
                        colorScheme="green"
                      >
                        <Link href="/posts">
                          criar post
                        </Link>
                      </Button>
                    </Box>

                  </>)
                }
              </Container>
            </Box>
          </Container>
        </Box>
      </Box>
    </>
  );
};

export default Home;

