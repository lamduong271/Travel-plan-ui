import { dedupExchange, fetchExchange, stringifyVariables } from "urql";
import { cacheExchange, Resolver } from '@urql/exchange-graphcache'
import {
  LogoutUserMutation,
  LoginMeQuery,
  LoginMeDocument,
  LoginMutation,
  RegisterUserMutation
} from "../generated/graphql";
import { betterUpdateQuery } from "./betterUpdateQuery";

import { pipe, tap } from 'wonka';
import { Exchange } from 'urql';
import router from "next/router";

const cursorPagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;
    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }
    const results: string[] = []
    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    const isItInTheCache = cache.resolve(
      cache.resolveFieldByKey(entityKey, fieldKey) as string,
      "getAllPlans"
    );
    info.partial = !isItInTheCache
    console.log("isItInTheCache ", isItInTheCache)
    let hasMore = true
    fieldInfos.forEach((fieldInfo) => {
      const key = cache.resolveFieldByKey(entityKey, fieldInfo.fieldKey) as string
      const plans = cache.resolve(key, 'plans') as string[]
      console.log("plans ###", plans)
      const _hasMore = cache.resolve(key, 'hasMore')
      if(!_hasMore) {
        hasMore = _hasMore as boolean
      }
      results.push(...plans)
    })
    return {
      __typename: 'PaginatedPlans',
      hasMore: hasMore,
      plans: results
    };
  };
};

export const errorExchange: Exchange = ({ forward }) => ops$ => {
  return pipe(
    forward(ops$),
    tap(({ error }) => {
      // If the OperationResult has an error send a request to sentry
      if (error) {
        // the error is a CombinedError with networkError and graphqlErrors properties
        if(error?.message.includes('authenticated')) {  // Whatever error reporting you have
          router.replace("/login")
        }
      }
    })
  );
};

export const createUrqlClient = (ssrExchange: any) => ({
  url: "http://localhost:4000/graphql",
  fetchOptions: {
    credentials: "include" as const
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      keys: {
        PaginatedPlans: () => null
      },
      resolvers: {
        Query: {
          getAllPlans: cursorPagination(),
        }
      },
      updates: {
        Mutation: {
          logoutUser: (_result, args, cache, info) => {
            // same name with resolver
            betterUpdateQuery<LogoutUserMutation, LoginMeQuery>(
              cache,
              { query: LoginMeDocument },
              _result,
              () => ({ loginMe: null })
            );
          },
          login: (_result, args, cache, info) => {
            betterUpdateQuery<LoginMutation, LoginMeQuery>(
              cache,
              { query: LoginMeDocument },
              _result,
              (result, query) => {
                if (result.login.errors) {
                  return query;
                } else {
                  return {
                    loginMe: result.login.user
                  };
                }
              }
            );
          },
          registerUser: (_result, args, cache, info) => {
            betterUpdateQuery<RegisterUserMutation, LoginMeQuery>(
              cache,
              { query: LoginMeDocument },
              _result,
              (result, query) => {
                if (result.registerUser.errors) {
                  return query;
                } else {
                  return {
                    loginMe: result.registerUser.user
                  };
                }
              }
            );
          }
        }
      }
    }),
    errorExchange,
    ssrExchange,
    fetchExchange
  ]
});
