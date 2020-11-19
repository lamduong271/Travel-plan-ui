import { Button } from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import React from 'react'
import { InputField } from '../components/InputField';
import { Wrapper } from '../components/Wrapper';
import { useCreatePlanMutation } from '../generated/graphql';
import { createUrqlClient } from '../untils/createUrqlClient';

interface createPlanProps {

}

const CreatePlan: React.FC<createPlanProps> = ({}) => {
  const [, createPlan] = useCreatePlanMutation()
    return (
      <Wrapper variant='small'>
      <Formik
        initialValues={{ destination: "", numberOfDay: 0 }}
        onSubmit={async (values) => {
          await createPlan(values)
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
export default withUrqlClient(createUrqlClient)(CreatePlan)