import React from 'react'
import {
  Button,
  EXPERIMENTAL_Modal as Modal,
  ButtonWithIcon,
  utils,
  IconDownload,
} from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'

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
        <FormattedMessage id="admin/return-app.export-module.modal-open" />
      </ButtonWithIcon>

      <Modal
        size="large"
        isOpen={isOpen}
        onClose={onClose}
        title={
          <FormattedMessage id="admin/return-app.export-module.modal-title" />
        }
        bottomBar={
          <div className="nowrap">
            <Button size="small" variation="tertiary" onClick={onClose}>
              <FormattedMessage id="admin/return-app.export-module.modal-close" />
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
