import { useRouter } from "next/router";
import { useEffect } from "react";
import { useLoginMeQuery } from "../generated/graphql";

export const isAuthenticateHandler = () => {
  const router = useRouter();
  const {data, loading} = useLoginMeQuery()
  useEffect(() => {
    if(!loading && !data?.loginMe) {
      router.replace('/login?next=' + router.pathname) //redirect to login page when no user found or loading, and tell after login where to go
    }
  },[loading, data, router])
}