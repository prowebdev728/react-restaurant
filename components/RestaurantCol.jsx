import RestaurantDetailsRow from './RestaurantCol/RestaurantDetailsRow'
import ItemsRow from './RestaurantCol/ItemsRow'
import ItemtypesRow from './RestaurantCol/ItemtypesRow'
import BlurButton from './lib/BlurButton'
import SpinnerRow from './lib/SpinnerRow'
import { Row, Col } from 'react-bootstrap'
import { Link } from 'react-router'
import _ from 'lodash'


export default class RestaurantCol extends React.Component {
  constructor(props) {
    super(props)
  }
  componentWillMount() {
    let restaurant = this.props.restaurant
    this.props.viewRestaurantId(restaurant.id)  // mark this restaurant as viewed in store
  }
  componentDidMount() {
    $.material.init()
  }
  shouldComponentUpdate(nextProps, nextState) {
    let props = this.props
    let state = this.state

    if(_.isEqual(props.restaurant, nextProps.restaurant) &&
       _.isEqual(props.items, nextProps.items) &&
       _.isEqual(props.itemtypes, nextProps.itemtypes) &&
       _.isEqual(props.itemsForType, nextProps.itemsForType) &&
       _.isEqual(props.mealItems, nextProps.mealItems) &&
       _.isEqual(state, nextState)) {
         return false
    }
    return true
  }
  render() {
    // TODO: find restaurant if it's there.  if not, show loader / load restaurant
    let restaurant = this.props.restaurant

    let itemsLoaded = this.props.itemsLoaded
    let itemtypesLoaded = this.props.itemtypesLoaded
    let itemsForTypeLoaded = this.props.itemsForTypeLoaded

    if(!itemtypesLoaded) {
      this.props.getEligibleItemTypes(this.props.restaurant.id)
    }  

    if(!itemsLoaded || !itemsForTypeLoaded || this.props.itemsForType.length == 0) {
      if(!this.props.itemtype)
      {
        if (this.props.itemtypes.length > 0) {
          this.props.getItemsForRestaurantId(this.props.restaurant.id, this.props.itemtypes[0].id)  
        }
        
      }
      else {
        this.props.getItemsForRestaurantId(this.props.restaurant.id, this.props.itemtype.id)
      }
    }
    
    return (
      <Col xs={8} className="restaurant-col">
        <Row>
          <Col xs={12} className="header-col">
            <BlurButton onClick={() => this.props.pushPath('/') } delay={250}><p className="title">Back to Restaurant List</p></BlurButton>
          </Col>
        </Row>
        <Row className="no-padding-top">
          <Col xs={12} className="restaurant-main-col">
            <RestaurantDetailsRow restaurant={restaurant} {...this.props} />
            { itemtypesLoaded ?
                <ItemtypesRow
                  restaurant={restaurant}
                  itemtypes={this.props.itemtypes} 
                  getItemsForRestaurantId={this.props.getItemsForRestaurantId} /> : <SpinnerRow /> }
            { itemsLoaded ?
                <ItemsRow
                  restaurant={restaurant}
                  items={this.props.items}
                  itemsForType={this.props.itemsForType}
                  mealItems={this.props.mealItems}
                  addItemToCurrentMeal={this.props.addItemToCurrentMeal}
                  removeItemFromCurrentMeal={this.props.removeItemFromCurrentMeal} /> : <SpinnerRow /> }
          </Col>
        </Row>
      </Col>
    )
  }
}
