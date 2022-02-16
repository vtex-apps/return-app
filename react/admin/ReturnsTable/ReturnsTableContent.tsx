/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import { FormattedCurrency } from 'vtex.format-currency'
import {
  Button,
  Input,
  Table,
  DatePicker,
  ButtonWithIcon,
  ActionMenu,
  Modal,
} from 'vtex.styleguide'

import styles from '../../styles.css'
import {
  currentDate,
  filterDate,
  requestsStatuses,
  FormattedMessageFixed,
  schemaNames,
  schemaTypes,
  getStatusTranslation,
} from '../../common/utils'
import { fetchHeaders, fetchMethod, fetchPath } from '../../common/fetch'
import ReturnsTableSchema from '../../common/ReturnsTableSchema'

type FilterBy =
  | 'status'
  | 'returnId'
  | 'sequenceNumber'
  | 'orderId'
  | 'fromDate'
  | 'toDate'

const initialFilters = {
  orderId: '',
  returnId: '',
  sequenceNumber: '',
  fromDate: '',
  toDate: '',
  status: '',
}

const tableLength = 15
const initialPaging = {
  total: 0,
  page: 1,
  perPage: tableLength,
}

class ReturnsTableContent extends Component<any, any> {
  static propTypes = {
    navigate: PropTypes.func,
  }

  constructor(props: any) {
    super(props)
    this.state = {
      orderedItems: [],
      returns: [],
      slicedData: [],
      error: '',
      paging: initialPaging,
      filters: initialFilters,
      currentItemFrom: 1,
      currentItemTo: tableLength,
      emptyStateLabel: <FormattedMessage id="returns.nothingToShow" />,
      async: [],
      tableIsLoading: true,
      isFiltered: false,
      dataSort: {
        sortedBy: 'createdIn',
        sortOrder: 'DESC',
      },
      isModalOpen: false,
      selectedRequestProducts: [],
    }

    this.handleSort = this.handleSort.bind(this)
    this.handleNextClick = this.handleNextClick.bind(this)
    this.handlePrevClick = this.handlePrevClick.bind(this)
    this.getRequests = this.getRequests.bind(this)
    this.handleModalToggle = this.handleModalToggle.bind(this)
  }

  handleModalToggle() {
    this.setState((prevState) => ({ isModalOpen: !prevState.isModalOpen }))
  }

  handleSort({ sortOrder, sortedBy }) {
    this.setState(
      { dataSort: { sortedBy, sortOrder }, paging: initialPaging },
      this.getRequests
    )
  }

  componentDidMount() {
    this.getRequests()
  }

  async getRequests() {
    this.setState({ tableIsLoading: true })
    const { filters, paging, dataSort } = this.state
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

    const returnsResponse = await fetch(
      `${fetchPath.getRequests + schemaNames.request}/${paging.page}/${
        paging.perPage
      }/${dataSort.sortedBy}/${dataSort.sortOrder}/${where}`
    )

    console.log(
      `${fetchPath.getRequests + schemaNames.request}/${paging.page}/${
        paging.perPage
      }/${dataSort.sortedBy}/${dataSort.sortOrder}/${where}`
    )
    this.setState({ tableIsLoading: false })
    // /returns/getRequests/returnRequests/1/15/createdIn/DESC/type=request
    // /returns/getRequests/returnRequests/1/15/createdIn/DESC/type=request AND sequenceNumber="10"
    // /returns/getRequests/returnRequests/1/15/createdIn/DESC/type=request AND createdIn between 2022-02-01 AND 2022-02-01
    // /returns/getRequests/returnRequests/1/15/createdIn/DESC/type=request AND sequenceNumber="19" AND createdIn between 2022-02-01 AND 2022-02-01
    // return

    const returns = await returnsResponse.json()

    if ('error' in returns) {
      this.setState({ error: returns.error })
    } else {
      this.setState((prevState) => ({
        returns: returns.data,
        orderedItems: returns,
        slicedData: returns.length ? returns.slice(0, tableLength) : [],
        tableIsLoading: false,
        paging: {
          ...prevState.paging,
          total: returns.pagination?.total,
        },
      }))
    }
  }

  filterByKey(filterBy: FilterBy, value: string) {
    this.setState((prevState) => ({
      filters: {
        ...prevState.filters,
        [filterBy]: value,
      },
    }))
  }

  // filterStatus(status: string) {
  //   this.setState((prevState) => ({
  //     filters: {
  //       ...prevState.filters,
  //       status,
  //     },
  //   }))
  // }

  // filterReturnId(val: string) {
  //   this.setState((prevState) => ({
  //     filters: {
  //       ...prevState.filters,
  //       returnId: val,
  //     },
  //   }))
  // }

  // filterSequenceNumber(val: string) {
  //   this.setState((prevState) => ({
  //     filters: {
  //       ...prevState.filters,
  //       sequenceNumber: val,
  //     },
  //   }))
  // }

  // filterOrderId(val: string) {
  //   this.setState((prevState) => ({
  //     filters: {
  //       ...prevState.filters,
  //       orderId: val,
  //     },
  //   }))
  // }

  filterFromDate(val: string) {
    this.setState((prevState) => ({
      filters: {
        ...prevState.filters,
        fromDate: val,
        toDate:
          prevState.filters.toDate === '' || prevState.filters.toDate < val
            ? val
            : prevState.filters.toDate,
      },
    }))
    setTimeout(() => {
      this.handleApplyFilters()
    }, 200)
  }

  filterToDate(val: string) {
    this.setState((prevState) => ({
      filters: {
        ...prevState.filters,
        toDate: val,
        fromDate:
          prevState.filters.fromDate === '' || prevState.filters.fromDate > val
            ? val
            : prevState.filters.fromDate,
      },
    }))
    setTimeout(() => {
      this.handleApplyFilters()
    }, 200)
  }

  handleApplyFilters() {
    const { filters } = this.state

    if (JSON.stringify(filters) === JSON.stringify(initialFilters)) {
      this.handleResetFilters()
    } else {
      this.handleFirstPageFilter()
    }
  }

  handleResetFilters() {
    this.setState(
      {
        filters: initialFilters,
        tableIsLoading: true,
        isFiltered: false,
      },
      this.getRequests
    )
  }

  handleNextClick() {
    const { paging } = this.state

    const currentItemFrom =
      Number(this.state.currentItemFrom) + Number(paging.perPage)

    const currentItemTo =
      Number(this.state.currentItemTo) + Number(paging.perPage)

    this.setState((prevState) => {
      prevState.paging.page = Number(prevState.paging.page) + 1

      return {
        paging: prevState.paging,
        currentItemFrom,
        currentItemTo,
      }
    }, this.getRequests)
  }

  handlePrevClick() {
    const { paging } = this.state

    if (paging.page === 0) return

    const currentItemFrom =
      Number(this.state.currentItemFrom) - Number(paging.perPage)

    const currentItemTo =
      Number(this.state.currentItemTo) - Number(paging.perPage)

    this.setState((prevState) => {
      prevState.paging.page -= 1

      return {
        paging: prevState.paging,
        currentItemFrom,
        currentItemTo,
      }
    }, this.getRequests)
  }

  handleFirstPageFilter() {
    // ! made by me to handle first page filter ASEM QAFFAF
    // return
    // this.getRequests()
    // const currentItemFrom = Number(this.state.currentItemFrom)
    const currentItemTo = Number(this.state.currentItemTo)

    console.log('currentItemTo :>> ', currentItemTo)
    this.setState((prevState) => {
      prevState.paging.page = 1
      // prevState.currentItemFrom = 1
      // prevState.currentItemTo = 1

      return {
        paging: prevState.paging,
        // currentItemFrom: prevState.currentItemFrom,
        // currentItemTo: Number(prevState.currentItemTo),
      }
    }, this.getRequests)
  }

  handleViewRequest = (requestId: string) => {
    fetch(
      `${fetchPath.getDocuments + schemaNames.product}/${
        schemaTypes.products
      }/refundId=${requestId}`,
      {
        method: fetchMethod.get,
        headers: fetchHeaders,
      }
    )
      .then((response) => response.json())
      .then((products) => {
        this.setState({ selectedRequestProducts: products })
        this.handleModalToggle()
      })
      .catch((err) => this.setState({ error: err }))
  }

  handleKeypress(e) {
    if (e.key === 'Enter') {
      this.handleApplyFilters()
    }
  }

  render() {
    const {
      error,
      paging,
      tableIsLoading,
      filters,
      returns,
      emptyStateLabel,
      isFiltered,
      selectedRequestProducts,
      currentItemFrom,
      currentItemTo,
    } = this.state

    const statusLabel =
      filters.status !== '' ? (
        <FormattedMessageFixed
          id={`returns.status${getStatusTranslation(filters.status)}`}
        />
      ) : (
        <FormattedMessage id="returns.statusAllStatuses" />
      )

    if (error) {
      return (
        <div>
          <p className="center">{error}</p>
        </div>
      )
    }

    return (
      <div>
        <div className="flex items-center">
          <div className="ma2">
            <FormattedMessage id="returns.requestId">
              {(msg) => (
                <Input
                  placeholder={msg}
                  onKeyPress={(e) => {
                    this.handleKeypress(e)
                  }}
                  size="small"
                  onChange={(e) => this.filterByKey('returnId', e.target.value)} // returnId
                  value={filters.returnId}
                />
              )}
            </FormattedMessage>
          </div>
          <div className="ma2">
            <FormattedMessage id="returns.sequenceNumber">
              {(msg) => (
                <Input
                  placeholder={msg}
                  onKeyPress={(e) => {
                    this.handleKeypress(e)
                  }}
                  size="small"
                  onChange={(e) =>
                    this.filterByKey('sequenceNumber', e.target.value)
                  } // sequenceNumber
                  value={filters.sequenceNumber}
                />
              )}
            </FormattedMessage>
          </div>
          <div className="ma2">
            <FormattedMessage id="returns.orderId">
              {(msg) => (
                <Input
                  placeholder={msg}
                  onKeyPress={(e) => {
                    this.handleKeypress(e)
                  }}
                  size="small"
                  onChange={(e) => this.filterByKey('orderId', e.target.value)} // orderId
                  value={filters.orderId}
                />
              )}
            </FormattedMessage>
          </div>
          <div className="ma2">
            <FormattedMessage id="returns.filterFromDate">
              {(msg) => (
                <DatePicker
                  placeholder={msg}
                  locale="en-GB"
                  size="small"
                  onChange={(value) => this.filterFromDate(value)}
                  value={filters.fromDate}
                />
              )}
            </FormattedMessage>
          </div>
          <div className="ma2">
            <FormattedMessage id="returns.filterToDate">
              {(msg) => (
                <DatePicker
                  placeholder={msg}
                  locale="en-GB"
                  size="small"
                  onChange={(value) => this.filterToDate(value)}
                  value={filters.toDate}
                />
              )}
            </FormattedMessage>
          </div>
          <div className="ma2">
            <ActionMenu
              label={statusLabel}
              align="right"
              buttonProps={{
                variation: 'secondary',
                size: 'small',
              }}
              options={[
                {
                  label: <FormattedMessage id="returns.statusAllStatuses" />,
                  onClick: () => this.filterByKey('status', ''), // status
                },
                {
                  label: <FormattedMessage id="returns.statusNew" />,
                  onClick: () => this.filterByKey('status', 'new'),
                },
                {
                  label: <FormattedMessage id="returns.statusApproved" />,
                  onClick: () => this.filterByKey('status', 'approved'),
                },
                {
                  label: (
                    <FormattedMessage id="returns.statusPendingVerification" />
                  ),
                  onClick: () =>
                    this.filterByKey('status', 'pendingVerification'),
                },
                {
                  label: (
                    <FormattedMessage id="returns.statusPartiallyApproved" />
                  ),
                  onClick: () =>
                    this.filterByKey('status', 'pendingVerification'),
                },
                {
                  label: <FormattedMessage id="returns.statusDenied" />,
                  onClick: () => this.filterByKey('status', 'denied'),
                },
                {
                  label: <FormattedMessage id="returns.statusRefunded" />,
                  onClick: () => this.filterByKey('status', 'refunded'),
                },
              ]}
            />
          </div>
          <div className="ma2">
            <Button size="small" onClick={() => this.handleApplyFilters()}>
              <FormattedMessage id="returns.filterResults" />
            </Button>
          </div>
          {isFiltered ? (
            <div className="ma2">
              <ButtonWithIcon
                variation="secondary"
                size="small"
                onClick={() => this.handleResetFilters()}
              >
                <FormattedMessage id="returns.clearFilters" />
              </ButtonWithIcon>
            </div>
          ) : null}
        </div>
        <Table
          fullWidth
          loading={tableIsLoading}
          items={returns}
          emptyStateLabel={emptyStateLabel}
          schema={ReturnsTableSchema({
            navigator: this.props.navigator,
            handleViewRequest: this.handleViewRequest,
          })}
          pagination={{
            onNextClick: this.handleNextClick,
            onPrevClick: this.handlePrevClick,
            textShowRows: <FormattedMessage id="returns.tableShowRows" />,
            textOf: <FormattedMessage id="returns.tableOf" />,
            currentItemFrom,
            currentItemTo,
            totalItems: paging.total,
          }}
          sort={{
            sortedBy: this.state.dataSort.sortedBy,
            sortOrder: this.state.dataSort.sortOrder,
          }}
          onSort={this.handleSort}
        />
        <Modal
          centered
          isOpen={this.state.isModalOpen}
          onClose={this.handleModalToggle}
        >
          <div className="dark-gray">
            {selectedRequestProducts.length ? (
              <table className={`${styles.table} ${styles.tableModal}`}>
                <thead>
                  <tr>
                    <th>
                      <FormattedMessage id="returns.skuId" />
                    </th>
                    <th>
                      <FormattedMessage id="returns.product" />
                    </th>
                    <th>
                      <FormattedMessage id="returns.unitPrice" />
                    </th>
                    <th>
                      <FormattedMessage id="returns.quantity" />
                    </th>
                    <th>
                      <FormattedMessage id="returns.price" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedRequestProducts.map((product: any) => (
                    <tr key={product.skuId}>
                      <td>{product.skuId}</td>
                      <td>{product.skuName}</td>
                      <td>
                        <FormattedCurrency value={product.unitPrice / 100} />
                      </td>
                      <td>{product.quantity}</td>
                      <td>
                        <FormattedCurrency value={product.totalPrice / 100} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : null}
          </div>
        </Modal>
      </div>
    )
  }
}

export default ReturnsTableContent
