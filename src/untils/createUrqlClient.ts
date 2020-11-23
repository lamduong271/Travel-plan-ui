import { dedupExchange, fetchExchange } from "urql";
import { cacheExchange } from '@urql/exchange-graphcache'
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
