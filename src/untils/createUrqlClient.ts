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
                if (result.login.error) {
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
                if (result.registerUser.error) {
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
    ssrExchange,
    fetchExchange
  ]
});
