import { bindActionCreators } from 'redux'
import Dashboard from '../components/Dashboard'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import * as PlaylistActions from '../actions/playlists'

function mapStateToProps(state, ownProps) {
  let {
    currentUserId,
    users,
    restaurants,
    playlists,
    routing,
    lastViewedRestaurantId
  } = state

  return {
    user: users[currentUserId],
    restaurants: restaurants,
    playlists: playlists,
    routing: routing,
    lastViewedRestaurantId: lastViewedRestaurantId
  };
}

function mapDispatchToProps(dispatch) {
  // hook in pushPath
  let actions = _.extend({},
    PlaylistActions, {pushPath:push})
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
