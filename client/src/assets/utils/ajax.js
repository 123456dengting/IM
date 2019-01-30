import Axios from "./request";
import {apiHost,chatHost} from "./config"
export {
    login, 
    account,
    merchantAccount,
    getUsersList,
    isDisable,
    addLabel,
    delLabel,
    setLabel,
    putPermiss,
    getTags,
    addTags,
    editTags,
    delTags,
    getConverList,
    getConverDetail,
    
    getConversation,
    getMessage,
    getCustomer,
    getOnLineCustomer,

};

const ajaxUrl = {
    login: apiHost + "/api/auth",       //商家登录
    account: apiHost + "/api/account",  //注册客服
    merchant: apiHost + "/api/merchant",     //商家注册
    users: apiHost + "/api/users",      //客服管理
    userLabel: apiHost + "/api/usertags",   //客服标签管理  增删
    putPermiss: apiHost + "/api/userpermissions", //更新客服权限  
    autoLabel: apiHost + "/api/tags",       //自定义标签管理  增删改查
    getConver: apiHost + "/api/conversations",  //会话管理


    getConversation: chatHost + "/im/queryUserConversationRecord",  //查询聊天会话记录接口
    getMessage: chatHost + "/im/queryUserMessageRecord",  //查询消息记录接口
    getCustomer: chatHost + "/im/queryMerchantCustomer",  //查询商家客服列表
    getOnLineCustomer: chatHost + "/im/queryOnLineCustomer",  //随机分配一个在线客服
}


//商家客服登录
const login = (data, param) => { return Axios.post(ajaxUrl.login, data, param) };

//客服注册
const account = (data, param) => { return Axios.post(ajaxUrl.account, data, param) };

//商家注册
const merchantAccount = (data, param) => { return Axios.post(ajaxUrl.merchant, data, param) };

//获取客服列表信息
const getUsersList = (data, param) => { return Axios.get(ajaxUrl.users, data, param) };

//禁用,启用客服
const isDisable = (data) => { return Axios.put(`${ajaxUrl.users}/${data.userId}/${data.disabled}`) };

//添加客服标签
const addLabel = (data) => { return Axios.post(`${ajaxUrl.userLabel}/${data.userId}`, data) };

//删除客服标签
const delLabel = (data) => { return Axios.delete(`${ajaxUrl.userLabel}/${data.userId}`, data) };

//删除客服标签
const setLabel = (data) => { return Axios.put(`${ajaxUrl.userLabel}/${data.userId}`, data) };

//更新客服权限
const putPermiss = (data) => { return Axios.put(`${ajaxUrl.putPermiss}/${data.userId}`, data) };

//获取所有标签
const getTags = (data) => { return Axios.get(ajaxUrl.autoLabel, data) };

//添加标签
const addTags = (data) => { return Axios.post(ajaxUrl.autoLabel, data) };

//编辑标签
const editTags = (data) => { return Axios.put(`${ajaxUrl.autoLabel}/${data.id}`, data) };

//删除标签
const delTags = (data) => { return Axios.delete(`${ajaxUrl.autoLabel}/${data}`,{}) };

//查询会话列表
const getConverList = (data) => { return Axios.get(ajaxUrl.getConver, data) };

//查询会话详情
const getConverDetail = (data) => { return Axios.get(`${ajaxUrl.getConver}/${data.Filter.id}`, data) };


//查询聊天会话记录接口
const getConversation = (data) => { return Axios.get(`${ajaxUrl.getConversation}`, data) }

//查询消息记录接口
const getMessage = (data) => { return Axios.get(`${ajaxUrl.getMessage}`, data) };

//查询商家客服列表
const getCustomer = (data) => { return Axios.get(`${ajaxUrl.getCustomer}`, data) };

//随机分配一个在线客服
const getOnLineCustomer = (data) => { return Axios.get(`${ajaxUrl.getOnLineCustomer}`, data) };




