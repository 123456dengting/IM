<template>
  <div>
    <div class="modal-content">
      <slot name="content"></slot>
    </div>
    <div slot="footer" class="modal-footer">
      <Button type="default" @click="onClose" size="large">{{closeText}}</Button>
      <slot name="submit"></slot>
    </div>
  </div>
</template>

<script>
// import { iconfont } from "@/assets/utils/config";
export default {
  props: {
    closeText: {
      type: String,
      default() {
        return "取消";
      }
    }
  },
  data() {
    return {
    };
  },
  mounted() {

  },
  methods: {
    onClose() {
      this.$Modal.remove();
    }
  }
};
</script>

<style lang="less">
.ivu-modal-confirm .ivu-modal-confirm-head{
  text-align: center;
  margin-bottom: 15px;
}
// 隐藏头部ICON
.ivu-modal-confirm-head-icon-confirm {
  display: none;
}
// 移除内容区底部内边距
.ivu-modal-confirm-body-render {
  padding-bottom: 0;
}
</style>
<style lang="less" scoped>
.taskhandle button {
  margin: 6px 2px 6px 0;
}
// 关闭按钮
.modal-close {
  position: absolute;
  top: -72px;
  right: -2px;
  padding: 0;
  button:hover {
    color: #fff;
    border: 1px solid red;
    background: red;
  }
}
.modal-content {
  padding-bottom: 20px;
  box-sizing: border-box;
}
.modal-footer {
  position: absolute;
  bottom: -60px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: calc(100%);
  height: 50px;
  background: #fff;
  button {
    margin-left: 10px;
  }
}
</style>

