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

  if (!url) return console.warn('No url specified.');


  var builtUrl = buildUrl(url, queryParams);
  qwest({
    url: builtUrl,
    method: 'get',
    error(err) { return deferred.reject(err); },
    success(res) { return deferred.resolve(res); },
  });

  return deferred.promise;
}
// END PULL OUT

function makeCombinator(uniqueKey) {
  return (base, additional) => {
    return _.chain(base || [])
            .concat(additional)
            .uniq(false, obj => { return obj[uniqueKey]; })
            .value();
  };
}

let BasicDatasource = React.createClass({
  propTypes: {
    /**
     * Resource URL
     */
    url: React.PropTypes.string,
    /**
     * Determine if the store should populate itself initially
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
    /**
     * uniqueKey
     */
    uniqueKey: React.PropTypes.string.isRequired,
    /*
     * Parent wrapper
     */
    wrapper: React.PropTypes.string,

    /*
    * style class names for component
    */
    className: React.PropTypes.string,

    onData: React.PropTypes.func,
  },

  getDefaultProps() {
    return {
      autoPopulate: true,
      queryParams: {},
      serializer(data) {
        return data;
      },
      uniqueKey: 'id',
      wrapper: 'div',
      className:'',
    };
  },

  getInitialState() {
    return {
      data: [],
    };
  },

  componentWillMount() {
    this.props.autoPopulate && this.populate(this.props);
    this.limitedPopulate = _.throttle(this.populate, 750);
    this.combineData = makeCombinator(this.props.uniqueKey);
  },

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.queryParams, this.props.queryParams)) {
      this.limitedPopulate(nextProps);
    }

    if(nextProps.url != this.props.url){
      this.setState({data:[]},()=>{
        this.populate(nextProps);
      })
    }

  },

  render() {
    const{
      className,
      } = this.props;
    const Wrapper = this.props.wrapper;

    let children = this.cloneWithProps(this.state);
    return (
      <Wrapper className={className}>
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

    if(!url) return false;

    apiRequest(url, queryParams)
    .then((rawData) => {
      const{
        onData,
        } = this.props;
      let data = combineData(this.state.data, serializer(rawData));
      this.setState({data},()=>{
        onData && onData(data);
      });
    })
    .fail((err) => {
      console.error('BasicDatasource failed!', url, err);
    });
  },
});

module.exports = BasicDatasource;
