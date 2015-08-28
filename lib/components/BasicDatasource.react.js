let React = require('react');

// PULL OUT
let q = require('q');
let _ = require('underscore');
let qwest = require('reqwest');

function apiRequest(url, queryParams) {
  let deferred = q.defer();

  if (!url) return console.warn('No url specified.');

  qwest({
    url: url,
    method: 'get',
    data: queryParams,
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
    const { url, queryParams, serializer, uniqueKey } = props;
    let combineData = makeCombinator(uniqueKey);
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
