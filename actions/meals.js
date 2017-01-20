import { MEALS_RECEIVED, MEALS_LOADED_FOR_PLAYLIST, ADD_ITEM, REMOVE_ITEM, CLEAR_ITEMS, ADD_MEAL, REMOVE_MEAL } from '../constants/ActionTypes'
import { normalizeMeals } from '../lib/DataTransform'
import _ from 'lodash'

export function mealsReceived(meals) {
  return {
    type: MEALS_RECEIVED,
    payload: meals
  }
}

export function addMeal(meal) {
  return {
    type: ADD_MEAL,
    payload: meal
  }
}

export function removeMeal(meal) {
  return {
    type: REMOVE_MEAL,
    payload: meal
  }
}

export function mealsLoadedForPlaylist(playlistId) {
  return {
    type: MEALS_LOADED_FOR_PLAYLIST,
    payload: playlistId
  }
}

export function addItemToCurrentMeal(itemId) {
  return {
    type: ADD_ITEM,
    payload: itemId
  }
}

export function removeItemFromCurrentMeal(itemId) {
  return {
    type: REMOVE_ITEM, 
    payload: itemId
  }
}

export function clearItemsFromCurrentMeal() {
  return {
    type: CLEAR_ITEMS
  }
}


export function getMealsForPlaylist(playlistId) {
  return dispatch => {
    return $.ajax({
      url: `/playlists/${playlistId}/playlist_meals`,
      method: 'get'
    })
    .then(json => {
      json = normalizeMeals(json)
      dispatch(mealsReceived(json))

      return dispatch(mealsLoadedForPlaylist(playlistId))
    }).promise()
  }
}

export function createMeal(playlistId, items) {
  let mealData = {
    playlist_meal_items_attributes: items.map((item) => {
      return {item_id: item.id}
    })
  }

  return dispatch => {
    return $.ajax({
      url: `/playlists/${playlistId}/playlist_meals`,
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        playlist_meal: mealData
      })
    }).done(json => {
      json = normalizeMeals([json])
      dispatch(clearItemsFromCurrentMeal())

      return dispatch(addMeal(json))
    })
  }
}
export function deleteMeal(meal) {
  return dispatch => {
    return $.ajax({
      url: `/playlists/${meal.playlistId}/playlist_meals/${meal.id}`,
      method: 'DELETE'
    }).done(json => {
      dispatch(removeMeal(meal))
    })
  }
}
