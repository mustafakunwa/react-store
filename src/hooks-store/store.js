import { useState, useEffect } from 'react';

let globalState = {};
let listners = [];
let actions = {};

export const useStore = (shouldListen = true) => {
    const setState = useState(globalState)[1];

    const dispatch = (actionIdentifier, payload) => {
        const newState = actions[actionIdentifier](globalState, payload);
        globalState = { ...globalState, ...newState };

        for (let listner of listners) {
            listner(globalState);
        }
    }

    useEffect(() => {
        if (shouldListen)
            listners.push(setState);

        return () => {
            if (shouldListen)
                listners = listners.filter(li => li !== setState);
        }
    }, [setState, shouldListen]);

    return [
        globalState,
        dispatch
    ]

}

export const initStore = (userActions, initalState) => {
    if (initalState) {
        globalState = { ...globalState, ...initalState };
    }

    actions = { ...actions, ...userActions };
}