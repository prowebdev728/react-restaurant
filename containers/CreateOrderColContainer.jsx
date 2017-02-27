import { bindActionCreators } from 'redux'
import CreateOrderCol from '../components/CreateOrderCol'
import { connect } from 'react-redux'
import _ from 'lodash'
import { selectPlaylistId } from '../actions/playlists'
import { getMealsForPlaylist } from '../actions/meals'
import * as AddressesActions from '../actions/addresses'
import { updatePaymentInfo, getPaymentInfo, resetPaymentInfo } from '../actions/users'
import * as SchedulesActions from '../actions/schedules'
import * as OrdersActions from '../actions/orders'
import { populatePlaylistFromState } from '../lib/PlaylistHelper'

function mapStateToProps(state) {
  let playlists = _.sortBy(_.values(state.playlists), ['id'])
  let lastSelectedPlaylistId = state.lastSelectedPlaylistId

  let addresses = _.sortBy(_.values(state.addresses), ['created_at']).reverse()



  const populatedPlaylists = _.map(playlists, (playlist) => {
    return populatePlaylistFromState(Object.assign({}, playlist), state)
  })

  let user = _.values(state.users)[0]
  let hasPaymentInfo = user.stripeId ? true : false

  let schedules = _.sortBy(_.values(state.schedules), ['created_at']).reverse()

  return {
    playlists: populatedPlaylists,
    lastSelectedPlaylistId,
    addresses,
    addressesLoaded: state.addressesLoaded,
    lastSelectedAddressId: state.lastSelectedAddressId,
    paymentInfo: state.paymentInfo,
    hasPaymentInfo,
    paymentInfoError: state.paymentInfoError,
    schedules,
    schedulesLoaded: state.schedulesLoaded,
    lastSelectedScheduleId: state.lastSelectedScheduleId,
    deliveryTimes: state.deliveryTimes
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(_.extend({}, { selectPlaylistId, getMealsForPlaylist, updatePaymentInfo, getPaymentInfo, resetPaymentInfo }, AddressesActions, SchedulesActions, OrdersActions), dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateOrderCol)
