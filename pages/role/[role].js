import { useRouter } from 'next/router'

import { useTracks } from '../../hooks/use-tracks'
import  SnowflakeApp from '../../components/SnowflakeApp'

export async function getServerSideProps(content) {
  const {role} = content.query;
  return {props: {role}}
}
  
const Role = (props) => {
  const { error, tracks } = useTracks(props.role)

  if (error) return <div>failed to load</div>
  if (!tracks) return <div>loading...</div>
    
  return <div><SnowflakeApp tracks={tracks} /></div>
}

export default Role
