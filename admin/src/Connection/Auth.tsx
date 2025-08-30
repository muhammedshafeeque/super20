import axios from '../Intercepter/Api'

export const doLogin = async (email: string, password: string) => {
    const response = await axios.post(`auth/login`, { email, password });
    return response.data;
}
export const getPermissions = async () => {
    const response = await axios.get(`auth/get-permissions`);
    return response.data;
}
export const getRequestUser = async () => {
    const response = await axios.get('auth/request-user')
    return response.data
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

// Employee API functions
export const getEmployees = async (params?: any) => {
    const response = await axios.get(`employee${params ? `?${new URLSearchParams(params).toString()}` : ''}`);
    return response.data;
}

export const getEmployeeById = async (id: string) => {
    const response = await axios.get(`employee/${id}`);
    return response.data;
}

export const createEmployee = async (data: any) => {
    const response = await axios.post('employee', data);
    return response.data;
}

export const updateEmployee = async (id: string, data: any) => {
    const response = await axios.put(`employee/${id}`, data);
    return response.data;
}

export const deleteEmployee = async (id: string) => {
    const response = await axios.delete(`employee/${id}`);
    return response.data;
}

export const updateEmployeePermissions = async (employeeId: string, permissions: string[]) => {
    const response = await axios.put(`employee/${employeeId}/permissions`, { permissions });
    return response.data;
}