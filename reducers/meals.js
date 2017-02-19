import { MEALS_RECEIVED, MEALS_LOADED_FOR_PLAYLIST, ADD_MEAL, REMOVE_MEAL, ADD_ITEM, REMOVE_ITEM, CLEAR_ITEMS } from '../constants/ActionTypes'
import _ from 'lodash'

export function meals(state = {}, action) {
  switch(action.type) {
    case MEALS_RECEIVED:
      let meals = action.payload
      return _.extend({}, state, meals)
    case ADD_MEAL:
      return _.extend({}, state, action.payload)
    case REMOVE_MEAL:
      return _.omit(state, action.payload.id)
    default:
      return state
  }
}

export function mealsLoadedForPlaylist(state={}, action) {
  switch(action.type) {
    case MEALS_LOADED_FOR_PLAYLIST:
      return _.extend({}, state, {[action.payload]: true})
    default:
      return state
  }
}

export function currentMealItems(state={}, action) {
  switch(action.type) {
    case ADD_ITEM:
      if(state[action.payload] >= 0) { // already exists
        return state
      }

      let orderOfItem = Object.keys(state).length
      return _.extend({}, state, {[action.payload]: orderOfItem})
    case REMOVE_ITEM:
      let items = _.extend({}, state)
      let deletedOrder = items[action.payload]
      delete items[action.payload]

      // update order!
      let itemsToShiftOrder = _.pickBy(items, order => order > deletedOrder)
      Object.keys(itemsToShiftOrder).forEach(key => {
        itemsToShiftOrder[key]--
      })

      return { ...items, ...itemsToShiftOrder }
    case CLEAR_ITEMS:
      return {}
  }
  return state;
}
