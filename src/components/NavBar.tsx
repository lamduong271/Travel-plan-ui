import React from "react";
import { Box, Link, Flex, Heading, Button } from "@chakra-ui/core";
import NextLink from "next/link";
import { useLoginMeQuery, useLogoutUserMutation } from "../generated/graphql";
import { isServer } from "../untils/isServer";
import { useApolloClient } from "@apollo/client";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const { data, loading } = useLoginMeQuery({
    skip: isServer(),
  });
  const [logout, { loading: logoutFetching}] = useLogoutUserMutation();
  let body = null;
  const apolloClient = useApolloClient();
  if (loading) {
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
          onClick={async () =>{
            await logout();
            await apolloClient.resetStore()} }
          isLoading={logoutFetching}
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
