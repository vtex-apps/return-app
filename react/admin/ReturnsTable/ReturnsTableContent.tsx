/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { FormattedCurrency } from 'vtex.format-currency'
import {
  Button,
  Input,
  Table,
  DatePicker,
  ButtonWithIcon,
  ActionMenu,
  Modal,
  IconVisibilityOn,
  IconGrid,
} from 'vtex.styleguide'

import styles from '../../styles.css'
import {
  beautifyDate,
  currentDate,
  filterDate,
  requestsStatuses,
  FormattedMessageFixed,
  sortColumns,
  order,
  schemaNames,
  schemaTypes,
  getStatusTranslation,
  renderStatusIcon,
} from '../../common/utils'
import { fetchHeaders, fetchMethod, fetchPath } from '../../common/fetch'

const initialFilters = {
  orderId: '',
  returnId: '',
  sequenceNumber: '',
  fromDate: '',
  toDate: '',
  status: '',
}

const tableLength = 15

class ReturnsTableContent extends Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      orderedItems: [],
      returns: [],
      slicedData: [],
      error: '',
      paging: {
        total: 0,
        currentPage: 1,
        perPage: tableLength,
        currentFrom: 1,
        currentTo: tableLength,
      },
      filters: initialFilters,
      emptyStateLabel: <FormattedMessage id="returns.nothingToShow" />,
      async: [],
      tableIsLoading: true,
      isFiltered: false,
      dataSort: {
        sortedBy: null,
        sortOrder: null,
      },
      isModalOpen: false,
      selectedRequestProducts: [],
    }

    this.sortOrderIdASC = this.sortOrderIdASC.bind(this)
    this.sortOrderIdDESC = this.sortOrderIdDESC.bind(this)
    this.sortRequestIdASC = this.sortRequestIdASC.bind(this)
    this.sortRequestIdDESC = this.sortRequestIdDESC.bind(this)
    this.sortDateSubmittedASC = this.sortDateSubmittedASC.bind(this)
    this.sortDateSubmittedDESC = this.sortDateSubmittedDESC.bind(this)
    this.sortStatusASC = this.sortStatusASC.bind(this)
    this.sortStatusDESC = this.sortStatusDESC.bind(this)
    this.handleSort = this.handleSort.bind(this)
    this.handleNextClick = this.handleNextClick.bind(this)
    this.handlePrevClick = this.handlePrevClick.bind(this)
    this.goToPage = this.goToPage.bind(this)
    this.handleModalToggle = this.handleModalToggle.bind(this)
  }

  handleModalToggle() {
    this.setState((prevState) => ({ isModalOpen: !prevState.isModalOpen }))
  }

  sortOrderIdASC(a, b) {
    return a.orderId < b.orderId ? -1 : a.orderId > b.orderId ? 1 : 0
  }

  sortOrderIdDESC(a, b) {
    return a.orderId < b.orderId ? 1 : a.orderId > b.orderId ? -1 : 0
  }

  sortRequestIdASC(a, b) {
    return a.id < b.id ? -1 : a.id > b.id ? 1 : 0
  }

  sortRequestIdDESC(a, b) {
    return a.id < b.id ? 1 : a.id > b.id ? -1 : 0
  }

  sortDateSubmittedASC(a, b) {
    return a.dateSubmitted < b.dateSubmitted
      ? -1
      : a.dateSubmitted > b.dateSubmitted
      ? 1
      : 0
  }

  sortDateSubmittedDESC(a, b) {
    return a.dateSubmitted < b.dateSubmitted
      ? 1
      : a.dateSubmitted > b.dateSubmitted
      ? -1
      : 0
  }

  sortStatusASC(a, b) {
    return a.status < b.status ? -1 : a.status > b.status ? 1 : 0
  }

  sortStatusDESC(a, b) {
    return a.status < b.status ? 1 : a.status > b.status ? -1 : 0
  }

  handleSort({ sortOrder, sortedBy }) {
    const { returns } = this.state
    let slicedData = []

    if (sortedBy === sortColumns.orderId) {
      slicedData =
        sortOrder === order.asc
          ? returns.slice().sort(this.sortOrderIdASC)
          : returns.slice().sort(this.sortOrderIdDESC)
    }

    if (sortedBy === sortColumns.id) {
      slicedData =
        sortOrder === order.asc
          ? returns.slice().sort(this.sortRequestIdASC)
          : returns.slice().sort(this.sortRequestIdDESC)
    }

    if (sortedBy === sortColumns.dateSubmitted) {
      slicedData =
        sortOrder === order.asc
          ? returns.slice().sort(this.sortDateSubmittedASC)
          : returns.slice().sort(this.sortDateSubmittedDESC)
    }

    if (sortedBy === sortColumns.status) {
      slicedData =
        sortOrder === order.asc
          ? returns.slice().sort(this.sortStatusASC)
          : returns.slice().sort(this.sortStatusDESC)
    }

    this.setState({
      slicedData,
      dataSort: {
        sortedBy,
        sortOrder,
      },
    })
  }

  componentDidMount() {
    this.getRequests()
  }

  getRequests() {
    const { filters } = this.state
    let where = ''

    if (JSON.stringify(filters) === JSON.stringify(initialFilters)) {
      this.setState({ isFiltered: false })
      where = '1'
    } else {
      this.setState({ isFiltered: true })

      if (filters.orderId !== '') {
        where += `orderId="*${filters.orderId}*"`
      }

      if (filters.returnId !== '') {
        where += `__id="*${filters.returnId}*"`
      }

      if (filters.sequenceNumber !== '') {
        where += `sequenceNumber="${filters.sequenceNumber}"`
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

        where += `__createdIn between ${startDate} AND ${endDate}`
      }

      if (filters.status !== '') {
        where += `__status="${requestsStatuses[filters.status]}"`
      }

      if (where.startsWith('__')) {
        where = where.substring(2)
      }
    }

    fetch(
      `${fetchPath.getDocuments + schemaNames.request}/${
        schemaTypes.requests
      }/${where}`,
      {
        method: fetchMethod.get,
        headers: fetchHeaders,
      }
    )
      .then((response) => response.json())
      .then((returns) => {
        if ('error' in returns) {
          this.setState({ error: returns.error })
        } else {
          this.setState((prevState) => ({
            returns,
            orderedItems: returns,
            slicedData: returns.length ? returns.slice(0, tableLength) : [],
            tableIsLoading: false,
            paging: {
              ...prevState.paging,
              currentPage: 1,
              currentTo: tableLength,
              currentFrom: 1,
              total: returns.length,
            },
          }))
        }
      })
      .catch((err) => this.setState({ error: err }))
  }

  getTableSchema() {
    return {
      properties: {
        id: {
          title: <FormattedMessage id="returns.requestId" />,
          sortable: true,
          width: 350,
        },
        sequenceNumber: {
          title: <FormattedMessage id="returns.sequenceNumber" />,
          sortable: true,
        },
        orderId: {
          title: <FormattedMessage id="returns.orderId" />,
          sortable: true,
        },
        dateSubmitted: {
          title: <FormattedMessage id="returns.submittedDate" />,
          cellRenderer: ({ cellData }) => {
            return beautifyDate(cellData)
          },
          sortable: true,
        },
        status: {
          title: <FormattedMessage id="returns.status" />,
          sortable: true,
          width: 200,
          cellRenderer: ({ cellData }) => {
            return <div>{renderStatusIcon(cellData)}</div>
          },
        },
        actions: {
          width: 150,
          title: <FormattedMessage id="returns.actions" />,
          cellRenderer: ({ rowData }) => {
            return (
              <div>
                <Button
                  variation="tertiary"
                  onClick={() => {
                    this.handleViewRequest(rowData.id)
                  }}
                >
                  <IconGrid />
                </Button>
                <Button
                  variation="tertiary"
                  onClick={() => {
                    window.open(`/admin/returns/${rowData.id}/details`)
                  }}
                >
                  <IconVisibilityOn />
                </Button>
              </div>
            )
          },
        },
      },
    }
  }

  filterStatus(status: string) {
    this.setState((prevState) => ({
      filters: {
        ...prevState.filters,
        status,
      },
    }))
  }

  filterReturnId(val: string) {
    this.setState((prevState) => ({
      filters: {
        ...prevState.filters,
        returnId: val,
      },
    }))
  }

  filterSequenceNumber(val: string) {
    this.setState((prevState) => ({
      filters: {
        ...prevState.filters,
        sequenceNumber: val,
      },
    }))
  }

  filterOrderId(val: string) {
    this.setState((prevState) => ({
      filters: {
        ...prevState.filters,
        orderId: val,
      },
    }))
  }

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
      this.getRequests()
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
    const { paging, orderedItems } = this.state
    const newPage = +paging.currentPage + 1
    const itemFrom = +paging.currentTo + 1
    const itemTo = paging.perPage * newPage
    const data = orderedItems.slice(itemFrom - 1, itemTo)

    this.goToPage(newPage, itemFrom, itemTo, data)
  }

  handlePrevClick() {
    const { paging, orderedItems } = this.state

    if (paging.currentPage === 0) return
    const newPage = paging.currentPage - 1
    const itemFrom = paging.currentFrom - paging.perPage
    const itemTo = paging.currentFrom - 1
    const data = orderedItems.slice(itemFrom - 1, itemTo)

    this.goToPage(newPage, itemFrom, itemTo, data)
  }

  // eslint-disable-next-line max-params
  goToPage(currentPage, currentItemFrom, currentItemTo, slicedData) {
    this.setState((prevState) => ({
      paging: {
        ...prevState.paging,
        currentPage,
        currentFrom: currentItemFrom,
        currentTo: currentItemTo,
      },
      slicedData,
    }))
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
      slicedData,
      emptyStateLabel,
      isFiltered,
      selectedRequestProducts,
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
                  onChange={(e) => this.filterReturnId(e.target.value)}
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
                  onChange={(e) => this.filterSequenceNumber(e.target.value)}
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
                  onChange={(e) => this.filterOrderId(e.target.value)}
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
                  onClick: () => this.filterStatus(''),
                },
                {
                  label: <FormattedMessage id="returns.statusNew" />,
                  onClick: () => this.filterStatus('new'),
                },
                {
                  label: <FormattedMessage id="returns.statusApproved" />,
                  onClick: () => this.filterStatus('approved'),
                },
                {
                  label: (
                    <FormattedMessage id="returns.statusPendingVerification" />
                  ),
                  onClick: () => this.filterStatus('pendingVerification'),
                },
                {
                  label: (
                    <FormattedMessage id="returns.statusPartiallyApproved" />
                  ),
                  onClick: () => this.filterStatus('partiallyApproved'),
                },
                {
                  label: <FormattedMessage id="returns.statusDenied" />,
                  onClick: () => this.filterStatus('denied'),
                },
                {
                  label: <FormattedMessage id="returns.statusRefunded" />,
                  onClick: () => this.filterStatus('refunded'),
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
          items={slicedData}
          emptyStateLabel={emptyStateLabel}
          schema={this.getTableSchema()}
          pagination={{
            onNextClick: this.handleNextClick,
            onPrevClick: this.handlePrevClick,
            textShowRows: <FormattedMessage id="returns.tableShowRows" />,
            textOf: <FormattedMessage id="returns.tableOf" />,
            currentItemFrom: paging.currentFrom,
            currentItemTo: paging.currentTo,
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
