import { ITEMS_RECEIVED, ITEMS_LOADED_FOR_RESTAURANT, ITEMTYPES_RECEIVED, ITEMTYPES_LOADED_FOR_RESTAURANT, ITEMS_FOR_TYPE_LOADED_FOR_RESTAURANT, ITEMSFORTYPE_RECEIVED } from '../constants/ActionTypes'
import _ from 'lodash'
import Immutable from 'immutable'

export function items(state = {}, action) {
  switch(action.type) {
    case ITEMS_RECEIVED:
      let items = action.payload
      // return _.extend({}, state, items)
      return _.extend({}, state, items)
      
    default:
      return state
  }
}

export function itemsLoadedForRestaurants(state = {}, action) {
  switch(action.type) {
    case ITEMS_LOADED_FOR_RESTAURANT:
      return _.extend({}, state, {[action.payload]: true})
      // return action.payload ? action.payload : state;
    default:
      return state
  }
}

export function itemtypes(state = {}, action) {
  switch(action.type) {
    case ITEMTYPES_RECEIVED:
      let itemtypes = action.payload
      return _.extend({}, state, itemtypes)
      // return action.payload ? action.payload : state;
    default:
      return state
  }
}

export function itemtypesLoadedForRestaurants(state = {}, action) {
  switch(action.type) {
    case ITEMTYPES_LOADED_FOR_RESTAURANT:
      return _.extend({}, state, {[action.payload]: true})
      // return action.payload ? action.payload : state;
    default:
      return state
  }
}

export function itemsForType(state = {}, action) {
  switch(action.type) {
    case ITEMSFORTYPE_RECEIVED:
      return action.payload ? action.payload : state
    default:
      return state
  }
}

export function itemsForTypeLoadedForRestaurants(state = {}, action) {
  switch(action.type) {
    case ITEMS_FOR_TYPE_LOADED_FOR_RESTAURANT:
      return _.extend({}, state, {[action.payload]: true})
      // return action.payload ? action.payload : state;
    default:
      return state
  }
}