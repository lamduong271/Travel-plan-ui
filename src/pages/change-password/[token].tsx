import { Button } from '@chakra-ui/core';
import { Formik, Form } from 'formik';
import { NextPage } from 'next';
import router from 'next/dist/next-server/lib/router/router';
import React from 'react'
import { InputField } from '../../components/InputField';
import { Wrapper } from '../../components/Wrapper';
import { toErrorMap } from '../../untils/toErrorMap';
import login from '../login';


const ChangePassword: NextPage<{token: string}> = ({token}) => {
    return (
      <Wrapper>
      <Formik
        initialValues={{ newPassword: '' }}
        onSubmit={async (values, { setErrors }) => {
          // const response = await login(values)
          // if(response.data?.login.errors) {
          //   setErrors(toErrorMap(response.data.login.errors))
          // } else if(response.data?.login.user) {
          //   router.push('/')
          // }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="newPassword"
              placeholder="newPassword"
              label="New password"
            />
            <Button
              type="submit"
              mt={4}
              colorScheme="teal"
              isLoading={isSubmitting}
            >
              Change password
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
    );
}

ChangePassword.getInitialProps = ({query}) => {
  return {
    token: query.token as string
  }
}

export default ChangePassword