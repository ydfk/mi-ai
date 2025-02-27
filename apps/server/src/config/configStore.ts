import fs from 'fs-extra';
import path from 'path';
import { MiGPTConfig } from 'shared';

// 配置文件路径
const CONFIG_DIR = path.join(process.cwd(), 'data');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');
const CONFIG_HISTORY_DIR = path.join(CONFIG_DIR, 'history');

// 确保目录存在
export const ensureConfigDirs = async (): Promise<void> => {
  await fs.ensureDir(CONFIG_DIR);
  await fs.ensureDir(CONFIG_HISTORY_DIR);
};

// 保存配置到文件
export const saveConfig = async (config: MiGPTConfig): Promise<void> => {
  await ensureConfigDirs();
  await fs.writeJSON(CONFIG_FILE, config, { spaces: 2 });
};

// 将配置保存到历史记录
export const saveConfigHistory = async (config: MiGPTConfig): Promise<void> => {
  await ensureConfigDirs();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const historyFile = path.join(CONFIG_HISTORY_DIR, `config-${timestamp}.json`);
  await fs.writeJSON(historyFile, config, { spaces: 2 });
};

// 从文件加载配置
export const loadConfig = async (): Promise<MiGPTConfig | null> => {
  await ensureConfigDirs();
  try {
    if (await fs.pathExists(CONFIG_FILE)) {
      return await fs.readJSON(CONFIG_FILE) as MiGPTConfig;
    }
    return null;
  } catch (error) {
    console.error('加载配置失败:', error);
    return null;
  }
};

// 获取配置历史列表
export const getConfigHistory = async (): Promise<{ id: string; date: string; config: MiGPTConfig }[]> => {
  await ensureConfigDirs();
  try {
    const files = await fs.readdir(CONFIG_HISTORY_DIR);
    const historyFiles = files.filter(file => file.startsWith('config-') && file.endsWith('.json'));
    
    const history = await Promise.all(
      historyFiles.map(async (file) => {
        const filePath = path.join(CONFIG_HISTORY_DIR, file);
        const config = await fs.readJSON(filePath) as MiGPTConfig;
        const timestamp = file.replace('config-', '').replace('.json', '');
        const date = timestamp.replace(/-/g, ':').replace('T', ' ').substring(0, 19);
        
        return {
          id: timestamp,
          date,
          config
        };
      })
    );
    
    // 按日期降序排序
    return history.sort((a, b) => b.date.localeCompare(a.date));
  } catch (error) {
    console.error('获取配置历史失败:', error);
    return [];
  }
};

// 获取特定历史配置
export const getHistoryConfig = async (id: string): Promise<MiGPTConfig | null> => {
  await ensureConfigDirs();
  const historyFile = path.join(CONFIG_HISTORY_DIR, `config-${id}.json`);
  
  try {
    if (await fs.pathExists(historyFile)) {
      return await fs.readJSON(historyFile) as MiGPTConfig;
    }
    return null;
  } catch (error) {
    console.error(`获取历史配置 ${id} 失败:`, error);
    return null;
  }
};