import React from 'react'
import {
  Button,
  EXPERIMENTAL_Modal as Modal,
  ButtonWithIcon,
  utils,
  IconDownload,
} from 'vtex.styleguide'

import { ExportProvider } from './provider/ExportProvider'
import Content from './components/Content'
import ReportContainer from './components/ReportContainer'

const ExportModule = () => {
  const { isOpen, onOpen, onClose } = utils.useDisclosure()

  return (
    <>
      <ButtonWithIcon
        icon={<IconDownload />}
        iconPosition="left"
        variation="primary"
        onClick={onOpen}
      >
        EXPORT RETURNS
      </ButtonWithIcon>

      <Modal
        size="large"
        isOpen={isOpen}
        onClose={onClose}
        title="Export module"
        bottomBar={
          <div className="nowrap">
            <Button size="small" variation="tertiary" onClick={onClose}>
              CLOSE
            </Button>
          </div>
        }
      >
        <div className="flex flex-column flex-row-ns">
          <div className="w-100 w-50-ns">
            <Content />
          </div>
          <div className="w-100 w-50-ns pl6-ns">
            <ExportProvider>
              <ReportContainer />
            </ExportProvider>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default ExportModule
