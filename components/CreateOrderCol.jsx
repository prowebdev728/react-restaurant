import { Input } from 'react-bootstrap'
import { Row, Col } from 'react-bootstrap'
import { Link } from 'react-router'
import _ from 'lodash'
import moment from 'moment'
import BlurButton from './lib/BlurButton'
import SpinnerRow from './lib/SpinnerRow'
import PlaylistCol from './CreateOrderCol/PlaylistCol'
import AddressCol from './CreateOrderCol/AddressCol'
import ScheduleCol from './CreateOrderCol/ScheduleCol'
import AddAddressRow from './CreateOrderCol/AddAddressRow'
import PaymentInfoCol from './CreateOrderCol/PaymentInfoCol'
import AddDeliveryScheduleCol from './CreateOrderCol/AddDeliveryScheduleCol'


export default class RestaurantCol extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      editingAddress: false,
      editingDeliverySchedule: false,
      editingPaymentInfo: false,
      errorMessage: null,
      placingOrder: false
    }
  }

  componentWillReceiveProps(nextProps) {
    let props = this.props

    if(props.lastSelectedPlaylistId < 0 && nextProps.lastSelectedPlaylistId >= 0) {
      this.setState({errorMessage: null})
    } else if(props.lastSelectedAddressId < 0 && nextProps.lastSelectedAddressId >= 0) {
      this.setState({errorMessage: null})
    } else if(props.lastSelectedScheduleId < 0 && nextProps.lastSelectedScheduleId >= 0) {
      this.setState({errorMessage: null})
    }
  }

  componentWillMount() {
  }

  componentDidUpdate() {
    $.material.init();
  }

  componentDidMount() {
    $.material.init();

    let {playlists, lastSelectedPlaylistId, addresses, lastSelectedAddressId, schedules, lastSelectedScheduleId, hasPaymentInfo, paymentInfo } = this.props

    if(playlists.length > 0 && lastSelectedPlaylistId == -1) { // select the first one
      this.props.selectPlaylistId(playlists[0].id)
    }

    // if not loaded, load playlist meals
    _.each(playlists, (playlist) => {
      if(!playlist.mealsLoaded) {
        this.props.getMealsForPlaylist(playlist.id)
      }
    })

    // load addresses
    if(!this.props.addressesLoaded) {
      this.props.getAddresses()
    }

    // load schedules
    if(!this.props.schedulesLoaded) {
      this.props.getSchedules()
    }

    // load payment info if need-be
    if(hasPaymentInfo && _.isEmpty(paymentInfo)) {
      this.props.getPaymentInfo();
    }

    // select the first one in delivery address list
    if (addresses.length > 0 && lastSelectedAddressId == -1 ) {
      this.props.selectAddressId(addresses[0].id)
    }

    // select the first one in schedule list
    if (schedules.length > 0 && lastSelectedScheduleId == -1 ) {
      this.props.selectScheduleId(schedules[0].id)
    }
  }

  shouldComponentUpdate(nextProps, nextState) {

    return true
  }

  _getNextDeliveryDate() {
    // taken from: http://stackoverflow.com/questions/27403585/getting-the-monday-and-friday-of-next-week
    const curDate = new Date()
    let diff = curDate.getDate() - curDate.getDay() + 1;
    if (curDate.getDay() == 0)
        diff -= 7;
    diff += 7; // ugly hack to get next monday instead of current one

    const nextMonday = moment(new Date(curDate.setDate(diff)))
    return nextMonday.format('l')
  }
  
  render() {
    let {
      playlists,
      lastSelectedPlaylistId,
      addresses,
      lastSelectedAddressId,
      schedules,
      lastSelectedScheduleId,
      hasPaymentInfo,
      paymentInfo,
      user
    } = this.props

    let {
      editingAddress,
      editingDeliverySchedule,
      editingPaymentInfo,
      errorMessage,
      placingOrder
    } = this.state

    return (
      <Col xs={12} className="create-order-col">
        <Row>
          <Col xs={12} className="section-col">
            <h2>Select a Playlist</h2>

            <Row className="create-order-row">
              {playlists.map((playlist, index) => {
                return (
                  <PlaylistCol playlist={playlist}
                              selected={playlist.id == lastSelectedPlaylistId}
                              selectPlaylistId={this.props.selectPlaylistId}
                              key={index} />
                  )
                })
              }
            </Row>
          </Col>
        </Row>

        <Row>
          <Col xs={12} className="section-col">
            <Row>
              <Col xs={6}>
                <h2>When should we deliver?</h2>
              </Col>
              <Col xs={6}>
                <h2 style={{textTransform:'none'}}>The next available delivery is {this._getNextDeliveryDate()}</h2>
              </Col>
            </Row>
              { editingDeliverySchedule ? (
                <Row className="add-delivery-schedule-row">
                  <AddDeliveryScheduleCol {...this.props} stopEditing={this.stopEditing.bind(this, 'deliverySchedule')} />
                </Row>
              ) : (
                <Row className="create-order-row">
                  {schedules.map((schedule, index) => {
                    return <ScheduleCol schedule={schedule}
                                selected={schedule.id == lastSelectedScheduleId}
                                selectScheduleId={this.props.selectScheduleId}
                                key={index} />
                  })}
                  <Col xs={12}>
                    <BlurButton onClick={this.onClickAddSchedule.bind(this)}>Add Schedule</BlurButton>
                  </Col>
                </Row>
              )}
          </Col>
        </Row>


        <Row>
          <Col xs={12} className="section-col">
            <h2>Where should we deliver?</h2>
            { editingAddress ? (
              <AddAddressRow stopEditing={this.stopEditing.bind(this, 'address')}
                             createAddress={this.props.createAddress}/>
            ) : (
              <Row className="create-order-row">
                {addresses.map((address, index) => {
                  return <AddressCol address={address}
                              selected={address.id == lastSelectedAddressId}
                              selectAddressId={this.props.selectAddressId}
                              key={index} />
                })}
                <Col xs={12}>
                  <BlurButton onClick={this.onClickAddAddress.bind(this)}>Add Address</BlurButton>
                </Col>
              </Row>
            )}
          </Col>
        </Row>
        <Row>
          <Col xs={12} className="payment-col">
            <h2>YOUR PAYMENT INFORMATION</h2>
            { hasPaymentInfo && !editingPaymentInfo ? (
              <Row className="payment-row">
                <Col xs={12}>
                  <Row>
                    <Col xs={9}>
                      <h3 className="stand-alone">
                        <span>Your payment info is on file </span>
                        {_.isEmpty(paymentInfo) ? null :
                          <span style={{fontSize:'0.75em'}}>{` (${paymentInfo.brand} ending in ${paymentInfo.last4})`}</span> }
                      </h3>
                    </Col>
                    <Col xs={3}>
                      <BlurButton onClick={this._onClickUpdatePaymentInfo.bind(this)}>Update Payment Info</BlurButton>
                    </Col>
                  </Row>
                </Col>
              </Row>
            ): (
              <Row className="payment-row">
                 <PaymentInfoCol
                    showCancel={hasPaymentInfo ? true : false}
                    stopEditing={this.stopEditing.bind(this, 'paymentInfo')}
                    updatePaymentInfo={this._updatePaymentInfo.bind(this)}
                    paymentInfoError={this.props.paymentInfoError}
                    user={user}
                  />
              </Row>
            )}
          </Col>
        </Row>

        <Row>
          <Col xs={12} className="place-order-col">
            { errorMessage ? (
              <Row className="error-row">
                <Col xs={12}>
                  <p>{errorMessage}</p>
                </Col>
              </Row>
            ) : null}

            <BlurButton onClick={this.onClickPlaceOrder.bind(this)} disabled={placingOrder}>Place Order</BlurButton>
          </Col>
        </Row>
      </Col>
    )
  }

  onClickAddAddress() {
    this.setState({editingAddress: true})
  }

  onClickAddSchedule() {
    this.setState({editingDeliverySchedule: true})
  }

  _onClickUpdatePaymentInfo() {
    this.setState({editingPaymentInfo: true})
  }

  stopEditing(type) {
    if(type == 'address') {
      this.setState({editingAddress: false})
    } else if(type == 'paymentInfo') {
      this.setState({editingPaymentInfo: false})
    } else {
      this.setState({editingDeliverySchedule: false})
    }
  }

  onClickPlaceOrder() {
    let playlistId = this.props.lastSelectedPlaylistId
    let addressId = this.props.lastSelectedAddressId
    let scheduleId = this.props.lastSelectedScheduleId

    if(playlistId < 0) {
      this.setState({errorMessage: 'Please select a playlist'})
      return
    }
    if(addressId < 0) {
      this.setState({errorMessage: 'Please select an address'})
      return
    }
    if(scheduleId < 0) {
      this.setState({errorMessage: 'Please select a schedule'})
      return
    }

    this.setState({errorMessage:null, placingOrder: true})

    //TODO: pass errorMessage as a prop via redux
    this.props.createOrder(playlistId, addressId, scheduleId)
      .done(() => {
        this.props.pushPath('/order-confirmation')
      })
      .fail((response) => {
        let errorMessage = response.responseJSON[0]

        this.setState({errorMessage: errorMessage, placingOrder: false})
      })
  }

  _updatePaymentInfo(tokenId) {
    this.props.resetPaymentInfo()

    this.props.updatePaymentInfo(tokenId)
      .then(() => this.props.getPaymentInfo())

    this.setState({editingPaymentInfo: false})
  }
}
