# GitHub Actions 自动发布 npm

推送 `v*` tag 时自动发布 `dsh-architecture-mentor` 到 npmjs.com。
工作流文件：`.github/workflows/publish.yml`。

## 前置配置（只需一次）

1. **创建 npm Automation token**
   - 打开 [npmjs.com](https://www.npmjs.com/) → 头像 → **Access Tokens** → **Generate New Token**。
   - Token Type 选择 **Automation**（自动化 token 会绕过 2FA 的 OTP，适合 CI）。
   - 权限：Read and publish（或粒度授权给 `dsh-architecture-mentor`）。
2. **把 token 添加到 GitHub 仓库 Secrets**
   - 仓库 → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**。
   - Name：`NPM_TOKEN`
   - Value：粘贴上一步生成的 token。
3. 仓库 `.npmrc` 已固定 `registry=https://registry.npmjs.org/`，无需额外设置。

## 触发方式

推送 `v` 开头的 tag，且 tag 必须等于 `v<package.json 的 version>`：

```sh
git tag v0.1.0-rc.1
git push origin v0.1.0-rc.1
```

工作流会先校验 `tag == v<version>`，不一致会直接失败，防止发布错版本。

## 2FA 说明

你启用了 npm 2FA 时，**CI 必须使用 Automation token**。
Classic token（需要 OTP 的那种）在 GitHub Actions 里无法完成 `npm publish`。

## 可选：关闭 provenance

工作流使用 `npm publish --provenance`。如果不需要发布来源证明，删除 publish 步骤里的 `--provenance`，
并移除 workflow 顶部 `permissions` 中的 `id-token: write` 即可。

## 发布后验证

```sh
npm view dsh-architecture-mentor version --registry=https://registry.npmjs.org
```
