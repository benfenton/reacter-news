var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

var HeaderComponent = React.createClass({
  mixins:[PureRenderMixin],
  render: function() {
    var name = this.props.name;

    var showNewStyle = { display: 'none'};
    var submittedNewStyle = { display: 'none' };
    var threadsNewStyle = { display: 'none' };

    switch(name) {
      case 'shownew':
        showNewStyle = { display: 'inline-block' };
        break;
      case 'submitted':
        var query = this.props.queryString.id;
        var queryTitle = query + '\'s submissions';
        submittedNewStyle = { display: 'inline-block' };
        break;
      case 'threads':
        var query = this.props.queryString.id;
        var queryTitle = query + '\'s comments';
        threadsNewStyle = { display: 'inline-block'};
        break;
      default:
        break;
    };

    return (
      <header>
        <ul>
          <li>
            <div className='logo'>
              <span><a href='#'>R</a></span>
            </div>
          </li>
          <li>
            <div className='heading'>
              <Link to='news'>Reacter News</Link>
            </div>
          </li>
          <li>
            <ul className='nested-list'>
              <li><Link to='newest'>new</Link></li>
              <li>|</li>
              <li><Link to='newcomments'>comments</Link></li>
              <li>|</li>
              <li><Link to='show'>show</Link></li>
              <li>|</li>
              <li><Link to='ask'>ask</Link></li>
              <li>|</li>
              <li><Link to='jobs'>jobs</Link></li>
              <li style={showNewStyle}>|</li>
              <li style={showNewStyle}><Link to='shownew'>shownew</Link></li>
              <li style={submittedNewStyle}>|</li>
              <li style={submittedNewStyle}><Link to='submitted' query={{ id: query }}>{queryTitle}</Link></li>
              <li style={threadsNewStyle}>|</li>
              <li style={threadsNewStyle}><Link to='threads' query={{ id: query }}>{queryTitle}</Link></li>
            </ul>
          </li>
        </ul>
      </header>
    )
  }
});

module.exports = HeaderComponent;