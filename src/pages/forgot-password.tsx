import { Box, Button } from "@chakra-ui/core";
import { Formik, Form } from "formik";
import React, { useState } from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { useForgotPasswordMutation } from "../generated/graphql";
import { withApollo } from "../untils/withApollo";

const forgotPassword: React.FC<{}> = ({}) => {
  const [complete, setComplete] = useState(false);
  const [forgotPassword] = useForgotPasswordMutation();
  return (
    <Wrapper>
      <Formik
        initialValues={{ email: "" }}
        onSubmit={async values => {
          await forgotPassword({variables: { email: values.email }});
          setComplete(true);
        }}
      >
        {({ isSubmitting }) =>
          complete ? (
            <Box>
              If the email exists, we will send the reset link via your email
            </Box>
          ) : (
            <Form>
              <InputField name="email" placeholder="email" label="Email" />
              <Button
                type="submit"
                mt={4}
                colorScheme="teal"
                isLoading={isSubmitting}
              >
                Forgot password
              </Button>
            </Form>
          )
        }
      </Formik>
    </Wrapper>
  );
};

export default withApollo({ ssr: false })(forgotPassword);
