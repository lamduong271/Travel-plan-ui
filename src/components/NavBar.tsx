import React from "react";
import { Box, Link, Flex, Heading, Button } from "@chakra-ui/core";
import NextLink from "next/link";
import { useLoginMeQuery } from "../generated/graphql";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ data, fetching }] = useLoginMeQuery();
  let body = null;
  if (fetching) {
  } else if (!data?.loginMe) {
    body = (
      <>
        <NextLink href="/login">
          <Link mr={2}>login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link>register</Link>
        </NextLink>
      </>
    );
  } else {
    body = (
      <Flex align="center">
        <Box mr={2}>{data.loginMe.username}</Box>
        <Button
          variant="link"
        >
          logout
        </Button>
      </Flex>
    )
  }

  return (
    <Flex zIndex={1} position="sticky" top={0} bg="tan" p={4}>
      <Flex flex={1} m="auto" align="center" maxW={800}>
        <NextLink href="/">
          <Link>
            <Heading>Plan app</Heading>
          </Link>
        </NextLink>
        <Box ml={"auto"}>{body}</Box>
      </Flex>
    </Flex>
  );
};
