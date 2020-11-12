import React from 'react'
import { useRouter } from 'next/router';
import { useLoginMutation } from '../generated/graphql';
import { Wrapper } from '../components/Wrapper';
import { Formik, Form } from 'formik';
import { toErrorMap } from '../untils/toErrorMap';
import { InputField } from '../components/InputField';
import { Button } from '@chakra-ui/core';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../untils/createUrqlClient';

interface loginProps {

}

export const Login: React.FC<loginProps> = ({}) => {
  const router = useRouter()
  const [, login] = useLoginMutation();
  return (
    <Wrapper>
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login(values)
          if(response.data?.login.error) {
            setErrors(toErrorMap(response.data.login.error))
          } else if(response.data?.login.user) {
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
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(Login);