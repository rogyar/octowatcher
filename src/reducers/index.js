const initialState = {
    isLoading: true
};

function rootReducer(state = initialState, action) {
    if (action.type === 'SET_LOADING') {
        return Object.assign({}, state, {
            loading: true
        });
    }
    if (action.type === 'UNSET_LOADING') {
        return Object.assign({}, state, {
            loading: false
        });
    }

    return state;
}

export default rootReducer;