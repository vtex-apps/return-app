/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import React, {Component} from 'react'
import {FormattedMessage} from 'react-intl'
import PropTypes from 'prop-types'
import {FormattedCurrency} from 'vtex.format-currency'
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
import {fetchHeaders, fetchMethod, fetchPath} from '../../common/fetch'

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
    perPage: tableLength
}

class ReturnsTableContent extends Component<any, any> {
    static propTypes = {
        navigate: PropTypes.func
    };
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
            emptyStateLabel: <FormattedMessage id="returns.nothingToShow"/>,
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
        this.setState((prevState) => ({isModalOpen: !prevState.isModalOpen}))
    }

    handleSort({sortOrder, sortedBy}) {
        this.setState({dataSort: {sortedBy, sortOrder}, paging: initialPaging}, this.getRequests);
    }

    componentDidMount() {
        this.getRequests()
    }

    async getRequests() {
      this.setState({tableIsLoading: true})
        const {filters, paging, dataSort} = this.state
        let where = 'type=request'

        if (JSON.stringify(filters) === JSON.stringify(initialFilters)) {
            this.setState({isFiltered: false})
        } else {
          this.setState({isFiltered: true})
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


        const returnsResponse = await fetch(`${fetchPath.getRequests + schemaNames.request}/${paging.page}/${paging.perPage}/${dataSort.sortedBy}/${dataSort.sortOrder}/${where}`);
        const returns = await returnsResponse.json();

        if ('error' in returns) {
            this.setState({error: returns.error})
        } else {
            this.setState({
                returns: returns.data,
                orderedItems: returns,
                slicedData: returns.length ? returns.slice(0, tableLength) : [],
                tableIsLoading: false,
                paging: {
                    ...this.state.paging,
                    total: returns.pagination.total,
                },
            })
        }

        this.setState({tableIsLoading: false})
    }

    getTableSchema() {
        return {
            properties: {
                id: {
                    title: <FormattedMessage id="returns.requestId"/>,
                    sortable: true,
                    width: 350,
                },
                sequenceNumber: {
                    title: <FormattedMessage id="returns.sequenceNumber"/>,
                    sortable: true,
                },
                orderId: {
                    title: <FormattedMessage id="returns.orderId"/>,
                    sortable: true,
                },
                dateSubmitted: {
                    title: <FormattedMessage id="returns.submittedDate"/>,
                    cellRenderer: ({cellData}) => {
                        return beautifyDate(cellData)
                    },
                    sortable: true,
                },
                status: {
                    title: <FormattedMessage id="returns.status"/>,
                    sortable: true,
                    width: 200,
                    cellRenderer: ({cellData}) => {
                        return <div>{renderStatusIcon(cellData)}</div>
                    },
                },
                actions: {
                    width: 150,
                    title: <FormattedMessage id="returns.actions"/>,
                    cellRenderer: ({rowData}) => {
                        return (
                            <div>
                                <Button
                                    variation="tertiary"
                                    onClick={() => {
                                        this.handleViewRequest(rowData.id)
                                    }}
                                >
                                    <IconGrid/>
                                </Button>
                                <Button
                                    variation="tertiary"
                                    onClick={() => {
                                        this.props.navigate({to: `/admin/app/returns/${rowData.id}/details`})
                                    }}
                                >
                                    <IconVisibilityOn/>
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
        const {filters} = this.state

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
    const {paging} = this.state;
    paging.page = Number(paging.page) + 1;

    const currentItemFrom = Number(this.state.currentItemFrom) + Number(paging.perPage);
    const currentItemTo = Number(this.state.currentItemTo) + Number(paging.perPage);

    this.setState(
        {paging, currentItemFrom, currentItemTo},
        this.getRequests
    )
  }

  handlePrevClick() {
    const {paging} = this.state;

    if (paging.page === 0) return;
    paging.page = Number(paging.page) - 1;
    const currentItemFrom = Number(this.state.currentItemFrom) - Number(paging.perPage);
    const currentItemTo = Number(this.state.currentItemTo) - Number(paging.perPage);

    this.setState(
        {paging, currentItemFrom, currentItemTo},
        this.getRequests
    )
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
                this.setState({selectedRequestProducts: products})
                this.handleModalToggle()
            })
            .catch((err) => this.setState({error: err}))
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
            currentItemTo
        } = this.state

        const statusLabel =
            filters.status !== '' ? (
                <FormattedMessageFixed
                    id={`returns.status${getStatusTranslation(filters.status)}`}
                />
            ) : (
                <FormattedMessage id="returns.statusAllStatuses"/>
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
                                    label: <FormattedMessage id="returns.statusAllStatuses"/>,
                                    onClick: () => this.filterStatus(''),
                                },
                                {
                                    label: <FormattedMessage id="returns.statusNew"/>,
                                    onClick: () => this.filterStatus('new'),
                                },
                                {
                                    label: <FormattedMessage id="returns.statusApproved"/>,
                                    onClick: () => this.filterStatus('approved'),
                                },
                                {
                                    label: (
                                        <FormattedMessage id="returns.statusPendingVerification"/>
                                    ),
                                    onClick: () => this.filterStatus('pendingVerification'),
                                },
                                {
                                    label: (
                                        <FormattedMessage id="returns.statusPartiallyApproved"/>
                                    ),
                                    onClick: () => this.filterStatus('partiallyApproved'),
                                },
                                {
                                    label: <FormattedMessage id="returns.statusDenied"/>,
                                    onClick: () => this.filterStatus('denied'),
                                },
                                {
                                    label: <FormattedMessage id="returns.statusRefunded"/>,
                                    onClick: () => this.filterStatus('refunded'),
                                },
                            ]}
                        />
                    </div>
                    <div className="ma2">
                        <Button size="small" onClick={() => this.handleApplyFilters()}>
                            <FormattedMessage id="returns.filterResults"/>
                        </Button>
                    </div>
                    {isFiltered ? (
                        <div className="ma2">
                            <ButtonWithIcon
                                variation="secondary"
                                size="small"
                                onClick={() => this.handleResetFilters()}
                            >
                                <FormattedMessage id="returns.clearFilters"/>
                            </ButtonWithIcon>
                        </div>
                    ) : null}
                </div>
                <Table
                    fullWidth
                    loading={tableIsLoading}
                    items={returns}
                    emptyStateLabel={emptyStateLabel}
                    schema={this.getTableSchema()}
                    pagination={{
                        onNextClick: this.handleNextClick,
                        onPrevClick: this.handlePrevClick,
                        textShowRows: <FormattedMessage id="returns.tableShowRows"/>,
                        textOf: <FormattedMessage id="returns.tableOf"/>,
                        currentItemFrom: currentItemFrom,
                        currentItemTo: currentItemTo,
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
                                        <FormattedMessage id="returns.skuId"/>
                                    </th>
                                    <th>
                                        <FormattedMessage id="returns.product"/>
                                    </th>
                                    <th>
                                        <FormattedMessage id="returns.unitPrice"/>
                                    </th>
                                    <th>
                                        <FormattedMessage id="returns.quantity"/>
                                    </th>
                                    <th>
                                        <FormattedMessage id="returns.price"/>
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {selectedRequestProducts.map((product: any) => (
                                    <tr key={product.skuId}>
                                        <td>{product.skuId}</td>
                                        <td>{product.skuName}</td>
                                        <td>
                                            <FormattedCurrency value={product.unitPrice / 100}/>
                                        </td>
                                        <td>{product.quantity}</td>
                                        <td>
                                            <FormattedCurrency value={product.totalPrice / 100}/>
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
