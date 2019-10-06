import {CREATE_QUIZ_QUESTION, RESET_QUIZ_CREATION} from "./actionTypes";

export function createQuizQuestion(item) {
    return {
        type: CREATE_QUIZ_QUESTION,
        item
    }
}

export function finishCreateQuiz(title) {
    return (dispatch, getState) => {
        const quiz = getState().create.quiz;
        quiz.title = title;

        fetch('http://localhost:8080/api/quiz', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({quiz})
        })
            .then(res => {
                return res.json()
            })
            .then(({message, error}) => {
                dispatch(resetQuizCreation(message, error))
            })
            .catch(e => console.log(e))
    }
}

export function resetQuizCreation(message, error) {
    return {
        type: RESET_QUIZ_CREATION,
        message,
        error
    }
}