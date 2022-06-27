import type { FormEvent } from 'react'
import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Input, Button } from 'vtex.styleguide'

interface Props {
  handleJumpToPage: (page: number) => void
  currentPage: number
  maxPage: number
}

/**
 * @todo
 * - min y max page props
 * - test rerender
 */
const JumpToPage = (props: Props) => {
  const { handleJumpToPage, currentPage, maxPage } = props

  const [desiredPage, setDesiredPage] = useState(0)

  return (
    <div className="relative w-100">
      <div
        className="absolute flex items-center"
        style={{ right: '40%', top: '-2rem' }}
      >
        <div className="mr3">
          <span className="c-muted-2 t-small">
            <FormattedMessage id="return-app.return-request-list.table-jumpToPage.pageText" />{' '}
            {`${currentPage} - ${maxPage}`}
          </span>
        </div>
        <div style={{ width: '5rem' }}>
          <Input
            type="number"
            min={1}
            max={maxPage}
            size="small"
            onChange={(e: FormEvent<HTMLInputElement>) =>
              setDesiredPage(Number(e.currentTarget.value))
            }
          />
        </div>
        <div className="ml3">
          <Button
            variation="secondary"
            size="small"
            onClick={() => handleJumpToPage(desiredPage)}
            disabled={!desiredPage}
          >
            <FormattedMessage id="return-app.return-request-list.table-jumpToPage.cta" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default JumpToPage
