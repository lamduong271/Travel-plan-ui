import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
  __typename?: 'Query';
  hello: Scalars['String'];
  getAllPlans: Array<Plan>;
  getPlanById: Plan;
  loginMe?: Maybe<User>;
};


export type QueryGetPlanByIdArgs = {
  plan_id: Scalars['Int'];
};

export type Plan = {
  __typename?: 'Plan';
  plan_id: Scalars['Int'];
  destination: Scalars['String'];
  numberOfDay: Scalars['String'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['Float'];
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  username: Scalars['String'];
  password: Scalars['String'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createPlan: Plan;
  updatePlan?: Maybe<Plan>;
  deletePlan: Scalars['Boolean'];
  registerUser: UserResponse;
  login: UserResponse;
};


export type MutationCreatePlanArgs = {
  numberOfDay: Scalars['Int'];
  destination: Scalars['String'];
};


export type MutationUpdatePlanArgs = {
  numberOfDay?: Maybe<Scalars['Int']>;
  destination?: Maybe<Scalars['String']>;
  plan_id: Scalars['Int'];
};


export type MutationDeletePlanArgs = {
  plan_id: Scalars['Int'];
};


export type MutationRegisterUserArgs = {
  data: UsernamePasswordInput;
};


export type MutationLoginArgs = {
  data: LoginInput;
};

export type UsernamePasswordInput = {
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  username: Scalars['String'];
  password: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  error?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type LoginInput = {
  username: Scalars['String'];
  password: Scalars['String'];
};

export type LoginMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'UserResponse' }
    & { error?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'field' | 'message'>
    )>>, user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'username' | 'id' | 'password'>
    )> }
  ) }
);

export type RegisterMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { registerUser: (
    { __typename?: 'UserResponse' }
    & { error?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'field' | 'message'>
    )>>, user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'username' | 'id' | 'password'>
    )> }
  ) }
);

export type LoginMeQueryVariables = Exact<{ [key: string]: never; }>;


export type LoginMeQuery = (
  { __typename?: 'Query' }
  & { loginMe?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'username' | 'id'>
  )> }
);


export const LoginDocument = gql`
    mutation Login($username: String!, $password: String!) {
  login(data: {username: $username, password: $password}) {
    error {
      field
      message
    }
    user {
      username
      id
      password
    }
  }
}
    `;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const RegisterDocument = gql`
    mutation Register($username: String!, $password: String!) {
  registerUser(data: {username: $username, password: $password}) {
    error {
      field
      message
    }
    user {
      username
      id
      password
    }
  }
}
    `;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const LoginMeDocument = gql`
    query loginMe {
  loginMe {
    username
    id
  }
}
    `;

export function useLoginMeQuery(options: Omit<Urql.UseQueryArgs<LoginMeQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<LoginMeQuery>({ query: LoginMeDocument, ...options });
};