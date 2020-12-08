import { Flex, IconButton } from '@chakra-ui/core';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import React from 'react'
import { GetAllPlansQuery, useVoteMutation } from '../generated/graphql';

interface UpdootSectionProps {
  plan: GetAllPlansQuery['getAllPlans']['plans'][0]
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({plan}) => {
    const [ vote] = useVoteMutation()
    return (
      <Flex direction="column" justifyContent="center" alignItems="center" mr={4}>
        <IconButton
          aria-label="updoot plan"
          onClick={() => vote({
            variables: {
              planId: plan.id,
              value: 1,
            }
          })}
          icon={<ChevronUpIcon />}
        />
        {plan.voteUp}
        <IconButton
          aria-label="downdoot plan"
          onClick={() => vote({
            variables: {
              planId: plan.id,
              value: -1,
            }
          })}
          name="chevron-down"
          icon={<ChevronDownIcon />}
        />
        vote status: {plan.voteStatus === 1 ? 'voted' : 'not'}
    </Flex>
    );
}