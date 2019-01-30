let person = require('./person.json');

let protobufRoot = require('protobufjs').Root;
let root = protobufRoot.fromJSON(person);
let userInfo = root.lookupType('user.UserInfo');
//序列化
let infoData = {};
let game = {};
game.name = 'lol';
game.type = 'MOBA';
infoData.game = [game];
infoData.name = 'ezLeo';
infoData.age = 24;
infoData.sex = 0;
console.log("userInfo",userInfo)
let infoEncodeMessage = userInfo.encode(userInfo.create(infoData)).finish();
console.log("infoEncodeMessage",infoEncodeMessage);

//反序列化
let infoUnSerialized = userInfo.decode(infoEncodeMessage);
console.log("unserialized info message:");
console.log(infoUnSerialized);


// let protobufRoot = require('protobufjs').Root;

// let msg = {
//     name:"zhangsan",
//     age:14
// }

// let root = protobufRoot.fromJSON(msg);
// let msg1 = root.lookupType('msg');
// let msg2 = msg1.encode().finish();
// console.log("msgss",msg2)
