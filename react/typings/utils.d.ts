import type { RouteComponentProps } from 'react-router-dom'

export interface HeaderConfig {
  title: string | JSX.Element
  backButton?: string | JSX.Element
  headerContent?: string | JSX.Element
}

export interface Profile {
  Email: string
  FirstName: string | null
  Gender: string | null
  IsReturningUser: boolean
  IsUserDefined: boolean
  LastName: string | null
  UserId: string
}

export interface PageProps extends RouteComponentProps<MatchParams> {
  returnsList: string[]
  profile: Profile
  headerConfig: HeaderConfig
}
