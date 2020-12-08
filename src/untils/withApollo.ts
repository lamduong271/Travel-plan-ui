import { ApolloClient, InMemoryCache } from "@apollo/client";
import { withApollo as createWithApollo } from "next-apollo";
import { PaginatedPlans } from "../generated/graphql";

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_API_URL as string,
  credentials: "include",
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getAllPlans: {
            keyArgs: [],
            merge(
              existing: PaginatedPlans | undefined,
              incoming: PaginatedPlans
            ): PaginatedPlans {
              return {
                ...incoming,
                plans: [...(existing?.plans || []), ...incoming.plans] // incase there is nothing in the cache
              };
            }
          }
        }
      }
    }
  })
});

export const withApollo = createWithApollo(client);