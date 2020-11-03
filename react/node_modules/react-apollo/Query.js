"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var PropTypes = tslib_1.__importStar(require("prop-types"));
var apollo_client_1 = require("apollo-client");
var parser_1 = require("./parser");
var component_utils_1 = require("./component-utils");
var lodash_isequal_1 = tslib_1.__importDefault(require("lodash.isequal"));
var shallowEqual_1 = tslib_1.__importDefault(require("./utils/shallowEqual"));
var ts_invariant_1 = require("ts-invariant");
function observableQueryFields(observable) {
    var fields = {
        variables: observable.variables,
        refetch: observable.refetch.bind(observable),
        fetchMore: observable.fetchMore.bind(observable),
        updateQuery: observable.updateQuery.bind(observable),
        startPolling: observable.startPolling.bind(observable),
        stopPolling: observable.stopPolling.bind(observable),
        subscribeToMore: observable.subscribeToMore.bind(observable),
    };
    return fields;
}
var Query = (function (_super) {
    tslib_1.__extends(Query, _super);
    function Query(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.hasMounted = false;
        _this.lastRenderedResult = null;
        _this.startQuerySubscription = function () {
            if (_this.querySubscription)
                return;
            _this.querySubscription = _this.queryObservable.subscribe({
                next: function (result) {
                    if (_this.lastRenderedResult &&
                        _this.lastRenderedResult.loading === result.loading &&
                        _this.lastRenderedResult.networkStatus === result.networkStatus &&
                        shallowEqual_1.default(_this.lastRenderedResult.data, result.data)) {
                        return;
                    }
                    _this.updateCurrentData();
                },
                error: function (error) {
                    _this.resubscribeToQuery();
                    if (!error.hasOwnProperty('graphQLErrors'))
                        throw error;
                    _this.updateCurrentData();
                },
            });
        };
        _this.removeQuerySubscription = function () {
            if (_this.querySubscription) {
                _this.querySubscription.unsubscribe();
                delete _this.lastRenderedResult;
                delete _this.querySubscription;
            }
        };
        _this.updateCurrentData = function () {
            _this.handleErrorOrCompleted();
            if (_this.hasMounted)
                _this.forceUpdate();
        };
        _this.handleErrorOrCompleted = function () {
            var result = _this.queryObservable.currentResult();
            var data = result.data, loading = result.loading, error = result.error;
            var _a = _this.props, onCompleted = _a.onCompleted, onError = _a.onError;
            if (onCompleted && !loading && !error) {
                onCompleted(data);
            }
            else if (onError && !loading && error) {
                onError(error);
            }
        };
        _this.getQueryResult = function () {
            var result = { data: Object.create(null) };
            Object.assign(result, observableQueryFields(_this.queryObservable));
            if (_this.props.skip) {
                result = tslib_1.__assign({}, result, { data: undefined, error: undefined, loading: false });
            }
            else {
                var currentResult = _this.queryObservable.currentResult();
                var loading = currentResult.loading, partial = currentResult.partial, networkStatus = currentResult.networkStatus, errors = currentResult.errors;
                var error = currentResult.error;
                if (errors && errors.length > 0) {
                    error = new apollo_client_1.ApolloError({ graphQLErrors: errors });
                }
                var fetchPolicy = _this.queryObservable.options.fetchPolicy;
                Object.assign(result, { loading: loading, networkStatus: networkStatus, error: error });
                var previousData = _this.lastRenderedResult ? _this.lastRenderedResult.data : {};
                if (loading) {
                    Object.assign(result.data, previousData, currentResult.data);
                }
                else if (error) {
                    Object.assign(result, {
                        data: (_this.queryObservable.getLastResult() || {}).data,
                    });
                }
                else if (fetchPolicy === 'no-cache' &&
                    Object.keys(currentResult.data).length === 0) {
                    result.data = previousData;
                }
                else {
                    var partialRefetch = _this.props.partialRefetch;
                    if (partialRefetch &&
                        currentResult.data !== null &&
                        typeof currentResult.data === 'object' &&
                        Object.keys(currentResult.data).length === 0 &&
                        partial &&
                        fetchPolicy !== 'cache-only') {
                        Object.assign(result, { loading: true, networkStatus: apollo_client_1.NetworkStatus.loading });
                        result.refetch();
                        _this.lastRenderedResult = result;
                        return result;
                    }
                    Object.assign(result.data, currentResult.data);
                }
            }
            if (!_this.querySubscription) {
                var oldRefetch_1 = result.refetch;
                result.refetch = function (args) {
                    if (_this.querySubscription) {
                        return oldRefetch_1(args);
                    }
                    else {
                        return new Promise(function (r, f) {
                            _this.refetcherQueue = { resolve: r, reject: f, args: args };
                        });
                    }
                };
            }
            setTimeout(function () {
                if (_this.queryObservable.resetQueryStoreErrors) {
                    _this.queryObservable.resetQueryStoreErrors();
                }
                else {
                    var _a = _this.queryObservable, queryManager = _a.queryManager, queryId = _a.queryId;
                    var queryStore = queryManager.queryStore.get(queryId);
                    if (queryStore) {
                        queryStore.networkError = null;
                        queryStore.graphQLErrors = [];
                    }
                }
            });
            result.client = _this.client;
            _this.lastRenderedResult = result;
            return result;
        };
        _this.client = component_utils_1.getClient(props, context);
        _this.initializeQueryObservable(props);
        return _this;
    }
    Query.prototype.fetchData = function () {
        if (this.props.skip)
            return false;
        var _a = this.props, children = _a.children, ssr = _a.ssr, displayName = _a.displayName, skip = _a.skip, client = _a.client, onCompleted = _a.onCompleted, onError = _a.onError, partialRefetch = _a.partialRefetch, opts = tslib_1.__rest(_a, ["children", "ssr", "displayName", "skip", "client", "onCompleted", "onError", "partialRefetch"]);
        var fetchPolicy = opts.fetchPolicy;
        if (ssr === false)
            return false;
        if (fetchPolicy === 'network-only' || fetchPolicy === 'cache-and-network') {
            fetchPolicy = 'cache-first';
        }
        var observable = this.client.watchQuery(tslib_1.__assign({}, opts, { fetchPolicy: fetchPolicy }));
        if (this.context && this.context.renderPromises) {
            this.context.renderPromises.registerSSRObservable(this, observable);
        }
        var result = this.queryObservable.currentResult();
        return result.loading ? observable.result() : false;
    };
    Query.prototype.componentDidMount = function () {
        this.hasMounted = true;
        if (this.props.skip)
            return;
        this.startQuerySubscription();
        if (this.refetcherQueue) {
            var _a = this.refetcherQueue, args = _a.args, resolve = _a.resolve, reject = _a.reject;
            this.queryObservable.refetch(args)
                .then(resolve)
                .catch(reject);
        }
    };
    Query.prototype.componentWillReceiveProps = function (nextProps, nextContext) {
        if (nextProps.skip && !this.props.skip) {
            this.queryObservable.resetLastResults();
            this.removeQuerySubscription();
            return;
        }
        var nextClient = component_utils_1.getClient(nextProps, nextContext);
        if (shallowEqual_1.default(this.props, nextProps) && this.client === nextClient) {
            return;
        }
        if (this.client !== nextClient) {
            this.client = nextClient;
            this.removeQuerySubscription();
            this.queryObservable = null;
        }
        if (this.props.query !== nextProps.query) {
            this.queryObservable.resetLastResults();
            this.removeQuerySubscription();
        }
        this.updateQuery(nextProps);
        if (nextProps.skip)
            return;
        this.startQuerySubscription();
    };
    Query.prototype.componentWillUnmount = function () {
        this.removeQuerySubscription();
        this.hasMounted = false;
    };
    Query.prototype.componentDidUpdate = function (prevProps) {
        var isDiffRequest = !lodash_isequal_1.default(prevProps.query, this.props.query) ||
            !lodash_isequal_1.default(prevProps.variables, this.props.variables);
        if (isDiffRequest) {
            this.handleErrorOrCompleted();
        }
    };
    Query.prototype.render = function () {
        var _this = this;
        var context = this.context;
        var finish = function () { return _this.props.children(_this.getQueryResult()); };
        if (context && context.renderPromises) {
            return context.renderPromises.addQueryPromise(this, finish);
        }
        return finish();
    };
    Query.prototype.extractOptsFromProps = function (props) {
        this.operation = parser_1.parser(props.query);
        ts_invariant_1.invariant(this.operation.type === parser_1.DocumentType.Query, "The <Query /> component requires a graphql query, but got a " + (this.operation.type === parser_1.DocumentType.Mutation ? 'mutation' : 'subscription') + ".");
        var displayName = props.displayName || 'Query';
        return tslib_1.__assign({}, props, { displayName: displayName, context: props.context || {}, metadata: { reactComponent: { displayName: displayName } } });
    };
    Query.prototype.initializeQueryObservable = function (props) {
        var opts = this.extractOptsFromProps(props);
        this.setOperations(opts);
        if (this.context && this.context.renderPromises) {
            this.queryObservable = this.context.renderPromises.getSSRObservable(this);
        }
        if (!this.queryObservable) {
            this.queryObservable = this.client.watchQuery(opts);
        }
    };
    Query.prototype.setOperations = function (props) {
        if (this.context.operations) {
            this.context.operations.set(this.operation.name, {
                query: props.query,
                variables: props.variables,
            });
        }
    };
    Query.prototype.updateQuery = function (props) {
        if (!this.queryObservable) {
            this.initializeQueryObservable(props);
        }
        else {
            this.setOperations(props);
        }
        this.queryObservable.setOptions(this.extractOptsFromProps(props))
            .catch(function () { return null; });
    };
    Query.prototype.resubscribeToQuery = function () {
        this.removeQuerySubscription();
        var lastError = this.queryObservable.getLastError();
        var lastResult = this.queryObservable.getLastResult();
        this.queryObservable.resetLastResults();
        this.startQuerySubscription();
        Object.assign(this.queryObservable, { lastError: lastError, lastResult: lastResult });
    };
    Query.contextTypes = {
        client: PropTypes.object,
        operations: PropTypes.object,
        renderPromises: PropTypes.object,
    };
    Query.propTypes = {
        client: PropTypes.object,
        children: PropTypes.func.isRequired,
        fetchPolicy: PropTypes.string,
        notifyOnNetworkStatusChange: PropTypes.bool,
        onCompleted: PropTypes.func,
        onError: PropTypes.func,
        pollInterval: PropTypes.number,
        query: PropTypes.object.isRequired,
        variables: PropTypes.object,
        ssr: PropTypes.bool,
        partialRefetch: PropTypes.bool,
        returnPartialData: PropTypes.bool,
    };
    return Query;
}(React.Component));
exports.default = Query;
//# sourceMappingURL=Query.js.map