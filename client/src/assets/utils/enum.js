/**
 * Created by yuyajing on 2018/8/10.
 * 
 * 枚举资源文件
 **/
export {
    EnumMismatch,               //数据查询不到显示未知[不建议使用，若使用，数据更新后应该去掉该属性]
    EnumIdentity,               //用户类型
    EnumPermission,             //权限管理枚举
    EnumConversationManager,    //会话管理枚举
    EnumUserManager,            //客服管理枚举
    EnumTagManager,             //标签管理枚举
    EnumServiceStatus,          //服务状态
}


let _private = {
    hasOwnProperty: Object.prototype.hasOwnProperty         // 判断一个属性是定义在对象本身而不是继承自原型链
};
// 参数说明：枚举名称，枚举值
let EnumMismatch = (EnumName, EnumStatus) => {
    let e = EnumName.get(EnumStatus),
        mismatch = {
            text: "未知",
            value: -1
        };
    if (!!e && e.text == '') {
        return mismatch;
    }
}
class I {
    constructor(item) {
        this.text = item.text || '';
        this.value = item.value || 0;
        this.alias = item.alias || {};
        this.name = item.name || '';
    };
    // 获取value
    valueOf() {
        return this.value;
    };
    // 获取text
    getText() {
        return this.text;
    };
    // 获取别名alias
    aliasOf(item) {
        return this.alias[item];
    };
    // 自定toSting方法，不继承Object方法，后代类继承该方法。
    toString(format = '') {
        if (format == 'text' || format == "t") {
            return String(this.text);
        }
        return String(this.value);
    };
}

class Enums {
    constructor(items) {
        // 将传入的items赋值为函数的静态类
        Object.keys(items).forEach((key) => {

            // 判断一个属性是定义在对象本身而不是继承自原型链，意思就是循环该对象上本身的属性，而不是继承的属性
            if (_private.hasOwnProperty.call(items, key)) {
                // 该赋值操作会触发下面的get(),和set();
                // 并制定该属性的原型来自I，继承来自I的value of, toSting方法。
                this[key] = new I(items[key]);
            }
        });

        // 该赋值操作会触发下面的get items(),和set items();
        this.items = items;
    };

    get(partten, mismatch = { text: '', value: -1, alias: {} }) {
        let num;
        let buffer;

        // 优先匹配枚举值
        if (typeof partten === 'number') {
            num = partten;
        } else {
            buffer = parseInt(partten);

            if (!isNaN(buffer)) {
                num = buffer;
            }
        }

        if (!isNaN(num)) {
            // 按枚举值查找
            let items = this.items;
            // 使用全等匹配查找
            buffer = items.filter(function (item) { return parseInt(item.value) === num; });
            return buffer && buffer.length > 0 ? buffer[0] : mismatch;
        } else {
            // 按枚举名称查找
            if (hasOwnProperty.call(this, partten)) {
                return this[partten];
            }
            return mismatch;
        }
    };

    set(name, value, text, alias) {
        if (_private.hasOwnProperty.call(this, name)) {
            value && (this[name].value = value);
            text && (this[name].text = text);
            alias && (this[name].alias = alias);
        }
    };

    get items() {
        return this._items;
    }

    set items(items) {
        this._items = [];
        Object.keys(items).forEach((key) => {
            _private.hasOwnProperty.call(this, key) && this._items.push(this[key]);
        });
    }

    /**
     * 根据枚举显示名获取枚举成员
     * @param {String} text 枚举成员显示名
     */
    getItemFromText(text){
        let item;
        for(let it of this.items){
            if(it.text === text){
                item = it;
                break;
            }
        }
        return item;
    }
};

// 用户类型
const EnumIdentity = new Enums({
    servise:
        {
            text: "客服",
            value: '1'
        },
    buyers:
        {
            text: "买家",
            value: '2'
        }
});


//权限管理枚举
const EnumPermission = new Enums({
    EnumConversationManager:{
        text:"会话管理",
        value:"1",
        alias:{
            key:"EnumConversationManager"
        }
    },
    EnumUserManager:{
        text:"客服管理",
        value:"2",
        alias:{
            key:"EnumUserManager"
        }
    },
    EnumTagManager:{
        text:"标签管理",
        value:"4",
        alias:{
            key:"EnumTagManager"
        }
    },
})

//会话管理枚举
const EnumConversationManager = new Enums({
    Search:{
        text:"查看会话列表",
        value:"1"
    },
    Detail:{
        text:"查看会话详情",
        value:"2"
    },
})

//客服管理枚举
const EnumUserManager = new Enums({
    Search:{
        text:"查看客服",
        value:"1"
    },
    PermissionSet:{
        text:"权限设置",
        value:"2"
    },
    TagSet:{
        text:"标签设置",
        value:"4"
    },
    EnableDisable:{
        text:"启用/禁用客服",
        value:"8"
    },
})

//标签管理枚举
const EnumTagManager = new Enums({
    Search:{
        text:"查看标签",
        value:"1"
    },
    Edit:{
        text:"编辑标签",
        value:"2"
    },
    Delete:{
        text:"删除标签",
        value:"4"
    },
})


//服务状态
const EnumServiceStatus = new Enums({
    A:{
        text:"初始状态",
        value:"0"
    },
    B:{
        text:"进行中",
        value:"1"
    },
    C:{
        text:"已结束",
        value:"2"
    },
})