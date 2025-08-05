import axios from '../Intercepter/Api'

export const doLogin = async (email: string, password: string) => {
    const response = await axios.post(`auth/login`, { email, password });
    return response.data;
}
export const getPermissions = async () => {
    const response = await axios.get(`auth/get-permissions`);
    return response.data;
}

export const createUserRole = async (name: string, code: string, description: string, permissions: string[]) => {
    const response = await axios.post(`auth/user-roles`, { name, code, description, permissions });
    return response.data;
}

export const getUserRoles = async () => {
    const response = await axios.get(`auth/user-roles`);
    return response.data;
}

export const getUserRole=async(id:string)=>{
    const response = await axios.get(`auth/user-roles/${id}`);
    return response.data;
}

export const updateUserRole=async(id:string,name:string,code:string,description:string,permissions:string[])=>{
    const response = await axios.put(`auth/user-roles/${id}`,{name,code,description,permissions});
    return response.data;
}

export const deleteUserRole=async(id:string)=>{
    const response = await axios.delete(`auth/user-roles/${id}`);
    return response.data;
}