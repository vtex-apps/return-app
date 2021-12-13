/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, defineMessages } from 'react-intl'
import {
  ActionMenu,
  Button,
  ButtonWithIcon,
  DatePicker,
  Input,
  Link,
  Table,
} from 'vtex.styleguide'
import { withRuntimeContext } from 'vtex.render-runtime'

import styles from '../styles.css'
import {
  beautifyDate,
  currentDate,
  filterDate,
  requestsStatuses,
  schemaNames,
  schemaTypes,
  sortColumns,
  order,
  getStatusTranslation,
  renderStatusIcon,
} from '../common/utils'
import { fetchPath, fetchHeaders, fetchMethod } from '../common/fetch'

const tableLength = 15

const messages = defineMessages({
  thRequestNo: { id: 'returns.thRequestNo' },
  sequenceNumber: { id: 'returns.sequenceNo' },
  thDate: { id: 'returns.thDate' },
  thStatus: { id: 'returns.thStatus' },
  actions: { id: 'returns.actions' },
  view: { id: 'returns.view' },
  statusAllStatuses: { id: 'returns.statusAllStatuses' },
  pageTitle: { id: 'returns.pageTitle' },
  total: { id: 'returns.total' },
  addReturn: { id: 'returns.addReturn' },
  filterFromDate: { id: 'returns.filterFromDate' },
  filterToDate: { id: 'returns.filterToDate' },
  statusNew: { id: 'returns.statusNew' },
  statusApproved: { id: 'returns.statusApproved' },
  statusPendingVerification: { id: 'returns.statusPendingVerification' },
  statusPartiallyApproved: { id: 'returns.statusPartiallyApproved' },
  statusDenied: { id: 'returns.statusDenied' },
  statusRefunded: { id: 'returns.statusRefunded' },
  filterResults: { id: 'returns.filterResults' },
  clearFilters: { id: 'returns.clearFilters' },
  tableShowRows: { id: 'returns.tableShowRows' },
  tableOf: { id: 'returns.tableOf' },
})

const initialFilters = {
  returnId: '',
  fromDate: '',
  toDate: '',
  status: '',
  sequenceNumber: '',
}

class MyReturnsPage extends Component<any, any> {
  static propTypes = {
    headerConfig: PropTypes.object,
    fetchApi: PropTypes.func,
  }

  constructor(props: any) {
    super(props)
    this.state = {
      profile: {
        Email: '',
        FirstName: '',
        Gender: '',
        IsReturningUser: false,
        IsUserDefined: false,
        LastName: '',
        UserId: '',
      },
      emptyStateLabel: 'returns.nothingToShow',
      filters: initialFilters,
      returns: [],
      orderedItems: [],
      slicedData: [],
      paging: {
        total: 0,
        currentPage: 1,
        perPage: tableLength,
        currentFrom: 1,
        currentTo: tableLength,
      },
      tableIsLoading: true,
      isFiltered: false,
      dataSort: {
        sortedBy: null,
        sortOrder: null,
      },
      error: '',
    }

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

    if (!returns?.length) return
    let slicedData = []

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
    this.getProfile()
  }

  getProfile = () => {
    const { rootPath } = this.props.runtime
    const profileUrl = fetchPath.getProfile(rootPath)

    fetch(profileUrl)
      .then((res) => res.json())
      .then((response) => {
        if (response.IsUserDefined) {
          this.setState((prevState: any) => ({
            profile: {
              ...prevState.profile,
              Email: response.Email,
              FirstName: response.FirstName,
              Gender: response.Gender,
              IsReturningUser: response.IsReturningUser,
              IsUserDefined: response.IsUserDefined,
              LastName: response.LastName,
              UserId: response.UserId,
            },
          }))

          this.getRequests(response.UserId, false)
        }
      })
      .catch(console.error)
  }

  getRequests(userId: string, resetFilters: boolean) {
    const { filters } = this.state
    const useFilters = resetFilters ? initialFilters : filters
    let where = `__userId=${userId}`

    if (JSON.stringify(useFilters) === JSON.stringify(initialFilters)) {
      this.setState({ isFiltered: false })
    } else {
      this.setState({ isFiltered: true })

      if (useFilters.returnId !== '') {
        where += `__id="*${useFilters.returnId}*"`
      }

      if (filters.sequenceNumber !== '') {
        where += `__sequenceNumber=${filters.sequenceNumber}`
      }

      let startDate = '1970-01-01'
      let endDate = currentDate()

      if (useFilters.fromDate !== '' || useFilters.toDate !== '') {
        startDate =
          useFilters.fromDate !== ''
            ? filterDate(useFilters.fromDate)
            : startDate
        endDate =
          useFilters.toDate !== ''
            ? filterDate(useFilters.toDate)
            : filterDate(useFilters.fromDate)

        where += `__createdIn between ${startDate} AND ${endDate}`
      }

      if (useFilters.status !== '') {
        where += `__status="${requestsStatuses[useFilters.status]}"`
      }
    }

    if (where.startsWith('__')) {
      where = where.substring(2)
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
      this.getRequests(this.state.profile.UserId, false)
    }
  }

  handleResetFilters() {
    const { profile } = this.state

    this.setState({
      filters: initialFilters,
      tableIsLoading: true,
      isFiltered: false,
    })
    this.getRequests(profile.UserId, true)
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

  getTableSchema() {
    const { formatMessage } = this.props.intl

    return {
      properties: {
        id: {
          title: formatMessage({ id: messages.thRequestNo.id }),
          sortable: true,
          width: 350,
        },
        sequenceNumber: {
          title: formatMessage({ id: messages.sequenceNumber.id }),
          sortable: true,
        },
        dateSubmitted: {
          title: formatMessage({ id: messages.thDate.id }),
          cellRenderer: ({ cellData }) => {
            return beautifyDate(cellData)
          },
          sortable: true,
        },
        status: {
          title: formatMessage({ id: messages.thStatus.id }),
          sortable: true,
          cellRenderer: ({ cellData }) => {
            return <div>{renderStatusIcon(cellData)}</div>
          },
          width: 200,
        },
        actions: {
          width: 150,
          title: formatMessage({ id: messages.actions.id }),
          cellRenderer: ({ rowData }) => {
            return (
              <div>
                <Link href={`#/my-returns/details/${rowData.id}`}>
                  {formatMessage({ id: messages.view.id })}
                </Link>
              </div>
            )
          },
        },
      },
    }
  }

  handleKeypress(e) {
    if (e.key === 'Enter') {
      this.handleApplyFilters()
    }
  }

  render() {
    const { formatMessage } = this.props.intl
    const {
      paging,
      tableIsLoading,
      filters,
      slicedData,
      emptyStateLabel,
      isFiltered,
      error,
    } = this.state

    const statusLabel =
      filters.status !== ''
        ? formatMessage({
            id: `returns.status${getStatusTranslation(filters.status)}`,
          })
        : formatMessage({ id: messages.statusAllStatuses.id })

    if (error) {
      return <div>{error}</div>
    }

    return (
      <div className={styles.myReturnsHolder}>
        <div className={`${styles.listTitle}`}>
          <h2 className={`w-auto ${styles.listTitleText}`}>
            {formatMessage({ id: messages.pageTitle.id })}{' '}
            <span className={styles.totalRequestsNumber}>
              {slicedData.length} {formatMessage({ id: messages.total.id })}
            </span>
          </h2>
        </div>
        <div className={`flex justify-end mb3 ${styles.addNewList}`}>
          <Button variation="primary" size="small" href="#/my-returns/add">
            {formatMessage({ id: messages.addReturn.id })}
          </Button>
        </div>
        <div className={`flex items-center ${styles.filterList}`}>
          <div
            className={`ma2 ${styles.filterColumn} ${styles.filterColumnReturnId}`}
          >
            <Input
              placeholder={formatMessage({
                id: messages.thRequestNo.id,
              })}
              onKeyPress={(e) => {
                this.handleKeypress(e)
              }}
              size="small"
              onChange={(e) => this.filterReturnId(e.target.value)}
              value={filters.returnId}
            />
          </div>
          <div className={`flex items-center ${styles.filterList}`}>
            <div
              className={`ma2 ${styles.filterColumn} ${styles.filterColumnReturnId}`}
            >
              <Input
                placeholder={formatMessage({
                  id: messages.sequenceNumber.id,
                })}
                onKeyPress={(e) => {
                  this.handleKeypress(e)
                }}
                size="small"
                onChange={(e) => this.filterSequenceNumber(e.target.value)}
                value={filters.sequenceNumber}
              />
            </div>
          </div>
          <div
            className={`ma2 ${styles.filterColumn} ${styles.filterColumnFromDate}`}
          >
            <DatePicker
              placeholder={formatMessage({
                id: messages.filterFromDate.id,
              })}
              onKeyPress={(e) => {
                this.handleKeypress(e)
              }}
              locale="en-GB"
              size="small"
              onChange={(value) => this.filterFromDate(value)}
              value={filters.fromDate}
            />
          </div>
          <div
            className={`ma2 ${styles.filterColumn} ${styles.filterColumnToDate}`}
          >
            <DatePicker
              placeholder={formatMessage({
                id: messages.filterToDate.id,
              })}
              locale="en-GB"
              size="small"
              onChange={(value) => this.filterToDate(value)}
              value={filters.toDate}
            />
          </div>
          <div
            className={`ma2 ${styles.filterColumn} ${styles.filterColumnStatus}`}
          >
            <ActionMenu
              label={statusLabel}
              align="right"
              buttonProps={{
                variation: 'secondary',
                size: 'small',
              }}
              options={[
                {
                  label: formatMessage({
                    id: messages.statusAllStatuses.id,
                  }),
                  onClick: () => this.filterStatus(''),
                },
                {
                  label: formatMessage({
                    id: messages.statusNew.id,
                  }),
                  onClick: () => this.filterStatus('new'),
                },
                {
                  label: formatMessage({
                    id: messages.statusApproved.id,
                  }),
                  onClick: () => this.filterStatus('approved'),
                },
                {
                  label: formatMessage({
                    id: messages.statusPendingVerification.id,
                  }),
                  onClick: () => this.filterStatus('pendingVerification'),
                },
                {
                  label: formatMessage({
                    id: messages.statusPartiallyApproved.id,
                  }),
                  onClick: () => this.filterStatus('partiallyApproved'),
                },
                {
                  label: formatMessage({
                    id: messages.statusDenied.id,
                  }),
                  onClick: () => this.filterStatus('denied'),
                },
                {
                  label: formatMessage({
                    id: messages.statusRefunded.id,
                  }),
                  onClick: () => this.filterStatus('refunded'),
                },
              ]}
            />
          </div>
          <div
            className={`ma2 ${styles.filterColumn} ${styles.filterColumnActionApply}`}
          >
            <Button size="small" onClick={() => this.handleApplyFilters()}>
              {formatMessage({
                id: messages.filterResults.id,
              })}
            </Button>
          </div>
          {isFiltered ? (
            <div
              className={`ma2 ${styles.filterColumn} ${styles.filterColumnActionReset}`}
            >
              <ButtonWithIcon
                variation="secondary"
                size="small"
                onClick={() => this.handleResetFilters()}
              >
                {formatMessage({
                  id: messages.clearFilters.id,
                })}
              </ButtonWithIcon>
            </div>
          ) : null}
        </div>
        <Table
          fullWidth
          loading={tableIsLoading}
          items={slicedData}
          emptyStateLabel={formatMessage({ id: emptyStateLabel })}
          schema={this.getTableSchema()}
          pagination={{
            onNextClick: this.handleNextClick,
            onPrevClick: this.handlePrevClick,
            textShowRows: formatMessage({
              id: messages.tableShowRows.id,
            }),
            textOf: formatMessage({
              id: messages.tableOf.id,
            }),
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
      </div>
    )
  }
}

export default injectIntl(withRuntimeContext(MyReturnsPage))
