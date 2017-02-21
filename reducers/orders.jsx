import { ADD_ORDER, ORDERS_RECEIVED } from '../constants/ActionTypes'
import _ from 'lodash'

export function orders(state={}, action) {
  switch(action.type) {
    case ORDERS_RECEIVED:
      return _.extend({}, action.payload)
    case ADD_ORDER:
      return _.extend({}, state, action.payload)
    default:
      return state
  }
}
