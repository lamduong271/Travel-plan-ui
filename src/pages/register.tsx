import React from "react";
import { Button } from "@chakra-ui/core";
import { Formik, Form } from "formik";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useRouter } from 'next/router'
import { useRegisterUserMutation } from "../generated/graphql";
import { toErrorMap } from "../untils/toErrorMap";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../untils/createUrqlClient";

interface registerProps {}


export const Register: React.FC<registerProps> = ({}) => {
  const router = useRouter()
  const [, register] = useRegisterUserMutation();
  return (
    <Wrapper>
      <Formik
        initialValues={{email: "", username: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await register({data: values})
          if(response.data?.registerUser.errors) {
            setErrors(toErrorMap(response.data.registerUser.errors))
          } else if(response.data?.registerUser.user) {
            router.push('/')
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="username"
              placeholder="username"
              label="Username"
            />
            <InputField
              name="email"
              placeholder="email"
              label="Email"
            />
            <InputField
              name="password"
              placeholder="password"
              label="Password"
            />
            <Button
              type="submit"
              mt={4}
              colorScheme="teal"
              isLoading={isSubmitting}
            >
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(Register);
