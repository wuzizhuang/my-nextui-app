import "@sweetalert2/theme-dark";

export const successAlertConfig = {
  title: "成功！",
  text: "你触发按钮，请尽快完成该功能",
  icon: "success",
  confirmButtonText: "确定",
};

export const errorAlertConfig = {
  title: "错误！",
  text: "操作失败，请稍后重试",
  icon: "error", 
  confirmButtonText: "确定"
};

export const warningAlertConfig = {
  title: "警告！",
  text: "请确认是否继续此操作",
  icon: "warning",
  confirmButtonText: "确定",
  cancelButtonText: "取消",
  showCancelButton: true
};

export const infoAlertConfig = {
  title: "提示",
  text: "请注意相关信息",
  icon: "info",
  confirmButtonText: "我知道了"
};

export const questionAlertConfig = {
  title: "确认",
  text: "是否确认此操作?",
  icon: "question",
  confirmButtonText: "确定",
  cancelButtonText: "取消", 
  showCancelButton: true,
};