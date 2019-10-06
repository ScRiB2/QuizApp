import {AUTH_LOGOUT, AUTH_SUCCESS} from "./actionTypes";

export function auth(email, password, isLogin) {
    return dispatch => {

        let url = 'http://localhost:8080/api/register';

        if (isLogin) {
            url = 'http://localhost:8080/api/login'
        }

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password})
        })
            .then(res => {
                return res.json()
            })
            .then(resData => {
                const expirationDate = new Date(new Date().getTime() + resData.expiresIn * 1000);

                localStorage.setItem('token', resData.idToken);
                localStorage.setItem('userId', resData.localId);
                localStorage.setItem('expirationDate', expirationDate);

                dispatch(authSuccess(resData.idToken));
                dispatch(autoLogout(resData.expiresIn));
            })
            .catch(e => console.log(e))
    }
}

export function autoLogout(time) {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout())
        }, time * 1000)
    }
}

export function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('expirationDate');

    return {
        type: AUTH_LOGOUT
    }
}

export function autoLogin() {
     return dispatch => {
         const  token = localStorage.getItem('token');
         if (!token) {
             dispatch(logout())
         } else {
             const expirationDate = new Date(localStorage.getItem('expirationDate'));
             if (expirationDate <= new Date()) {
                 dispatch(logout())
             } else {
                 dispatch(authSuccess(token));
                 dispatch(autoLogout((expirationDate.getTime() - new Date().getTime()) / 1000));
             }
         }
     }
}

export function authSuccess(token) {
    return {
        type: AUTH_SUCCESS,
        token
    }
}