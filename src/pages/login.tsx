import React from 'react'
import { useRouter } from 'next/router';
import { useLoginMutation } from '../generated/graphql';
import { Wrapper } from '../components/Wrapper';
import { Formik, Form } from 'formik';
import { toErrorMap } from '../untils/toErrorMap';
import { InputField } from '../components/InputField';
import { Box, Button, Link } from '@chakra-ui/core';
import NextLink from "next/link";
import { withApollo } from '../untils/withApollo';

interface loginProps {

}

export const Login: React.FC<loginProps> = ({}) => {
  const router = useRouter()
  const [login] = useLoginMutation();
  return (
    <Wrapper>
      <Formik
        initialValues={{ usernameOrEmail: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login({variables: values})
          if(response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors))
          } else if(response.data?.login.user) {
            router.push('/')
            if(typeof router.query.next === 'string') {
              router.push(router.query.next)
            } else {
              router.push("/")
            }
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="usernameOrEmail"
              placeholder="usernameOrEmail"
              label="Username or Email"
            />
            <InputField
              name="password"
              placeholder="password"
              label="Password"
            />
            <Box>
              <NextLink href="/forgot-password">
                <Link>Forgot password?</Link>
              </NextLink>
            </Box>
            <Button
              type="submit"
              mt={4}
              colorScheme="teal"
              isLoading={isSubmitting}
            >
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withApollo({ ssr: false })(Login);