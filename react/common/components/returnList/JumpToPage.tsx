import type { FormEvent } from 'react'
import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Input, Button } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = ['jumpToPageContainer'] as const

interface Props {
  handleJumpToPage: (page: number) => void
  currentPage: number
  maxPage: number
}

const JumpToPage = (props: Props) => {
  const handles = useCssHandles(CSS_HANDLES)

  const { handleJumpToPage, currentPage, maxPage } = props

  const [desiredPage, setDesiredPage] = useState(currentPage)
  const [canSubmit, setEnableSubmit] = useState(true)

  useEffect(() => {
    if (desiredPage > maxPage || desiredPage <= 0) {
      setEnableSubmit(false)

      return
    }

    setEnableSubmit(true)
  }, [desiredPage, maxPage])

  const handleOnChange = (page: number) => {
    setDesiredPage(page)
  }

  const handleSubmit = () => {
    handleJumpToPage(desiredPage)
  }

  return (
    <div className={`${handles.jumpToPageContainer} relative w-100`}>
      <div
        className="absolute flex items-center"
        style={{ right: '50%', top: '-2rem' }}
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
            value={desiredPage || null}
            onChange={(e: FormEvent<HTMLInputElement>) =>
              handleOnChange(Number(e.currentTarget.value))
            }
          />
        </div>
        <div className="ml3">
          <Button
            variation="secondary"
            size="small"
            onClick={handleSubmit}
            disabled={!desiredPage || !canSubmit}
          >
            <FormattedMessage id="return-app.return-request-list.table-jumpToPage.cta" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default JumpToPage
