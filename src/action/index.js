export function setLoading() {
    return { type: 'SET_LOADING' }
}

export function unsetLoading() {
    return { type: 'UNSET_LOADING' }
}

export function addMessage(payload) {
    return { type: "ADD_MESSAGE", payload }
}

export function clearMessages() {
    return { type: "CLEAR_MESSAGES"}
}