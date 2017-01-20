import { ADD_ORDER, ORDERS_RECEIVED } from '../constants/ActionTypes'
import { normalizeOrders } from '../lib/DataTransform'
import _ from 'lodash'

export function createOrderAjax(playlistId, addressId, scheduleId) {
  let playlistOrderData = {
    playlist_id: playlistId,
    address_id: addressId,
    delivery_schedule_id: scheduleId
  }

  return $.ajax({
    url: '/orders/batch_create',
    method: 'post',
    data: {
      playlist_order: playlistOrderData
    }
  }).promise()
}

export function createOrder(playlistId, addressId, scheduleId) {
  return (dispatch, getState) => {
    return createOrderAjax(playlistId, addressId, scheduleId)
      .then(json => {
        json = normalizeOrders(json)

        return dispatch(addOrder(json))
      })
  }
}

export function addOrder(order) {
  return {
    type: ADD_ORDER,
    payload: order
  }
}

function getUpcomingOrdersWithItemsAjax() {
  return $.ajax({
    url: '/orders/orders_with_items',
    method: 'get'
  }).promise()
}

export function getUpcomingOrdersWithItems() {
  return dispatch => {
    return getUpcomingOrdersWithItemsAjax()
      .then(json => {
        json = normalizeOrders(json)

        return dispatch(ordersReceived(json))
      })
  }
}

function ordersReceived(orders) {
  return {
    type: ORDERS_RECEIVED,
    payload: orders
  }
}
