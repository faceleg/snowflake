import { useRouter } from 'next/router'

import { useTracks } from '../../hooks/use-tracks'
import SnowflakeApp from '../../components/SnowflakeApp'

export async function getServerSideProps (content) {
  const { role } = content.query
  return { props: { role } }
}

const Role = (props) => {
  const { error, tracks, pointsToLevels, titles, maxLevel } = useTracks(props.role)

  console.log({ error, tracks, titles, maxLevel, pointsToLevels })

  if (error) return <div>failed to load: {JSON.stringify(error, null, 2)}</div>
  if (!tracks || !titles || !maxLevel || !pointsToLevels) return <div>loading...</div>

  return <div><SnowflakeApp tracks={tracks} titles={titles} maxLevel={maxLevel} pointsToLevels={pointsToLevels}/></div>
}

export default Role
