import * as types from '../types'
import _ from 'lodash'
// SEARCH RESULTS
export default (state = null, action) => {
    switch (action.type) {
        case types.SET_FULL_TEXT:
            return action.payload
        case types.DELETE_FULL_TEXT:
            return null
        default:
            return state
    }
}
