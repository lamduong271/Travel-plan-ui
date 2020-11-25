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
  getAllPlans: PaginatedPlans;
  getPlanById: Plan;
  loginMe?: Maybe<User>;
};


export type QueryGetAllPlansArgs = {
  cursor?: Maybe<Scalars['String']>;
  limit: Scalars['Int'];
};


export type QueryGetPlanByIdArgs = {
  id: Scalars['Int'];
};

export type PaginatedPlans = {
  __typename?: 'PaginatedPlans';
  plans: Array<Plan>;
  hasMore: Scalars['Boolean'];
};

export type Plan = {
  __typename?: 'Plan';
  id: Scalars['Int'];
  destination: Scalars['String'];
  numberOfDay: Scalars['Float'];
  voteUp: Scalars['Float'];
  voteDown: Scalars['Float'];
  plannerId: Scalars['Float'];
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
  email: Scalars['String'];
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
  logoutUser: Scalars['Boolean'];
  forgotPassword: Scalars['Boolean'];
  changePassword: UserResponse;
};


export type MutationCreatePlanArgs = {
  inputPlan: PlanInputType;
};


export type MutationUpdatePlanArgs = {
  numberOfDay?: Maybe<Scalars['Int']>;
  destination?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};


export type MutationDeletePlanArgs = {
  id: Scalars['Int'];
};


export type MutationRegisterUserArgs = {
  data: UsernamePasswordInput;
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  usernameOrEmail: Scalars['String'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String'];
  token: Scalars['String'];
};

export type PlanInputType = {
  destination: Scalars['String'];
  numberOfDay: Scalars['Float'];
};

export type UsernamePasswordInput = {
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  username: Scalars['String'];
  password: Scalars['String'];
  email: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type RegularErrorFragment = (
  { __typename?: 'FieldError' }
  & Pick<FieldError, 'field' | 'message'>
);

export type RegularUserFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'username'>
);

export type RegularUserResponseFragment = (
  { __typename?: 'UserResponse' }
  & { errors?: Maybe<Array<(
    { __typename?: 'FieldError' }
    & RegularErrorFragment
  )>>, user?: Maybe<(
    { __typename?: 'User' }
    & RegularUserFragment
  )> }
);

export type ChangePasswordMutationVariables = Exact<{
  newPassword: Scalars['String'];
  token: Scalars['String'];
}>;


export type ChangePasswordMutation = (
  { __typename?: 'Mutation' }
  & { changePassword: (
    { __typename?: 'UserResponse' }
    & RegularUserResponseFragment
  ) }
);

export type CreatePlanMutationVariables = Exact<{
  inputPlan: PlanInputType;
}>;


export type CreatePlanMutation = (
  { __typename?: 'Mutation' }
  & { createPlan: (
    { __typename?: 'Plan' }
    & Pick<Plan, 'id' | 'destination' | 'numberOfDay' | 'plannerId' | 'voteUp' | 'voteDown'>
  ) }
);

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'forgotPassword'>
);

export type LoginMutationVariables = Exact<{
  usernameOrEmail: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'UserResponse' }
    & RegularUserResponseFragment
  ) }
);

export type LogoutUserMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutUserMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logoutUser'>
);

export type RegisterUserMutationVariables = Exact<{
  data: UsernamePasswordInput;
}>;


export type RegisterUserMutation = (
  { __typename?: 'Mutation' }
  & { registerUser: (
    { __typename?: 'UserResponse' }
    & RegularUserResponseFragment
  ) }
);

export type GetAllPlansQueryVariables = Exact<{
  limit: Scalars['Int'];
  cursor?: Maybe<Scalars['String']>;
}>;


export type GetAllPlansQuery = (
  { __typename?: 'Query' }
  & { getAllPlans: (
    { __typename?: 'PaginatedPlans' }
    & Pick<PaginatedPlans, 'hasMore'>
    & { plans: Array<(
      { __typename?: 'Plan' }
      & Pick<Plan, 'createdAt' | 'id' | 'destination' | 'numberOfDay'>
    )> }
  ) }
);

export type LoginMeQueryVariables = Exact<{ [key: string]: never; }>;


export type LoginMeQuery = (
  { __typename?: 'Query' }
  & { loginMe?: Maybe<(
    { __typename?: 'User' }
    & RegularUserFragment
  )> }
);

export const RegularErrorFragmentDoc = gql`
    fragment RegularError on FieldError {
  field
  message
}
    `;
export const RegularUserFragmentDoc = gql`
    fragment RegularUser on User {
  id
  username
}
    `;
export const RegularUserResponseFragmentDoc = gql`
    fragment RegularUserResponse on UserResponse {
  errors {
    ...RegularError
  }
  user {
    ...RegularUser
  }
}
    ${RegularErrorFragmentDoc}
${RegularUserFragmentDoc}`;
export const ChangePasswordDocument = gql`
    mutation changePassword($newPassword: String!, $token: String!) {
  changePassword(newPassword: $newPassword, token: $token) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

export function useChangePasswordMutation() {
  return Urql.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument);
};
export const CreatePlanDocument = gql`
    mutation createPlan($inputPlan: PlanInputType!) {
  createPlan(inputPlan: $inputPlan) {
    id
    destination
    numberOfDay
    plannerId
    voteUp
    voteDown
  }
}
    `;

export function useCreatePlanMutation() {
  return Urql.useMutation<CreatePlanMutation, CreatePlanMutationVariables>(CreatePlanDocument);
};
export const ForgotPasswordDocument = gql`
    mutation forgotPassword($email: String!) {
  forgotPassword(email: $email)
}
    `;

export function useForgotPasswordMutation() {
  return Urql.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument);
};
export const LoginDocument = gql`
    mutation login($usernameOrEmail: String!, $password: String!) {
  login(usernameOrEmail: $usernameOrEmail, password: $password) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutUserDocument = gql`
    mutation logoutUser {
  logoutUser
}
    `;

export function useLogoutUserMutation() {
  return Urql.useMutation<LogoutUserMutation, LogoutUserMutationVariables>(LogoutUserDocument);
};
export const RegisterUserDocument = gql`
    mutation registerUser($data: UsernamePasswordInput!) {
  registerUser(data: $data) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

export function useRegisterUserMutation() {
  return Urql.useMutation<RegisterUserMutation, RegisterUserMutationVariables>(RegisterUserDocument);
};
export const GetAllPlansDocument = gql`
    query getAllPlans($limit: Int!, $cursor: String) {
  getAllPlans(limit: $limit, cursor: $cursor) {
    hasMore
    plans {
      createdAt
      id
      destination
      numberOfDay
    }
  }
}
    `;

export function useGetAllPlansQuery(options: Omit<Urql.UseQueryArgs<GetAllPlansQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllPlansQuery>({ query: GetAllPlansDocument, ...options });
};
export const LoginMeDocument = gql`
    query loginMe {
  loginMe {
    ...RegularUser
  }
}
    ${RegularUserFragmentDoc}`;

export function useLoginMeQuery(options: Omit<Urql.UseQueryArgs<LoginMeQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<LoginMeQuery>({ query: LoginMeDocument, ...options });
};