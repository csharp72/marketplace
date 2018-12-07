export default (state, action) => {
  state = state || {};
  state.counter = state.counter || 0;
  switch (action.type) {
    case 'INCREMENT':
      return state.counter + 1
    case 'DECREMENT':
      return state.counter - 1
    default:
      return state
  }
}