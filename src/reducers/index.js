const initialState = {
    isLoading: false
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

    return state;
}

export default rootReducer;