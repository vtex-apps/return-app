declare module 'vtex.render-runtime' {
  import type { ComponentType, ReactElement, ReactType } from 'react'

  export interface NavigationOptions {
    page: string
    params?: unknown
  }

  export interface RenderContextProps {
    runtime: {
      navigate: (options: NavigationOptions) => void
    }
  }

  interface ExtensionPointProps {
    id: string

    [key: string]: any
  }

  interface ChildBlock<BlockProps> {
    props: BlockProps
  }

  export const ExtensionPoint: ComponentType<ExtensionPointProps>
  export const useChildBlock: <BlockProps>({
    id,
  }: {
    id: string
  }) => ChildBlock<BlockProps> | null
  export const Helmet: ReactElement
  export const Link: ReactType
  export const NoSSR: ReactElement
  export const RenderContextConsumer: unknown
  export const TreePathContextConsumer: unknown
  export const useTreePath: unknown
  export const useRuntime: unknown
  export const canUseDOM: boolean
  export const withRuntimeContext: <
    TOriginalProps extends Record<string, unknown>
  >(
    Component: ComponentType<TOriginalProps & RenderContextProps>
  ) => ComponentType<TOriginalProps>

  export const withSession: <TOriginalProps extends Record<string, unknown>>(
    Component: ComponentType<TOriginalProps & RenderContextProps>
  ) => ComponentType<TOriginalProps>

  interface KeyValue {
    value: string
  }

  interface Session {
    id: string
    namespaces: {
      store: {
        channel: KeyValue
      }
      profile: {
        isAuthenticated: KeyValue
        email: string
      }
    }
  }

  interface SessionUnauthorized {
    type: 'Unauthorized'
    message: string
  }

  interface SessionForbidden {
    type: 'Forbidden'
    message: string
  }

  type SessionResponse = Session | SessionUnauthorized | SessionForbidden

  export interface RenderSession {
    sessionPromise: Promise<SessionPromise>
  }

  export interface SessionPromise {
    response: Session | SessionUnauthorized | SessionForbidden
  }

  export function useRuntime()
}
