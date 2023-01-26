import React from 'react'
import { SkeletonPiece } from 'vtex.my-account-commons'
import { Divider } from 'vtex.styleguide'

const ReportLoader = () => {
  return (
    <>
      <div className="mt3">
        <SkeletonPiece width="30" size="4" />
      </div>
      <div className="mt4 mb5 flex justify-between">
        <SkeletonPiece width="40" size="4" />
        <SkeletonPiece width="40" size="4" />
      </div>
      <div className="mv3">
        <SkeletonPiece width="100" size="4" />
      </div>
      <div className="mv3">
        <SkeletonPiece width="100" size="4" />
      </div>
      <div className="mv3">
        <SkeletonPiece width="100" size="4" />
      </div>
      <div className="mv5">
        <Divider orientation="horizontal" />
      </div>
      <div className="mt5 mb6">
        <SkeletonPiece width="40" size="4" />
      </div>
      <div className="mv3">
        <SkeletonPiece width="100" size="5" />
      </div>
      <div className="mt5">
        <SkeletonPiece width="40" size="4" />
      </div>
      <div className="mv3">
        <SkeletonPiece width="100" size="5" />
      </div>
      <div className="mt3">
        <SkeletonPiece width="100" size="5" />
      </div>
      <div className="mt6">
        <SkeletonPiece width="40" size="4" />
      </div>
      <div className="mv3">
        <SkeletonPiece width="100" size="5" />
      </div>
      <div className="mv3 flex justify-end">
        <SkeletonPiece width="40" size="5" />
      </div>
    </>
  )
}

export default ReportLoader
