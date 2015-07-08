let React = require('react');

// PULL OUT
let q = require('q');
let _ = require('underscore');
let qwest = require('reqwest');

function buildUrl(url, queryParams = {}) {
  const paramKeys = Object.keys(queryParams);

  if (!Object.keys(queryParams)) { return url; }

  return _.reduce(paramKeys, (memo, key, index) => {
    let formattedKey;
    let value = queryParams[key];
    let prefix = index === 0 ? '?' : '&';

    formattedKey = `${prefix}${key}=${value}`;
    return `${memo}${formattedKey}`;
  }, url);
}

function apiRequest(url, queryParams) {
  let deferred = q.defer();

  if (!url) {
    return console.warn('No url specified.');
  }
  var builtUrl = buildUrl(url, queryParams);
  console.log("URL Built", url, builtUrl);
  qwest({
    url: builtUrl,
    method: 'get',
    error(err) { return deferred.reject(err); },
    success(res) { return deferred.resolve(res); },
  });

  return deferred.promise;
}
// END PULL OUT

let BasicDatasource = React.createClass({
  propTypes: {
    /**
     * Resource URL
     */
    url: React.PropTypes.string,
    /**
     * Determine if the store should populate himself initially
     */
    autoPopulate: React.PropTypes.bool,
    /**
     * Query parameters
     */
    queryParams: React.PropTypes.object,
    /**
     * Children
     */
    children: React.PropTypes.array,
    /**
     * Serializer
     */
    serializer: React.PropTypes.func,
    /*
     * Parent wrapper
     */
    wrapper: React.PropTypes.string,
  },

  getDefaultProps() {
    return {
      autoPopulate: true,
      queryParams: {},
      serializer(data) {
        return data;
      },
      wrapper: 'div',
    };
  },

  getInitialState() {
    return {
      data: null,
    };
  },

  componentWillMount() {
    this.props.autoPopulate && this.populate(this.props);
  },

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps, this.props)) {
      this.populate(nextProps);
    }
  },

  render() {
    const Wrapper = this.props.wrapper;

    let children = this.cloneWithProps(this.state);

    return (
      <Wrapper>
        {children}
      </Wrapper>
    );
  },

  cloneWithProps(state) {
    let children = React.Children.map(this.props.children, child => {
      if (!child) { return null; }
      return React.cloneElement(child, state);
    }, this.context);

    return children;
  },

  populate(props=this.props) {
    const { url, queryParams, serializer } = props;

    apiRequest(url, queryParams)
    .then((rawData) => {
      let data = serializer(rawData);
      this.setState({data});
    })
    .fail((err) => {
      console.error('BasicDatasource failed!', url, err);
    });
  },
});

module.exports = BasicDatasource;
