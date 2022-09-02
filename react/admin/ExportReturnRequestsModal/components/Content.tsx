import React from 'react'

import { SUPPORTED_REPORT_FORMATS } from '../../../common/constants/returnsRequest'

const Content = () => {
  return (
    <>
      <p className="mt3">
        The Export module is the system responsible for merging all return
        requests into a single file called{' '}
        <span className="fw5 underline">report</span>, this can be then sent to
        an email or downloaded directly from this module
      </p>
      <p className="mt3">
        Keep in mind that download links are not permanent, they expire after{' '}
        <span className="fw5 underline">6 hours</span> following their
        availability
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
        It is important to remember that depending on the quantity of return
        requests, the process can take a long time to finish. If you chose to
        generate a download link, you can leave the module open and it will
        update when its available for download
      </div>
      <p className="t-small gray mv3">
        Supported formats:&nbsp;
        {SUPPORTED_REPORT_FORMATS.map((format) => `.${format} `)}
      </p>
      <p className="t-small gray mv0">
        Documents containing errors will be skipped
      </p>
    </>
  )
}

export default Content
