import { NavBar } from '../components/NavBar'
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../untils/createUrqlClient';
import NextLink from 'next/link'
import { Link } from '@chakra-ui/core'

const Index = () => (
  <>
  <NavBar/>
 <div>Hello</div>
 <NextLink href='/create-plan'>
    <Link >
        create plan
    </Link>
 </NextLink>
 </>
)

export default withUrqlClient(createUrqlClient)(Index)
