import { useContext } from 'react'

import { ExportContext } from '../provider/ExportProvider'

export const useExportModule = () => useContext(ExportContext)
