import type { ReactElement } from 'react'
import React from 'react'
import { FormattedMessage } from 'react-intl'

import { SUPPORTED_REPORT_FORMATS } from '../../../common/constants/returnsRequest'

const Content = () => {
  return (
    <>
      <p className="mt3">
        <FormattedMessage
          id="admin/return-app.export-module.content.first-paragraph"
          values={{
            // eslint-disable-next-line react/display-name
            b: (chunks: ReactElement) => <b>{chunks}</b>,
          }}
        />
      </p>
      <p className="mt3">
        <FormattedMessage
          id="admin/return-app.export-module.content.second-paragraph"
          values={{
            // eslint-disable-next-line react/display-name
            b: (chunks: ReactElement) => <b>{chunks}</b>,
          }}
        />
      </p>
      <div
        style={{
          backgroundColor: '#fff6e0',
          borderRadius: '4px',
          border: 'solid #ffb100',
          borderWidth: '0 0 0 4px',
          boxSizing: 'border-box',
          padding: '12px 16px',
        }}
      >
        <FormattedMessage id="admin/return-app.export-module.content.warning-paragraph" />
      </div>
      <p className="t-small gray mv3">
        <FormattedMessage id="admin/return-app.export-module.content.format-disclaimer" />
        &nbsp;
        {SUPPORTED_REPORT_FORMATS.map((format) => `.${format} `)}
      </p>
      <p className="t-small gray mv0">
        <FormattedMessage id="admin/return-app.export-module.content.skip-disclaimer" />
      </p>
    </>
  )
}

export default Content
