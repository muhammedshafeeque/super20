import axios from '../Intercepter/Api'

export const doLogin = async (email: string, password: string) => {
    const response = await axios.post(`auth/login`, { email, password });
    return response.data;
}

