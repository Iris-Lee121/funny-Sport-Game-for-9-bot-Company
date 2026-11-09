# 赛场 · 趣味运动会

用于四类项目的报名、随机编排、成绩登记、晋级和决赛管理。

## 发布

将本目录全部文件放在仓库根目录。在仓库 Settings → Pages 中选择 Deploy from a branch、main、/(root)，保存后等待GitHub Pages发布完成。

## 功能

- 男子100米、男子200米、女子100米、女子200米独立编排。
- 100米每组最多6人，200米每组最多8人。
- 预赛成绩自动排序，登记完整后确认前8名晋级。
- 决赛依预赛顺序安排4、5、3、6、2、7、1、8道。
- 同秒复核、DNS、DNF、DQ状态、决赛成绩排名。
- Excel导入导出、JSON备份与恢复、打印登记表。
- 公开共享成绩：所有访问者均可编辑，其他设备约每5秒更新；过期版本不会覆盖最新记录。
- 独立演示模式，不写入正式成绩。

## 共享服务

前端可托管在GitHub Pages，成绩由独立共享服务保存：https://sports-meet-shared-iris1121.iris1121.chatgpt.site 。前端不包含密码或私密密钥。

公开协作版允许所有访问者修改同一份报名和成绩。出现保存冲突时，请先导出本机备份，再重新载入共享成绩。

## 目录

index.html为网页入口，app.js负责交互，core.mjs为编排与排名规则，style.css和theme.css负责布局与趣味运动主题，roster.json包含初始报名资料，xlsx.full.min.js为本地Excel组件。

Excel导出为当前成绩快照，不含自动计算公式。JSON用于完整备份和恢复。

## 第三方组件

SheetJS Community Edition 0.20.3用于Excel读写，其原始版权和许可声明保留在xlsx.full.min.js中。
