/**
 *
1. 编写好.proto 文件 (可以生成多种语言)
2. 在目录 ./node_modules/bin/ 下面执行 pbjs -t json Message.proto > Message.json 
3. 把生成的.json文件复制到当前目录
4. 编写编码解码器
 */

let Message = require('./Message.json');
let protobufRoot = require('protobufjs').Root;
let root = protobufRoot.fromJSON(Message);
let Msg = root.lookupType('im.Message');


/**
 * 
 * @param {*} data 要编码,解码的数据
 * @param {*} type 编码还是解码,默认编码
 */

const VMmessage = (data , type="encode")=>{
    if (type == "encode") {
        data = Msg.encode(data).finish()
    } else {
        data = Msg.decode(data);
    }
    return data;
}





export {  
    VMmessage, //消息编码解码器
};