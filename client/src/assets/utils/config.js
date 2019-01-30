export {
  icon, //图标
  menuList, //菜单
  webSocketHost, //消息服务地址
  heartTime, //心跳检测时间间隔(秒)
  apiHost, //后台接口地址
  chatHost,//会话接口地址
  emojiNum, //表情包数量

}

//图标
const icon = {
  ic_chatinfo: "ios-settings", //菜单会话信息
  ic_chattrack: "ios-search", //菜单会话追踪
  ic_manager: "ios-settings" //菜单客服管理
}


//菜单
const menuList = [{
    title: "会话信息",
    path: "index",
    icon: icon.ic_chatinfo,
    isShow: true,
  },
  {
    title: "会话追踪",
    path: "track",
    icon: icon.ic_chattrack,
    isShow: true,
  },
  {
    title: "管理中心",
    icon: icon.ic_manager,
    isShow: true,
    child: [{
        title: "用户管理",
        path: "usermanager",
        icon: icon.ic_chattrack,
      },
      {
        title: "标签管理",
        path: "labelmanager",
        icon: icon.ic_chattrack,
      }
    ]
  }
]










//读取静态配置文件
var global = window.g || {};
const webSocketHost = global.webSocketHost;
const heartTime = global.heartTime;
const apiHost = global.apiHost;
const chatHost = global.chatHost;
const emojiNum = global.emojiNum;
