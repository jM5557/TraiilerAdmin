import React, { createContext, useReducer } from "react";
import { Collection, Video } from "../types";

type AppState = {
    collectionId: number | null,
    title: string,
    slug: string,
    categoryId: number,
    videos: Video[],
    submitted: boolean,
    removedVideos: string[]
}

export type Action =
    { type: 'SET_COLLECTION_ID', payload: AppState['collectionId'] }
    | { type: 'SET_TITLE', payload: AppState['title'] }
    | { type: 'SET_SLUG', payload: AppState['slug'] }
    | { type: 'SET_CATEGORY_ID', payload: AppState['categoryId'] }
    | { type: 'SET_VIDEOS', payload: AppState['videos'] }
    | { type: 'SET_SUBMITTED', payload: AppState['submitted'] }
    | { type: 'SET_REMOVED_VIDEOS', payload: AppState['removedVideos'] }
    | { type: 'RESET_STATE', payload: null };

const initialState: AppState = {
    collectionId: null,
    title: "",
    slug: "",
    categoryId: 0,
    videos: [],
    submitted: false,
    removedVideos: []
}

const reducer = (
    state: AppState = initialState,
    action: Action
): AppState => {
    switch (action.type) {
        case 'SET_COLLECTION_ID':
            return {
                ...state,
                collectionId: action.payload
            }
        case 'SET_TITLE':
            return {
                ...state,
                title: action.payload
            }
        case 'SET_SLUG':
            return {
                ...state,
                slug: action.payload
            }
        case 'SET_CATEGORY_ID':
            return {
                ...state,
                categoryId: action.payload
            }
        case 'SET_VIDEOS':
            return {
                ...state,
                videos: action.payload
            }
        case 'SET_SUBMITTED':
            return {
                ...state,
                submitted: action.payload
            }
        case 'SET_REMOVED_VIDEOS':
            return {
                ...state,
                removedVideos: action.payload
            }
        case 'RESET_STATE':
            return initialState;
        default:
            return state;
    }
}

interface CollectionFormProviderProps {
    children: React.ReactNode
}

const CollectionFormContext = createContext<{
    state: AppState,
    dispatch: React.Dispatch<Action>
}>({
    state: initialState,
    dispatch: () => {}
});

const CollectionFormProvider = ({ children }: CollectionFormProviderProps) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <CollectionFormContext.Provider
            value = {{ state, dispatch, }}
        >
            { children }
        </CollectionFormContext.Provider>
    )
}

export { CollectionFormContext, CollectionFormProvider };

