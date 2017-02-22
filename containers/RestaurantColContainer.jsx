import { bindActionCreators } from 'redux'
import RestaurantCol from '../components/RestaurantCol'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import * as RestaurantActions from '../actions/restaurants'
import * as ItemActions from '../actions/items'
import * as MealActions from '../actions/meals'
import _ from 'lodash'

function mapStateToProps(state) {
  let { routing, restaurants, itemsLoadedForRestaurants, itemsForTypeLoadedForRestaurants, itemtypesLoadedForRestaurants, currentMealItems, chosenItemTypeIndex } = state;
  let { pathname } = routing.locationBeforeTransitions
  let restaurantId = parseInt(pathname.split('/').reverse()[0])
  let restaurant = restaurants[restaurantId]

  let itemsLoaded = itemsLoadedForRestaurants[restaurantId]
  let items = []
  let itemtypesLoaded = itemtypesLoadedForRestaurants[restaurantId]
  let itemtypes = []
  let itemsForTypeLoaded = itemsForTypeLoadedForRestaurants[restaurantId]
  let itemsForType = []
  
  if(itemsLoaded) {
    items = _.filter(state.items, (item) => item.restaurantId == restaurantId)
    items = _.sortBy(items, (item) => item.name)
  }

  if(itemtypesLoaded) {
    itemtypes = _.sortBy(state.itemtypes, (itemtype) => itemtype.name)
  }

  if(itemsForTypeLoaded) {
    itemsForType = _.filter(state.itemsForType, (item) => item.restaurantId == restaurantId)
    itemsForType = _.sortBy(itemsForType, (item) => item.name)
  }

  // mealItems will be like: {[itemId]: true} for rendering purposes
  let mealItems = _.fromPairs(Object.keys(currentMealItems).map((itemId) => [itemId, true]))
  let meals = Object.keys(state.meals).map((mealId) => state.meals[mealId])

  return {
    restaurant,
    itemsLoaded,
    items,
    itemtypesLoaded,
    itemtypes,
    itemsForTypeLoaded,
    itemsForType,
    mealItems,
    meals,
    chosenItemTypeIndex
  }
}

function mapDispatchToProps(dispatch) {
  // hook in pushPath
  let actions = _.extend({},
    RestaurantActions, ItemActions, MealActions, {pushPath:push})
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(RestaurantCol)
