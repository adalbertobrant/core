import axios from 'axios'


const authAxiosInstance = axios.create({})


authAxiosInstance.interceptors.request.use(async config =>{
    let token = 'Token ' 
    const resp = await (await axios.get('/base/current-user-token')).data.token
    config.headers.Authorization = token + resp
    return config
})
authAxiosInstance.interceptors.response.use( resp =>{
    return resp
}, err =>{
    console.log('There was an error processing your request.')
    console.log(err)
    return err
})

authAxiosInstance.defaults.xsrfCookieName = "csrftoken";
authAxiosInstance.defaults.xsrfHeaderName = "X-CSRFTOKEN";


export default authAxiosInstance