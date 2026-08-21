# GitHub Actions 自动发布 npm（Trusted Publishing / OIDC）

推送 `v*` tag 时自动发布 `dsh-architecture-mentor` 到 npmjs.com。
工作流文件：`.github/workflows/publish.yml`。
本仓库使用 npm **Trusted Publishing (OIDC)**，**不需要 NPM_TOKEN**。

## 前置配置（只需一次）

1. 在 npmjs.com 为 `dsh-architecture-mentor` 配置 Trusted Publisher：
   - 包页面 → **Settings** → **Publishing access** → **Add publisher**
   - Repository：`Lan-zk/dsh-architecture-mentor`
   - Workflow：`publish.yml`
   - Environment：（可选，一般留空）
2. 确认 `package.json` 的 `repository.url` 指向该 GitHub 仓库（已配置）。
3. **不需要**在 GitHub 添加 `NPM_TOKEN` secret。

## 触发方式

推送 `v` 开头的 tag，且 tag 必须等于 `v<package.json 的 version>`：

```sh
git tag v0.1.0-rc.2
git push origin v0.1.0-rc.2
```

工作流会先校验 `tag == v<version>`，不一致会直接失败。

## 常见失败

- `ENEEDAUTH` / `need auth`：npm 包的 Trusted Publisher 未登记，或登记的 workflow 文件名与 `.github/workflows/publish.yml` 不一致。
- E404 / `Access token expired`：npm 版本过旧；工作流已加入 `npm install -g npm@latest`。

## Tag / Release 权限

当前仓库协作者仅有仓库所有者（admin），因此**只有所有者能创建 tag 和 Release**。
如果以后添加协作者并希望保持"仅所有者可发版"：

- 不要授予协作者 write 权限（只给 read / triage）。
- 或在 GitHub 设置中为 `v*` 创建 Tag protection rule / Ruleset，并把绕过列表只保留你自己。

## 发布后验证

```sh
npm view dsh-architecture-mentor version --registry=https://registry.npmjs.org
```
