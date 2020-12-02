import { Flex, IconButton } from '@chakra-ui/core';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import React from 'react'
import { GetAllPlansQuery } from '../generated/graphql';

interface UpdootSectionProps {
  plan: GetAllPlansQuery['getAllPlans']['plans'][0]
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({plan}) => {
    return (

      <Flex direction="column" justifyContent="center" alignItems="center" mr={4}>
        <IconButton
          aria-label="updoot plan"
          onClick={() => console.log("fsd")}
          icon={<ChevronUpIcon />}
        />
        {plan.voteUp}
        <IconButton
          aria-label="downdoot plan"
          onClick={() => console.log("fsd")}
          name="chevron-down"
          icon={<ChevronDownIcon />}
        />
    </Flex>
    );
}