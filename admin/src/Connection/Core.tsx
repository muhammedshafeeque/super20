import axios from "../Intercepter/Api"

export const getQualifications = async (params?: any) => {
    const response = await axios.get(`core/qualifications${params ? `?${new URLSearchParams(params).toString()}` : ''}`)
    return response.data
}

export const createQualification = async (data: any) => {
    const response = await axios.post(`core/qualification`, data)
    return response.data
}

export const updateQualification = async (id: string, data: any) => {
    const response = await axios.put(`core/qualification/${id}`, data)
    return response.data
}

export const deleteQualification = async (id: string) => {
    const response = await axios.delete(`core/qualification/${id}`)
    return response.data
}

export const getQualificationTypes = async () => {
    const response = await axios.get(`core/qualification-types`)
    return response.data
}

export const getQualification = async (id: string) => {
    const response = await axios.get(`core/qualifications/${id}`)
    return response.data
}

export const getInstitutions = async () => {
    const response = await axios.get(`core/institutions`)
    return response.data
}

export const createInstitution = async (data: any) => { 
    const response = await axios.post(`core/institutions`, data)
    return response.data
}

export const updateInstitution = async (id: string, data: any) => {
    const response = await axios.put(`core/institutions/${id}`, data)
    return response.data
}

export const deleteInstitution = async (id: string) => {
    const response = await axios.delete(`core/institutions/${id}`)
    return response.data
}

export const getInstitution = async (id: string) => {
    const response = await axios.get(`core/institutions/${id}`)
    return response.data
}