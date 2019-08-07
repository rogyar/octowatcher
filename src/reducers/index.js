const initialState = {
    isLoading: false,
    messages: []
};

function rootReducer(state = initialState, action) {
    if (action.type === 'SET_LOADING') {
        return Object.assign({}, state, {
            isLoading: true
        });
    }
    if (action.type === 'UNSET_LOADING') {
        return Object.assign({}, state, {
            isLoading: false
        });
    }
    if (action.type === 'ADD_MESSAGE') {
        return Object.assign({}, state, {
            messages: state.messages.concat(action.payload)
        });
    }
    if (action.type === 'CLEAR_MESSAGES') {
        return Object.assign({}, state, {
            messages: []
        });
    }

    return state;
}

export default rootReducer;