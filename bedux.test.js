const requireModule = () => require('./bedux');

beforeEach(() => {
    jest.clearAllMocks()
        .resetModules();
})

test('getState should return current state', () => {
    const { getState } = requireModule();
    
    expect(getState()).toEqual({});
});

test('setState should update the state', () => {
    const { setState, getState } = requireModule();

    const state = {a: 'a'};
    setState(state)

    expect(getState()).toEqual(state);

    const stateUpdate = {b: 'b'};
    setState(stateUpdate);

    expect(getState()).toEqual({...state, ...stateUpdate})
});

test('setState should not update state if receives a promise', () => {
    const { setState, getState } = requireModule();

    const state = {
        a: 'a'
    };
    setState(state)

    setState(new Promise(resolve => resolve()));
    expect(getState()).toEqual(state);
    
    setState(Promise.resolve());
    expect(getState()).toEqual(state);
});

test('subscribeState should add a listener to state updates', () => {
    const { setState, subscribeState } = requireModule();

    const mockCallback = jest.fn();
    
    subscribeState(mockCallback);
    setState({c: 'c'});
    
    expect(mockCallback).toBeCalled();
});

test('subscribePartialState should run listener only when the relevant portion of the state is changed', () => {
    const { setState, subscribePartialState } = requireModule();

    const mockCallback = jest.fn();
    
    subscribePartialState(mockCallback, 'h');
    setState({h: 'h'});
    
    expect(mockCallback).toBeCalled();
});

test('subscribePartialState should not run listener when a non relevant portion of the state is changed', () => {
    const { setState, subscribePartialState } = requireModule();

    const mockCallback = jest.fn();
    
    subscribePartialState(mockCallback, 'i');
    setState({l: 'l'});
    
    expect(mockCallback).not.toBeCalled();
});

test('prevent multiple subscription with the same callback', () => {
    const { setState, subscribeState } = requireModule();

    const mockCallback = jest.fn();
    
    subscribeState(mockCallback);
    subscribeState(mockCallback);    
    setState({c: 'c2'});
    
    expect(mockCallback).toHaveBeenCalledTimes(1);
});

test('unsubscribeState should remove specified listener from state update notifications', () => {
    const { setState, subscribeState, unsubscribeState } = requireModule();

    const mockCallback = jest.fn();

    subscribeState(mockCallback);
    unsubscribeState(mockCallback);

    setState({d: 'd'});

    expect(mockCallback).not.toBeCalled();
});

test('unsubscribePartialState should remove specified listener for given prop from state update notifications', () => {
    const { setState, subscribePartialState, unsubscribePartialState } = requireModule();

    const mockCallback = jest.fn();

    subscribePartialState(mockCallback, 'd');
    unsubscribePartialState(mockCallback, 'd');

    setState({d: 'd'});

    expect(mockCallback).not.toBeCalled();
});

describe('dispatch', () => {
    test('should accept an object', () => {
        const { getState, dispatch } = requireModule();
    
        dispatch({e: 'e'});
    
        expect(getState()).toHaveProperty('e', 'e');
    });
    
    test('should accept a function', () => {
        const { getState, dispatch } = requireModule();
    
        dispatch(() => ({f: 'f'}));
    
        expect(getState()).toHaveProperty('f', 'f');    
    });
    
    test('of a promise should not trigger a state update', () => {
        const { getState, dispatch } = requireModule();
    
        dispatch(Promise.resolve({g: 'g'}));
    
        expect(getState()).not.toHaveProperty('g', 'g');    
    })    
});
