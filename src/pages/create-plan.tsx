import { Button } from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import { InputField } from '../components/InputField';
import { Wrapper } from '../components/Wrapper';
import { useCreatePlanMutation } from '../generated/graphql';
import { createUrqlClient } from '../untils/createUrqlClient';
import { isAuthenticateHandler } from '../untils/isAuthenticateHandler';
import { withApollo } from '../untils/withApollo';

interface createPlanProps {

}

const CreatePlan: React.FC<createPlanProps> = ({}) => {
  const router = useRouter();
  isAuthenticateHandler()
  const [createPlan] = useCreatePlanMutation()
    return (
      <Wrapper variant='small'>
      <Formik
        initialValues={{ destination: "", numberOfDay: 0 }}
        onSubmit={async (values) => {
          const { errors } = await createPlan({variables: {inputPlan: values}})
           if(!errors) {
            router.push('/')
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="destination"
              placeholder="Destination"
              label="Destination"
            />
            <InputField
              name="numberOfDay"
              placeholder="Number of day"
              label="Number of day"
              type="number"
            />
            <Button
              type="submit"
              mt={4}
              colorScheme="teal"
              isLoading={isSubmitting}
            >
              Submit plan
            </Button>
          </Form>
        )}
      </Formik>
      </Wrapper>
    );
}
export default withApollo({ ssr: false })(CreatePlan)