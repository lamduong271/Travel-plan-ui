import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../untils/createUrqlClient";
import NextLink from "next/link";
import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Stack
} from "@chakra-ui/core";
import { useGetAllPlansQuery } from "../generated/graphql";
import React, { useState } from "react";
import { Layout } from "../components/Layout";
import { UpdootSection } from "../components/UpdootSection";

const Index = () => {
  const [variables, setVariable] = useState({
    limit: 5,
    cursor: null as null | string
  });
  const [{ data, fetching }] = useGetAllPlansQuery({
    variables
  });
  if (!fetching && !data) {
    return <div> failed query</div>;
  }
  return (
    <Layout>
      <div>Hello</div>
      <NextLink href="/create-plan">
        <Link>create plan</Link>
      </NextLink>

      <div>All plans</div>
      {!data && fetching ? (
        <div>Fetching</div>
      ) : (
        <Stack spacing={8}>
          {data!.getAllPlans?.plans?.map((
            plan // declare that data is defined
          ) => (
            <Flex
              key={plan.id}
              borderWidth="1px"
              shadow="md"
              p={5}
            >
              <UpdootSection plan={plan}/>
              <Box>
                <Heading mb={4}>{plan.destination}</Heading>
                <Box mb={4}>{plan.numberOfDay} days</Box>
                <Box mb={4}>Posted by: {plan.planner.username}</Box>
              </Box>
            </Flex>
          ))}
        </Stack>
      )}
      {data && data.getAllPlans.hasMore ? (
        <Flex>
          <Button
            onClick={() => {
              setVariable({
                limit: variables.limit,
                cursor:
                  data.getAllPlans.plans[data.getAllPlans.plans.length - 1]
                    .createdAt
              });
            }}
            m="auto"
            ny={4}
          >
            Load more
          </Button>
        </Flex>
      ) : null}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(Index);
