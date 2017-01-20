import { ITEMS_RECEIVED, ITEMS_LOADED_FOR_RESTAURANT, ITEMTYPES_RECEIVED, ITEMTYPES_LOADED_FOR_RESTAURANT, ITEMSFORTYPE_RECEIVED, ITEMS_FOR_TYPE_LOADED_FOR_RESTAURANT } from '../constants/ActionTypes'
import { normalizeItems } from '../lib/DataTransform'


export function itemsReceived(items) {
  return {
    type: ITEMS_RECEIVED,
    payload: items
  }
}

export function itemsLoadedForRestaurants(restaurantId) {
  return {
    type: ITEMS_LOADED_FOR_RESTAURANT,
    payload: restaurantId
  }
}

export function itemtypesReceived(itemtypes) {
  return {
    type: ITEMTYPES_RECEIVED,
    payload: itemtypes
  }
}

export function itemtypesLoadedForRestaurants(restaurantId) {
  return {
    type: ITEMTYPES_LOADED_FOR_RESTAURANT,
    payload: restaurantId
  }
}

export function itemsForTypeReceived(itemsForType) {
  return {
    type: ITEMSFORTYPE_RECEIVED,
    payload: itemsForType
  }
}

export function itemsForTypeLoadedForRestaurants(restaurantId) {
  return {
    type: ITEMS_FOR_TYPE_LOADED_FOR_RESTAURANT,
    payload: restaurantId
  }
}

export function getItemsForRestaurantId(restaurantId, itemtypeId) {
  return dispatch => {
    
    return $.ajax({
      url: `/restaurants/${restaurantId}/items/${itemtypeId}`,
      method: 'get'
    })
    .then(json => {
      json = normalizeItems(json)
      dispatch(itemsLoadedForRestaurants(restaurantId))
      dispatch(itemsForTypeLoadedForRestaurants(restaurantId))
      dispatch(itemsReceived(json))

      return dispatch(itemsForTypeReceived(json))
    }).promise()
  }
}

export function getEligibleItemTypes(restaurantId) {
  return dispatch => {
    return $.ajax({
      url: `/restaurants/${restaurantId}/item_types`,
      method: 'get'
    })
    .then(json => {
      json = normalizeItems(json)

      dispatch(itemtypesLoadedForRestaurants(restaurantId))

      return dispatch(itemtypesReceived(json))
    }).promise()
  }
}
