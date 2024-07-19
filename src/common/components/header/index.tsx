import {
    Button,
    Flex,
    HStack,
    HTMLChakraProps,
    IconButton,
    Link,
    chakra,
} from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
import NextLink from 'next/link'
import { useAppDispatch, useAppSelector } from '~/lib/store'
import { clearToken } from '~/lib/slices/authSlice';
import { useRouter } from 'next/navigation';

function HeaderContent() {
    const token = useAppSelector((state) => state.auth.token);
    const dispatch = useAppDispatch();
    const router = useRouter()

    const handleLogout = () => {
        dispatch(clearToken());

        router.refresh();
    };

    return (
        <>
            <Flex w='100%' h='100%' px='6' align='center' justify='space-between'>
                <Flex align='center'>
                    <NextLink href='/'>
                        Portal
                    </NextLink>
                </Flex>

                <Flex
                    justify='flex-end'
                    w='100%'
                    align='center'
                    color='gray.400'
                    maxW='1100px'
                >
                    <HStack gap='5' display="flex">

                        {
                            token ?
                                <HStack gap={4}>
                                    <Button
                                        px='40px'
                                        fontSize='16px'
                                        variant='solid'
                                        colorScheme="green"
                                    >
                                        <Link href="/posts">
                                            criar post
                                        </Link>
                                    </Button>

                                    <Button
                                        px='40px'
                                        fontSize='16px'
                                        variant='ghost'
                                        color={"black"}
                                        onClick={handleLogout}
                                    >
                                        logout
                                    </Button>
                                </HStack>
                                :
                                <HStack gap={4}>
                                    <Button
                                        px='40px'
                                        fontSize='16px'
                                        variant='solid'
                                        colorScheme="blue"
                                    >
                                        <Link href="/login">
                                            login
                                        </Link>
                                    </Button>
                                    <Button
                                        px='40px'
                                        fontSize='16px'
                                        variant='solid'
                                        colorScheme="green"
                                    >
                                        <Link href="/register">
                                            criar conta
                                        </Link>
                                    </Button>
                                </HStack>
                        }



                    </HStack>
                    <HStack gap='5'>
                        <IconButton
                            size='md'
                            aria-label='toggle color mode'
                            variant='ghost'
                            color='current'
                            ml={{ base: '0', md: '3' }}
                        >
                        </IconButton>
                    </HStack>
                </Flex>
            </Flex>
        </>
    )
}

function Header(props: HTMLChakraProps<'header'>) {
    const { maxW = '8xl', maxWidth = '8xl' } = props
    const ref = useRef<HTMLHeadingElement>()

    return (
        <chakra.header
            ref={ref}
            bg='bg'
            width='full'
            {...props}
        >
            <chakra.div height='4.5rem' mx='auto' maxW={maxW} maxWidth={maxWidth}>
                <HeaderContent />
            </chakra.div>
        </chakra.header>
    )
}

export default Header