import {CREATE_QUIZ_QUESTION, RESET_QUIZ_CREATION} from "../actions/actionTypes";

const initState = {
    quiz: {
        title: '',
        questions: []
    },
    message: '',
    error: false
};

export default function createReducer(state = initState, action) {
    switch (action.type) {
        case CREATE_QUIZ_QUESTION:
            return {
                ...state,
                quiz: {
                    ...state.quiz,
                    questions: [...state.quiz.questions, action.item]
                }
            };
        case RESET_QUIZ_CREATION:
            return {
                ...state,
                quiz: {
                    title: '',
                    questions: []
                },
                message: action.message,
                error: action.error
            };
        default:
            return state
    }
}