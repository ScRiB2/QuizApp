import {
    FETCH_QUIZ_SUCCESS,
    FETCH_QUIZZES_ERROR,
    FETCH_QUIZZES_START,
    FETCH_QUIZZES_SUCCESS, FINISH_QUIZ, QUIZ_NEXT_QUESTION,
    QUIZ_SET_STATE, RETRY_QUIZ
} from "./actionTypes";

export function fetchQuizzes() {
    return dispatch => {
        dispatch(fetchQuizzesStart());

        fetch('http://localhost:8080/api/quizzes')
            .then(res => {
                return res.json()
            })
            .then(resData => {
                const quizzes = [];
                Object.values(resData.quizzes).forEach(value => {
                    quizzes.push({
                        id: value.id,
                        name: value.title
                    })
                });
                dispatch(fetchQuizzesSuccess(quizzes))
            })
            .catch(e => dispatch(fetchQuizzesError(e)))
    }
}

export function fetchQuizById(quizId) {
    return dispatch => {
        dispatch(fetchQuizzesStart());

        fetch(`http://localhost:8080/api/quiz/${quizId}`)
            .then(res => {
                return res.json()
            })
            .then(resData => {
                const quiz = resData.quiz;

                dispatch(fetchQuizSuccess(quiz))

            })
            .catch(e => dispatch(fetchQuizzesError(e)))
    }
}

export function fetchQuizzesStart() {
    return {
        type: FETCH_QUIZZES_START
    }
}

export function fetchQuizzesSuccess(quizzes) {
    return {
        type: FETCH_QUIZZES_SUCCESS,
        quizzes
    }
}

export function fetchQuizzesError(e) {
    return {
        type: FETCH_QUIZZES_ERROR,
        error: e
    }
}

export function fetchQuizSuccess(quiz) {
    return {
        type: FETCH_QUIZ_SUCCESS,
        quiz
    }
}

export function quizAnswerClick(answerId) {
    return (dispatch, getState) => {
        const state = getState().quiz;
        if (state.answerState) {
            const key = Object.keys(state.answerState)[0];
            if (state.answerState[key] === 'success') {
                return;
            }
        }

        const question = state.quiz.questions[state.activeQuestion];
        const results = state.results;

        if (question.rightAnswerId === answerId) {
            if (!results[question.id]) {
                results[question.id] = 'success';
            }

            dispatch(quizSetState(
                {[answerId]: 'success'},
                results
            ));

            const timeout = window.setTimeout(() => {
                if (isQuizFinished(state)) {
                    dispatch(finishQuiz())
                } else {
                    dispatch(quizNextQuestion(state.activeQuestion + 1))
                }
                window.clearTimeout(timeout);
            }, 1000);
        } else {
            results[question.id] = 'error';
            dispatch(quizSetState(
                {[answerId]: 'error'},
                results
            ));
        }
    }
}

function isQuizFinished(state) {
    return state.activeQuestion + 1 === state.quiz.questions.length
}

export function quizSetState(answerState, results) {
    return {
        type: QUIZ_SET_STATE,
        answerState,
        results
    }
}

export function finishQuiz() {
    return {
        type: FINISH_QUIZ
    }
}

export function quizNextQuestion(activeQuestion) {
    return {
        type: QUIZ_NEXT_QUESTION,
        activeQuestion
    }
}

export function retryQuiz() {
    return {
        type: RETRY_QUIZ
    }
}
