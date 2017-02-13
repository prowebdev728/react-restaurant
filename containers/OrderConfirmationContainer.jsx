import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import * as OrderActions from '../actions/orders'
import OrderConfirmation from '../components/OrderConfirmation'

function mapStateToProps(state) {
  let {
    currentUserId,
    orders,
    meals,
    mealsLoadedForPlaylist,
    users,
    playlists,
    schedules
  } = state

  let playlist = null
  let showOrder = false
  let ordersHaveItems = false
  let allItems = []

  if(_.isEmpty(orders) == false) {
    let order = _.last(_.values(orders))
    playlist = playlists[order.playlistId]

    ordersHaveItems = order.items ? true : false

    allItems = _.concat(..._.map(orders, order => {
      let restaurant = state.restaurants[order.restaurantId]

      return {items: order.items, restaurantName: restaurant.name};
    }))
  }

  if(_.isEmpty(playlists) == false) {
    showOrder = true
  }

  return {
    user: users[currentUserId],
    playlist, showOrder, ordersHaveItems, orders, allItems
  };
}

function mapDispatchToProps(dispatch) {
  // hook in pushPath
  let actions = _.extend({}, OrderActions, {pushPath: push})
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderConfirmation)
