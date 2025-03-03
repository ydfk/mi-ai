module.exports = {
  // Web 前端项目
  'apps/web/src/**/*.{js,jsx,ts,tsx}': [
    'prettier --write',
    'eslint --fix',
    () => 'tsc --noEmit --project apps/web/tsconfig.json'
  ],
  
  // 后端项目
  'apps/server/src/**/*.{js,ts}': [
    'prettier --write',
    'eslint --fix',
    () => 'tsc --noEmit --project apps/server/tsconfig.json'
  ],
  
  // Shared 包
  'packages/shared/src/**/*.{js,ts}': [
    'prettier --write',
    'eslint --fix',
    () => 'tsc --noEmit --project packages/shared/tsconfig.json'
  ],

  // 通用配置文件
  '{apps,packages}/**/package.json': [
    'prettier --write'
  ],
  '*.{json,md}': [
    'prettier --write'
  ]
}