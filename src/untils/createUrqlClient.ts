import { dedupExchange, fetchExchange, stringifyVariables } from "urql";
import { cacheExchange, Resolver } from "@urql/exchange-graphcache";
import {
  LogoutUserMutation,
  LoginMeQuery,
  LoginMeDocument,
  LoginMutation,
  RegisterUserMutation,
  VoteMutationVariables
} from "../generated/graphql";
import { betterUpdateQuery } from "./betterUpdateQuery";
import gql from "graphql-tag";
import { pipe, tap } from "wonka";
import { Exchange } from "urql";
import router from "next/router";
import { isServer } from "./isServer";

const cursorPagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;
    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter(info => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }
    const results: string[] = [];
    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    const isItInTheCache = cache.resolve(
      cache.resolveFieldByKey(entityKey, fieldKey) as string,
      "getAllPlans"
    );
    info.partial = !isItInTheCache;
    let hasMore = true;
    fieldInfos.forEach(fieldInfo => {
      const key = cache.resolveFieldByKey(
        entityKey,
        fieldInfo.fieldKey
      ) as string;
      const plans = cache.resolve(key, "plans") as string[];
      const _hasMore = cache.resolve(key, "hasMore");
      if (!_hasMore) {
        hasMore = _hasMore as boolean;
      }
      results.push(...plans);
    });
    return {
      __typename: "PaginatedPlans",
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
        if (error?.message.includes("authenticated")) {
          // Whatever error reporting you have
          router.replace("/login");
        }
      }
    })
  );
};

export const createUrqlClient = (ssrExchange: any, ctx: any) => {
  if(isServer()) {

    console.log("ctxctxctx ", ctx)
  }
  return {
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
            getAllPlans: cursorPagination()
          }
        },
        updates: {
          Mutation: {
            vote: (_result, args, cache, info) => {
              const { planId, value } = args as VoteMutationVariables;
              const data = cache.readFragment(
                gql`
                  fragment _ on Plan {
                    id
                    value
                  }
                `,
                { id: planId } as any
              );

              if (data) {
                if (data.voteStatus === value) {
                  return;
                }
                const newPoints =
                  (data.points as number) + (!data.voteStatus ? 1 : 2) * value;
                cache.writeFragment(
                  gql`
                    fragment __ on Plan {
                      value
                      voteStatus
                    }
                  `,
                  { id: planId, value: newPoints, voteStatus: value } as any
                );
              }
            },
            // createPlan: (_result, args, cache, info) => {
            //   const allFields = cache.inspectFields('Query');
            //   const fieldInfos = allFields.filter((info) => info.fieldName === 'getAllPlans');
            //   console.log("fieldInfos ", fieldInfos)
            //   fieldInfos.forEach((fi) => {
            //     cache.invalidate("Query", "getAllPlans", fi.arguments || {})
            //   })
            // },
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
  };
};
