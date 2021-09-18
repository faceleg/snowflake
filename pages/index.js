import useSWR from 'swr'
import axios from 'axios'

import SnowflakeApp from '../components/SnowflakeApp'

      const Page = () => {
        const { data, error } = useSWR('/static/tracks.json', axios)
        if (error) return <div>failed to load</div>
        if (!data) return <div>loading...</div>
        return <div><SnowflakeApp tracks={data.data} /></div>
      }
      

export default Page
