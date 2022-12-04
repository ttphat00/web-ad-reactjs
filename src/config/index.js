export const apiURL = process.env.REACT_APP_API_URL;

export const authorization = (value) => {
    return {
        headers: {
            'authorization': value
        }
    };
};