import { ThemeProvider, CSSReset, ColorModeProvider } from "@chakra-ui/core";
import { Provider, createClient, dedupExchange, fetchExchange } from "urql";
import {
  cacheExchange,
  Cache,
  QueryInput,
} from "@urql/exchange-graphcache";
import theme from "../theme";
import {
  LoginMeDocument,
  LoginMutation,
  LoginMeQuery,
  LogoutUserMutation,
  RegisterUserMutation,
} from "../generated/graphql";

function betterUpdateQuery<Result, Query>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fn: (r: Result, q: Query) => Query
) {
  return cache.updateQuery(qi, data => fn(result, data as any) as any);
}
const client = createClient({
  url: "http://localhost:4000/graphql",
  fetchOptions: {
    credentials: "include"
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
          logoutUser: (_result, args, cache, info) => { // same name with resolver
            betterUpdateQuery<LogoutUserMutation, LoginMeQuery>(
              cache,
              { query: LoginMeDocument },
              _result,
              () => ({ loginMe: null })
            )
          },
          login: (_result, args, cache, info) => {
            betterUpdateQuery<LoginMutation, LoginMeQuery>(
              cache,
              { query: LoginMeDocument },
              _result,
              (result, query) => {
                if(result.login.error) {
                  return query
                }
                else {
                  return {
                    loginMe: result.login.user
                  }
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
                if(result.registerUser.error) {
                  return query
                }
                else {
                  return {
                    loginMe: result.registerUser.user
                  }
                }
              }
            );
          }
        }
      }
    }),
    fetchExchange
  ]
});
function MyApp({ Component, pageProps }: any) {
  return (
    <Provider value={client}>
      <ThemeProvider theme={theme}>
        <ColorModeProvider
          options={{
            useSystemColorMode: true
          }}
        >
          <CSSReset />
          <Component {...pageProps} />
        </ColorModeProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default MyApp;
