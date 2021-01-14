import React, { Component, useEffect } from "react";
import styles from "../styles.css";
import { FormattedMessage } from "react-intl";
import {
  ActionMenu,
  Button,
  ButtonWithIcon,
  DatePicker,
  Input,
  Link,
  Table
} from "vtex.styleguide";
import {
  beautifyDate,
  currentDate,
  filterDate,
  requestsStatuses,
  schemaNames,
  schemaTypes,
  FormattedMessageFixed,
  sortColumns,
  order,
  getStatusTranslation,
  renderStatusIcon,
  getProductStatusTranslation,
  intlArea
} from "../common/utils";

import { fetchPath, fetchHeaders, fetchMethod } from "../common/fetch";

const tableLength = 15;

const initialFilters = {
  returnId: "",
  fromDate: "",
  toDate: "",
  status: ""
};

class MyReturnsPage extends Component<{}, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      profile: {
        Email: "",
        FirstName: "",
        Gender: "",
        IsReturningUser: false,
        IsUserDefined: false,
        LastName: "",
        UserId: ""
      },
      emptyStateLabel: (
        <FormattedMessage id={"store/my-returns.nothingToShow"} />
      ),
      filters: initialFilters,
      returns: [],
      orderedItems: [],
      slicedData: [],
      paging: {
        total: 0,
        currentPage: 1,
        perPage: tableLength,
        currentFrom: 1,
        currentTo: tableLength
      },
      tableIsLoading: true,
      isFiltered: false,
      dataSort: {
        sortedBy: null,
        sortOrder: null
      },
      error: ""
    };

    this.sortRequestIdASC = this.sortRequestIdASC.bind(this);
    this.sortRequestIdDESC = this.sortRequestIdDESC.bind(this);
    this.sortDateSubmittedASC = this.sortDateSubmittedASC.bind(this);
    this.sortDateSubmittedDESC = this.sortDateSubmittedDESC.bind(this);
    this.sortStatusASC = this.sortStatusASC.bind(this);
    this.sortStatusDESC = this.sortStatusDESC.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.handleNextClick = this.handleNextClick.bind(this);
    this.handlePrevClick = this.handlePrevClick.bind(this);
    this.goToPage = this.goToPage.bind(this);
  }

  sortRequestIdASC(a, b) {
    return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
  }
  sortRequestIdDESC(a, b) {
    return a.id < b.id ? 1 : a.id > b.id ? -1 : 0;
  }
  sortDateSubmittedASC(a, b) {
    return a.dateSubmitted < b.dateSubmitted
      ? -1
      : a.dateSubmitted > b.dateSubmitted
      ? 1
      : 0;
  }
  sortDateSubmittedDESC(a, b) {
    return a.dateSubmitted < b.dateSubmitted
      ? 1
      : a.dateSubmitted > b.dateSubmitted
      ? -1
      : 0;
  }
  sortStatusASC(a, b) {
    return a.status < b.status ? -1 : a.status > b.status ? 1 : 0;
  }
  sortStatusDESC(a, b) {
    return a.status < b.status ? 1 : a.status > b.status ? -1 : 0;
  }

  handleSort({ sortOrder, sortedBy }) {
    const { returns } = this.state;
    if (returns && returns.length) {
      let slicedData = [];
      if (sortedBy === sortColumns.id) {
        slicedData =
          sortOrder === order.asc
            ? returns.slice().sort(this.sortRequestIdASC)
            : returns.slice().sort(this.sortRequestIdDESC);
      }

      if (sortedBy === sortColumns.dateSubmitted) {
        slicedData =
          sortOrder === order.asc
            ? returns.slice().sort(this.sortDateSubmittedASC)
            : returns.slice().sort(this.sortDateSubmittedDESC);
      }
      if (sortedBy === sortColumns.status) {
        slicedData =
          sortOrder === order.asc
            ? returns.slice().sort(this.sortStatusASC)
            : returns.slice().sort(this.sortStatusDESC);
      }

      this.setState({
        slicedData,
        dataSort: {
          sortedBy,
          sortOrder
        }
      });
    }
  }

  hasFiltersApplied() {
    return this.state.isFiltered;
  }

  componentDidMount() {
    this.getProfile();
  }

  getProfile = () => {
    fetch(fetchPath.getProfile)
      .then(response => response.json())
      .then(async response => {
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
              UserId: response.UserId
            }
          }));

          this.getRequests(response.UserId, false);
        }
      });
  };

  getRequests(userId: string, resetFilters: boolean) {
    const { filters } = this.state;
    const useFilters = resetFilters ? initialFilters : filters;
    let where = "__userId=" + userId;

    if (JSON.stringify(useFilters) === JSON.stringify(initialFilters)) {
      this.setState({ isFiltered: false });
    } else {
      this.setState({ isFiltered: true });
    }

    if (useFilters.returnId !== "") {
      where += '__id="*' + useFilters.returnId + '*"';
    }

    let startDate = "1970-01-01";
    let endDate = currentDate();
    if (useFilters.fromDate !== "" || useFilters.toDate !== "") {
      startDate =
        useFilters.fromDate !== ""
          ? filterDate(useFilters.fromDate)
          : startDate;
      endDate =
        useFilters.toDate !== ""
          ? filterDate(useFilters.toDate)
          : filterDate(useFilters.fromDate);

      where += "__dateSubmitted between " + startDate + " AND " + endDate;
    }

    if (useFilters.status !== "") {
      where += '__status="' + requestsStatuses[useFilters.status] + '"';
    }

    if (where.startsWith("__")) {
      where = where.substring(2);
    }

    fetch(
      fetchPath.getDocuments +
        schemaNames.request +
        "/" +
        schemaTypes.requests +
        "/" +
        where,
      {
        method: fetchMethod.get,
        headers: fetchHeaders
      }
    )
      .then(response => response.json())
      .then(returns => {
        if ("error" in returns) {
          this.setState({ error: returns.error });
        } else {
          this.setState(prevState => ({
            returns: returns,
            orderedItems: returns,
            slicedData: returns.length ? returns.slice(0, tableLength) : [],
            tableIsLoading: false,
            paging: {
              ...prevState.paging,
              currentPage: 1,
              currentTo: tableLength,
              currentFrom: 1,
              total: returns.length
            }
          }));
        }
      })
      .catch(err => this.setState({ error: err }));
  }

  filterStatus(status: string) {
    this.setState(prevState => ({
      filters: {
        ...prevState.filters,
        status: status
      }
    }));
  }

  filterReturnId(val: string) {
    this.setState(prevState => ({
      filters: {
        ...prevState.filters,
        returnId: val
      }
    }));
  }

  filterFromDate(val: string) {
    this.setState(prevState => ({
      filters: {
        ...prevState.filters,
        fromDate: val
      }
    }));
    setTimeout(() => {
      this.handleApplyFilters();
    }, 200);
  }
  filterToDate(val: string) {
    this.setState(prevState => ({
      filters: {
        ...prevState.filters,
        toDate: val
      }
    }));
    setTimeout(() => {
      this.handleApplyFilters();
    }, 200);
  }

  handleApplyFilters() {
    const { filters } = this.state;
    if (JSON.stringify(filters) === JSON.stringify(initialFilters)) {
      this.handleResetFilters();
    } else {
      this.getRequests(this.state.profile.UserId, false);
    }
  }

  handleResetFilters() {
    const { profile } = this.state;
    this.setState({
      filters: initialFilters,
      tableIsLoading: true,
      isFiltered: false
    });
    this.getRequests(profile.UserId, true);
  }

  handleNextClick() {
    const { paging, orderedItems } = this.state;
    const newPage = paging.currentPage + 1;
    const itemFrom = paging.currentTo + 1;
    const itemTo = paging.perPage * newPage;
    const data = orderedItems.slice(itemFrom - 1, itemTo);
    this.goToPage(newPage, itemFrom, itemTo, data);
  }

  handlePrevClick() {
    const { paging, orderedItems } = this.state;
    if (paging.currentPage === 0) return;
    const newPage = paging.currentPage - 1;
    const itemFrom = paging.currentFrom - paging.perPage;
    const itemTo = paging.currentFrom - 1;
    const data = orderedItems.slice(itemFrom - 1, itemTo);
    this.goToPage(newPage, itemFrom, itemTo, data);
  }

  goToPage(currentPage, currentItemFrom, currentItemTo, slicedData) {
    this.setState(prevState => ({
      paging: {
        ...prevState.paging,
        currentPage: currentPage,
        currentFrom: currentItemFrom,
        currentTo: currentItemTo
      },
      slicedData
    }));
  }

  getTableSchema() {
    return {
      properties: {
        id: {
          title: <FormattedMessage id={"store/my-returns.thRequestNo"} />,
          sortable: true,
          width: 350
        },
        dateSubmitted: {
          title: <FormattedMessage id={"store/my-returns.thDate"} />,
          cellRenderer: ({ cellData }) => {
            return beautifyDate(cellData);
          },
          sortable: true
        },
        status: {
          title: <FormattedMessage id={"store/my-returns.thStatus"} />,
          sortable: true,
          cellRenderer: ({ cellData }) => {
            return <div>{renderStatusIcon(cellData, intlArea.store)}</div>;
          },
          width: 200
        },
        actions: {
          width: 150,
          title: <FormattedMessage id={"store/my-returns.actions"} />,
          cellRenderer: ({ rowData }) => {
            return (
              <div>
                <Link href={`account#/my-returns/details/` + rowData.id}>
                  <FormattedMessage id={"store/my-returns.view"} />
                </Link>
              </div>
            );
          }
        }
      }
    };
  }

  handleKeypress(e) {
    if (e.key === "Enter") {
      this.handleApplyFilters();
    }
  }

  render() {
    const {
      paging,
      tableIsLoading,
      filters,
      slicedData,
      emptyStateLabel,
      error
    } = this.state;
    const statusLabel =
      filters.status !== "" ? (
        <FormattedMessageFixed
          id={`store/my-returns.status${getStatusTranslation(filters.status)}`}
        />
      ) : (
        <FormattedMessage id={"store/my-returns.statusAllStatuses"} />
      );

    if (error) {
      return <div>{error}</div>;
    }
    return (
      <div className={styles.myReturnsHolder}>
        <div>
          <h2 className={`w-auto`}>
            <FormattedMessage id="store/my-returns.pageTitle" />{" "}
            <span className={styles.totalRequestsNumber}>
              {slicedData.length}{" "}
              <FormattedMessage id="store/my-returns.total" />
            </span>
          </h2>
        </div>
        <div className={`flex justify-end mb3`}>
          <Button
            variation="primary"
            size="small"
            href="/account#/my-returns/add"
          >
            <FormattedMessage id="store/my-returns.addReturn" />
          </Button>
        </div>
        <div className="flex items-center">
          <div className={"ma2"}>
            <FormattedMessage id={"store/my-returns.thRequestNo"}>
              {msg => (
                <Input
                  placeholder={msg}
                  onKeyPress={e => {
                    this.handleKeypress(e);
                  }}
                  size={"small"}
                  onChange={e => this.filterReturnId(e.target.value)}
                  value={filters.returnId}
                />
              )}
            </FormattedMessage>
          </div>
          <div className={"ma2"}>
            <FormattedMessage id={"store/my-returns.filterFromDate"}>
              {msg => (
                <DatePicker
                  placeholder={msg}
                  onKeyPress={e => {
                    this.handleKeypress(e);
                  }}
                  locale={"en-GB"}
                  size={"small"}
                  onChange={value => this.filterFromDate(value)}
                  value={filters.fromDate}
                />
              )}
            </FormattedMessage>
          </div>
          <div className={"ma2"}>
            <FormattedMessage id={"store/my-returns.filterToDate"}>
              {msg => (
                <DatePicker
                  placeholder={msg}
                  locale={"en-GB"}
                  size={"small"}
                  onChange={value => this.filterToDate(value)}
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
                variation: "secondary",
                size: "small"
              }}
              options={[
                {
                  label: (
                    <FormattedMessage id="store/my-returns.statusAllStatuses" />
                  ),
                  onClick: () => this.filterStatus("")
                },
                {
                  label: <FormattedMessage id="store/my-returns.statusNew" />,
                  onClick: () => this.filterStatus("new")
                },
                {
                  label: (
                    <FormattedMessage id="store/my-returns.statusApproved" />
                  ),
                  onClick: () => this.filterStatus("approved")
                },
                {
                  label: (
                    <FormattedMessage id="store/my-returns.statusPendingVerification" />
                  ),
                  onClick: () => this.filterStatus("pendingVerification")
                },
                {
                  label: (
                    <FormattedMessage id="store/my-returns.statusPartiallyApproved" />
                  ),
                  onClick: () => this.filterStatus("partiallyApproved")
                },
                {
                  label: (
                    <FormattedMessage id="store/my-returns.statusDenied" />
                  ),
                  onClick: () => this.filterStatus("denied")
                },
                {
                  label: (
                    <FormattedMessage id="store/my-returns.statusRefunded" />
                  ),
                  onClick: () => this.filterStatus("refunded")
                }
              ]}
            />
          </div>
          <div className={"ma2"}>
            <Button size={"small"} onClick={() => this.handleApplyFilters()}>
              <FormattedMessage id={"store/my-returns.filterResults"} />
            </Button>
          </div>
          {this.hasFiltersApplied() ? (
            <div className={"ma2"}>
              <ButtonWithIcon
                variation="secondary"
                size="small"
                onClick={() => this.handleResetFilters()}
              >
                <FormattedMessage id={"store/my-returns.clearFilters"} />
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
            textShowRows: (
              <FormattedMessage id={"store/my-returns.tableShowRows"} />
            ),
            textOf: <FormattedMessage id={"store/my-returns.tableOf"} />,
            currentItemFrom: paging.currentFrom,
            currentItemTo: paging.currentTo,
            totalItems: paging.total
          }}
          sort={{
            sortedBy: this.state.dataSort.sortedBy,
            sortOrder: this.state.dataSort.sortOrder
          }}
          onSort={this.handleSort}
        />
      </div>
    );
  }
}

export default MyReturnsPage;
