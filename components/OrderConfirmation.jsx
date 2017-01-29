import { Grid, Row, Col, Button, ButtonGroup, Image, DropdownButton } from 'react-bootstrap'
import BlurButton from './lib/BlurButton'
import _ from 'lodash'
import moment from 'moment'

export default class OrderConfirmation extends React.Component {
  _onClickMyDashboard() {
    this.props.pushPath('/')
  }

  restaurantListClicked() {
    this.props.pushPath('/dashboard')
  }

  orderClicked() {
    this.props.pushPath('/orders')
  }

  componentDidMount() {
    const { ordersHaveItems, getUpcomingOrdersWithItems } = this.props

    if(ordersHaveItems == false) {
      getUpcomingOrdersWithItems()
    }
  }

  render() {
    const { playlist, showOrder, ordersHaveItems, orders, allItems } = this.props

    if(!orders || !ordersHaveItems) {
      return (
        <Col className="order-confirm-col">
          <Row>
            <Col xs={12} className="section-col">
              <h3>You have no orders for this week.</h3>
              <Row className="no-order-buttons">
                {showOrder ? (
                  <Col xs={3}>
                    <BlurButton onClick={this.orderClicked.bind(this)}>Order</BlurButton>
                  </Col>
                ) : null}
                <Col xs={9}>
                  <BlurButton onClick={this.restaurantListClicked.bind(this)}>Restaurant List</BlurButton>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      )
    }
    // const preTaxTotal = _.sumBy(allItems, (item) => parseFloat(item.price))
    const preTaxTotal = _.sumBy(allItems, (element) => _.sumBy(element.items, (item) => parseFloat(item.price)))
    
    const tax = preTaxTotal * 0.08 // California sales tax
    const userFee = (preTaxTotal + tax) * 0.20  // Dabawallah user fee
    const allMealItemsTotal = (Math.round((preTaxTotal + tax + userFee) * 100) / 100).toFixed(2)

    return (
      <Col xs={12} style={styles.col}>
        <p><span style={styles.playlistName}>{playlist.name}</span> has been ordered.</p>
        <p style={styles.scheduleP}>Your food will be arriving on...</p>
        { _.values(orders).map((order, index) => {
          let curMoment = moment(new Date(order.deliverAt))
          let restaurantName = allItems[index].restaurantName;

          return (
            <Row style={styles.deliveryDaysRow} key={index}>
              <Col xs={5}>
                <p>{curMoment.format('dddd')} {curMoment.format('L')} at {curMoment.format('LT')}</p>
              </Col>
              <Col xs={4}>
                { _.values(order.items).map((item, index) => {
                  return (
                    <p key={index}>{item.name}</p>
                  )
                })}
                <p><b>from {restaurantName}</b></p>
              </Col>
              <Col xs={3}>
                <p>
                ${ _.sumBy(order.items, item => parseFloat(item.price)).toFixed(2) }
                </p>
              </Col>
            </Row>
          )
        })}
        <Row>
          <Col xsOffset={8} xs={4}>
            <p>Items Total: ${preTaxTotal.toFixed(2)}</p>
            <p>Sales Tax: ${tax.toFixed(2)}</p>
            <p>Dabawallah Fee: ${userFee.toFixed(2)}</p>
          </Col>
        </Row>
        <Row>
          <Col xsOffset={8} xs={4} style={styles.totalCol}>
            <p>TOTAL ${allMealItemsTotal}</p>
          </Col>
        </Row>
        <Row>
          <Col xsOffset={8} xs={4}>
            <BlurButton style={styles.dashboardButton} onClick={this._onClickMyDashboard.bind(this)}>Back to My Dashboard</BlurButton>
          </Col>
        </Row>
      </Col>
    )
  }
}

let styles = {
  col: {
    paddingTop: '2em',
    fontSize: '1.3em',
    paddingLeft: '2em'
  },
  playlistName: {
    fontWeight: 'bold'
  },
  scheduleP: {
    paddingTop: '0.5em',
    paddingBottom: '0.5em',
    fontWeight: 'bold'
  },
  deliveryDaysRow: {
    paddingBottom: '1.5em'
  },
  totalCol: {
    fontWeight: 'bold'
  },
  dashboardButton: {
    backgroundColor: '#4fd2c2',
    paddingLeft: '15px',
    paddingRight: '15px',
    lineHeight: '14px',
    color: 'white',
    borderRadius: '15px',
    boxShadow: '0px 4px 10px -5px rgba(0, 0, 0, 0.75)',
    maxHeight: '2.1em',
    width: '100%'
  }
}
