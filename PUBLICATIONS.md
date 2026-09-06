# 用 BibTeX 管理论文

你只需要编辑仓库根目录的 `publications.bib`，不需要修改网页代码。

1. 在 GitHub 打开 `publications.bib`，点铅笔编辑。
2. 粘贴 Google Scholar、出版社或 Zotero 导出的 BibTeX 条目。
3. 提交更改。等待 **Actions → Deploy academic website** 成功，网页会自动更新。

论文在构建时生成到 HTML 中，不会等访客打开页面后再下载、解析 BibTeX。
本地预览需要先运行 `npm run build`，再重新导出预览。

## 最小示例

```bibtex
@inproceedings{my_new_paper,
  title = {My New Paper Title},
  author = {Chuai, Yuwei and Doe, Jane},
  booktitle = {CHI Conference on Human Factors in Computing Systems},
  year = {2026},
  doi = {10.1145/your-actual-doi},
  corresponding = {Yuwei Chuai}
}
```

请用真实标题、作者和 DOI 替换示例；示例不会加入当前论文列表。

## 自动处理规则

| 你编辑的内容 | 网页如何处理 |
| --- | --- |
| `author = {Chuai, Yuwei and ...}` | 显示为 **Yuwei Chuai**，不论你的名字排在第几位 |
| `corresponding = {Yuwei Chuai}` | 在你的名字旁加 `†`，列表底部解释为 Corresponding author |
| `corresponding = {Yuwei Chuai and Jane Doe}` | 对指定的多个通讯作者分别加 `†` |
| 省略 `corresponding` | 不加通讯作者符号；程序不会根据作者顺序猜测 |
| `selected = {false}` | 隐藏该条目；不写时默认显示 |
| 调整条目在 `.bib` 文件中的顺序 | 网页顺序随之调整 |
| `doi` 或 `url` | 自动生成 Paper 链接；两者都有时优先 DOI |
| 都没有 `doi` / `url` | 保留论文信息，不显示无效 Paper 链接 |

当前 6 篇论文已迁移，通讯作者信息依据提供的 CV：除 Nature Communications
那篇外，其余 5 篇都标注了 `Yuwei Chuai†`。这仅复现 CV 已确认的标记，
不代表其他合作者一定不是通讯作者；可以继续在对应字段补充。

## 期刊与会议图标

Nature Communications、CHI、WWW 会根据 `journal` 或 `booktitle` 自动识别。
CSCW 论文如果只写了 PACM HCI 的全称，请额外加 `venue = {cscw}`，
因为 PACM HCI 还包含其他会议，不宜一律认作 CSCW。

所有图标外框统一为 **72 × 28 CSS 像素**（默认字体设置下），在期刊名称同一行。
图标完整等比例缩放，不裁切、不拉伸。年度会议有对应图标时按年份选取。

新增期刊时，可在 `data/venues.json` 添加一个配置：

```json
"myvenue": {
  "label": "My Journal",
  "badge": "MJ",
  "patterns": ["my journal"],
  "logo": "./logos/my-journal.svg"
}
```

把图片上传到 `public/logos/my-journal.svg`；论文内可写 `venue = {myvenue}`。
没有匹配图标的新期刊仍可显示，使用同尺寸的文字占位，不会产生破图。
图标出处见 `public/logos/SOURCES.md`。

## BibTeX 格式

支持 `@article`、`@inproceedings`、其他常见条目类型、UTF-8、常见 LaTeX
重音、嵌套花括号、引号值、数字、`%` 注释、`@comment`、`@string` 和 `#` 拼接。
作者之间用 `and`；名字可用 `Last, First` 或 `First Last`。
请把未知的 LaTeX 命令换成对应的 Unicode 文本。
不自动解析 `crossref` / `xdata` 继承；请将标题、作者、年份及期刊信息直接保留在每个条目中。

每篇必须有唯一 citation key，以及 `title`、`author`、`year`。
格式错误或通讯作者不在作者列表中时，部署会停止并给出报错，而不是静默漏掉论文。
在 GitHub Actions 的失败步骤查看原因，修正 `.bib` 后再次提交即可。
