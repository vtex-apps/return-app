import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import { Table } from 'vtex.styleguide'

import {
  currentDate,
  filterDate,
  requestsStatuses,
  schemaNames,
  schemaTypes,
} from '../../common/utils'
import { fetchHeaders, fetchMethod, fetchPath } from '../../common/fetch'
import ReturnsTableSchema from '../../common/ReturnsTableSchema'
import { ReturnTableModal } from '../../components/ReturnTableModal'
import { initialFilters } from '../../common/constants/returnsTable'
import ReturnTableFrom from './ReturnTableFrom'

interface IProps {
  navigate: (to: { to: string }) => void
}

type FilterBy = keyof typeof initialFilters

interface IState {
  itmes: any[]
  error: string | null
  pageNumber: number
  perPage: number
  totalItems: number
  itemFrom: number
  itemTo: number
  filters: typeof initialFilters
  emptyStateLabel: JSX.Element
  tableIsLoading: boolean
  isFiltered: boolean
  dataSort: {
    sortedBy: FilterBy
    sortOrder: 'DESC' | 'ASC'
  }
  isModalOpen: boolean
  selectedRequestProducts: any[]
}

const INITIAL_ROW_LENGTH = 15

class ReturnsTableContent extends Component<IProps, IState> {
  public static propTypes = {
    navigate: PropTypes.func,
  }

  constructor(props: any) {
    super(props)
    this.state = {
      itmes: [],
      error: null,
      perPage: INITIAL_ROW_LENGTH,
      pageNumber: 1,
      totalItems: 0, // 0 is initial value
      itemFrom: 1, // 1 the first value
      itemTo: INITIAL_ROW_LENGTH,
      filters: initialFilters,
      emptyStateLabel: <FormattedMessage id="returns.nothingToShow" />,
      tableIsLoading: true,
      isFiltered: false,
      dataSort: {
        sortedBy: 'createdIn',
        sortOrder: 'DESC',
      },
      isModalOpen: false,
      selectedRequestProducts: [],
    }
  }

  public componentDidMount = () => {
    this.getRequests()
  }

  protected getRequests = async () => {
    try {
      this.setState({ tableIsLoading: true })
      const {
        filters,
        pageNumber,
        perPage,
        dataSort: { sortedBy, sortOrder },
      } = this.state

      let where = 'type=request'

      if (JSON.stringify(filters) === JSON.stringify(initialFilters)) {
        this.setState({ isFiltered: false })
      } else {
        this.setState({ isFiltered: true })
      }

      if (filters.orderId !== '') {
        where += ` AND orderId="*${filters.orderId}*"`
      }

      if (filters.returnId !== '') {
        where += ` AND id="*${filters.returnId}*"`
      }

      if (filters.sequenceNumber !== '') {
        where += ` AND sequenceNumber="${filters.sequenceNumber}"`
      }

      let startDate = '1970-01-01'
      let endDate = currentDate()

      if (filters.fromDate !== '' || filters.toDate !== '') {
        startDate =
          filters.fromDate !== '' ? filterDate(filters.fromDate) : startDate
        endDate =
          filters.toDate !== ''
            ? filterDate(filters.toDate)
            : filterDate(filters.fromDate)

        where += ` AND createdIn between ${startDate} AND ${endDate}`
      }

      if (filters.status !== '') {
        where += ` AND status="${requestsStatuses[filters.status]}"`
      }

      const url = `${
        fetchPath.getRequests + schemaNames.request
      }/${pageNumber}/${perPage}/${sortedBy}/${sortOrder}/${where}`

      const returnsResponse = await fetch(url)

      const returns = await returnsResponse.json()

      if ('error' in returns) {
        this.setState({ error: returns.error, tableIsLoading: false })
      } else {
        this.setState({
          itmes: returns.data,
          totalItems: returns.pagination?.total,
          tableIsLoading: false,
        })
      }
    } catch (error) {
      this.setState({ error: error.message })
    }
  }

  protected handleViewRequest = async (requestId: string) => {
    try {
      const url = `${fetchPath.getDocuments + schemaNames.product}/${
        schemaTypes.products
      }/refundId=${requestId}`

      const returnProducts = await fetch(url, {
        method: fetchMethod.get,
        headers: fetchHeaders,
      })

      const products = await returnProducts.json()

      this.setState({ selectedRequestProducts: products })
      this.onHandleModalToggle()
    } catch (error) {
      this.setState({ error: error.message })
    }
  }

  protected onHandleModalToggle = () => {
    this.setState((prevState) => ({ isModalOpen: !prevState.isModalOpen }))
  }

  protected setStateWithResetPage = async (
    key: keyof IState,
    value: IState[keyof IState],
    callback?: () => Promise<void>
  ) => {
    this.setState(
      (prevState) => ({
        ...prevState,
        pageNumber: 1,
        itemFrom: 1,
        itemTo: 15,
        [key]: value,
      }),
      callback || undefined
    )
  }

  protected handleSort = ({ sortOrder, sortedBy }) => {
    //  here we just sort by the existing data
    this.setState(
      {
        dataSort: { sortedBy, sortOrder },
      },
      this.getRequests
    )
  }

  protected onhandleResetFilters = () => {
    this.setStateWithResetPage('filters', initialFilters, this.getRequests)
  }

  protected onhandleApplyFilters = () => {
    const { filters } = this.state

    if (JSON.stringify(filters) === JSON.stringify(initialFilters)) {
      /**
       * here we compare the initialFilters with the current filters if they are equal so no filter is applied.
       */
      this.onhandleResetFilters()

      return
    }

    /**
     * here we reset the page number to 1 and apply the filters.
     */
    this.setStateWithResetPage('pageNumber', 1, this.getRequests)
  }

  protected filterByKey = (filterBy: FilterBy, value: string) => {
    this.setState((prevState: IState) => ({
      filters: {
        ...prevState.filters,
        [filterBy]: value,
      },
    }))
  }

  protected handleNextClick = () => {
    this.setState(
      (prevState) => ({
        pageNumber: prevState.pageNumber + 1,
        itemFrom: prevState.itemFrom + prevState.perPage,
        itemTo: prevState.itemTo + prevState.perPage,
      }),
      this.getRequests
    )
  }

  protected handlePrevClick = () => {
    const { pageNumber } = this.state

    if (pageNumber === 1) return // do nothing when page is the first page.

    this.setState(
      (prevState) => ({
        pageNumber: prevState.pageNumber - 1,
        itemFrom: prevState.itemFrom - prevState.perPage,
        itemTo: prevState.itemTo - prevState.perPage,
      }),
      this.getRequests
    )
  }

  public render() {
    const {
      error,
      tableIsLoading,
      filters,
      itmes,
      emptyStateLabel,
      isFiltered,
      selectedRequestProducts,
      perPage,
      totalItems,
      itemFrom,
      itemTo,
    } = this.state

    if (error) {
      return (
        <div>
          <p className="center">{error}</p>
        </div>
      )
    }

    return (
      <div>
        <ReturnTableFrom
          filters={filters}
          handleApplyFilters={this.onhandleApplyFilters}
          filterByKey={this.filterByKey}
          handleResetFilters={this.onhandleResetFilters}
          isFiltered={isFiltered}
        />
        <Table
          fullWidth
          loading={tableIsLoading}
          items={itmes}
          emptyStateLabel={emptyStateLabel}
          schema={ReturnsTableSchema({
            navigate: this.props.navigate,
            handleViewRequest: this.handleViewRequest,
          })}
          pagination={{
            textShowRows: <FormattedMessage id="returns.tableShowRows" />,
            textOf: <FormattedMessage id="returns.tableOf" />,
            onNextClick: this.handleNextClick,
            onPrevClick: this.handlePrevClick,

            tableLength: perPage,
            currentItemFrom: itmes.length ? itemFrom : 0,
            currentItemTo: itemTo,
            totalItems,
          }}
          onSort={this.handleSort}
          sort={{
            sortedBy: this.state.dataSort.sortedBy,
            sortOrder: this.state.dataSort.sortOrder,
          }}
        />
        <ReturnTableModal
          selectedRequestProducts={selectedRequestProducts}
          isModalOpen={this.state.isModalOpen}
          handleModalToggle={this.onHandleModalToggle}
        />
      </div>
    )
  }
}

export default ReturnsTableContent
