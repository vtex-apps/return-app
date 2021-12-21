import axios from 'axios'
import { useRuntime } from 'vtex.render-runtime'
import { useEffect } from 'react'

const DEFAULT_VTEX_IO_ENVIRONMENT = '.myvtex.com/'
const DEFAULT_VTEX_ENVIRONMENT = '.vtexcommercestable.com.br/'

export default function useAxiosInstance() {
  const { binding, production: isProduction, account } = useRuntime()

  useEffect(() => {
    let isVtexAccountProd = false

    if (`${window?.location?.href}`.includes(DEFAULT_VTEX_IO_ENVIRONMENT)) {
      isVtexAccountProd = true
    }

    if (isProduction && !isVtexAccountProd) {
      const hasDefaultBindingAddress =
        binding?.canonicalBaseAddress ===
          `${account}` + `${DEFAULT_VTEX_ENVIRONMENT}` ||
        binding?.canonicalBaseAddress ===
          `${account}` + `${DEFAULT_VTEX_IO_ENVIRONMENT}`

      if (!hasDefaultBindingAddress && binding?.canonicalBaseAddress) {
        axios.defaults.baseURL = `${window?.location?.protocol}//${binding?.canonicalBaseAddress}`
      }
    }
  }, [isProduction, binding, account])

  return axios
}
