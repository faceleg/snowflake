import { useRouter } from 'next/router'
import { useTracks } from '../hooks/use-tracks'

const Role = () => {
  return (
    <div>
    <ul>
      <li>
        <a href="/role/platform-engineer">Platform Engineer</a>
      </li>
      <li>
        <a href="/role/software-engineer">Software Engineer</a>
      </li>
    </ul>
    </div>
  )
}

export default Role