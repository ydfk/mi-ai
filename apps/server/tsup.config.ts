import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs'], 
  target: 'node22', 
  splitting: false,
  sourcemap: process.env.NODE_ENV !== 'production',
  clean: true,
  dts: true, // 生成类型声明文件
  outDir: 'dist',
  watch: process.env.NODE_ENV === 'development',
  onSuccess: process.env.NODE_ENV === 'development' ? 'node dist/index.cjs' : undefined,
  // 将这些依赖视为外部依赖，不打包进bundle
  external: [
    'mi-gpt',
    'shared',
    '@prisma/client'
  ],
});