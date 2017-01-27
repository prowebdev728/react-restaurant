import { Grid, Row, Col, Button, ButtonGroup } from 'react-bootstrap';
import MenuColContainer from '../containers/MenuColContainer';
import TopNavContainer from '../containers/TopNavContainer';
import CurrentPlaylistColContainer from '../containers/RestaurantCol/CurrentPlaylistColContainer'
import FooterRow from './FooterRow';
import ReactDOM from 'react-dom'

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props)

    this.state = { scrollWithPaddingTop: '25px' }
  }
  componentDidMount() {
    $.material.init();
  }
  render() {
    let { children, routes } = this.props
    let { scrollWithPaddingTop } = this.state

    let componentPath = (routes.length >= 2) ? routes[1].path : null

    let showPlaylistCol

    switch(componentPath) {
      case '/orders':
      case '/order-confirmation': 
        showPlaylistCol = false
        break;
      default:
        showPlaylistCol = true
    }

    return (
      <Grid>
        <TopNavContainer />
        <Row className="content-row">
          <MenuColContainer {...this.props} />
          <Col className="scroll-col" onScroll={this._onScroll.bind(this)}>
            <Row ref="scroll-row">
              { React.Children.map(children, (element) => React.cloneElement(element, {...this.props})) }
              { showPlaylistCol ? <CurrentPlaylistColContainer style={{paddingTop:scrollWithPaddingTop}} /> : null }
            </Row>
          </Col>
        </Row>
        <FooterRow />
      </Grid>
    );
  }
  _onScroll(evt) {
    let scrollTop = evt.target.scrollTop

    scrollTop += 25
    if(scrollTop < 25) scrollTop = 25


    if(scrollTop < $('.scroll-col .col-xs-8').height() - window.innerHeight + 300) {
      this._setScrollWithPaddingState(scrollTop )
    } else {
      this._setScrollWithPaddingState(25)
    }
  }
  _setScrollWithPaddingState(scrollTop) {
    if(this.scrollTimeout) {
      clearTimeout(this.scrollTimeout)
      this.scrollTimer = null
    }

    this.scrollTimeout = setTimeout(() => {
      this.setState({
        scrollWithPaddingTop: `${scrollTop}px`
      })
    }, 50)
  }

}
