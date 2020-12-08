import NextLink from "next/link";
import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Stack
} from "@chakra-ui/core";
import { GetAllPlansQuery, useGetAllPlansQuery } from "../generated/graphql";
import React from "react";
import { Layout } from "../components/Layout";
import { UpdootSection } from "../components/UpdootSection";
import { withApollo } from "../untils/withApollo";

const Index = () => {
  const { data, loading, fetchMore, variables } = useGetAllPlansQuery({ // from apolo client
    variables: {
      limit: 5,
      cursor: null as null | string
    },
    notifyOnNetworkStatusChange: true,
  });
  if (!loading && !data) {
    return <div> failed query</div>;
  }
  return (
    <Layout>
      <div>Hello</div>
      <NextLink href="/create-plan">
        <Link>create plan</Link>
      </NextLink>

      <div>All plans</div>
      {!data && loading ? (
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
              fetchMore({
                variables: {
                  limit: variables?.limit,
                  cursor: data.getAllPlans.plans[data.getAllPlans.plans.length - 1].createdAt
                },
                // updateQuery: (previousValue, { fetchMoreResult}): GetAllPlansQuery => {
                //   if (!fetchMoreResult) {
                //     return previousValue as GetAllPlansQuery
                //   }
                //   return {
                //     __typename: 'Query',
                //     getAllPlans: {
                //       __typename: 'PaginatedPlans',
                //       hasMore: (fetchMoreResult as GetAllPlansQuery).getAllPlans.hasMore,
                //       plans: [
                //         ...(previousValue as GetAllPlansQuery).getAllPlans.plans,
                //         ...(fetchMoreResult as GetAllPlansQuery).getAllPlans.plans,
                //       ]
                //     }
                //   }
                // }
              })
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

export default withApollo({ssr: true})(Index);
