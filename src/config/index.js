export const apiURL = 'http://localhost:5000/api/';

export const authorization = (value) => {
    return {
        headers: {
            'authorization': value
        }
    };
};