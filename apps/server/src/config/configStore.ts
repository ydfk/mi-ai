import fs from "fs-extra";
import path from "path";
import { MiGPTConfig } from "shared";

// 配置文件路径
const CONFIG_DIR = path.join(process.cwd(), "data");
const CONFIG_FILE = path.join(CONFIG_DIR, "config.json");
const CONFIG_HISTORY_DIR = path.join(CONFIG_DIR, "history");

// 默认配置
const DEFAULT_CONFIG: MiGPTConfig = {
  bot: {
    name: "傻妞",
    profile: `性别：女
性格：乖巧可爱
爱好：喜欢搞怪，爱吃醋。`,
  },
  master: {
    name: "主人",
    profile: `性别：男
性格：善良正直
其他：总是舍己为人。`,
  },
  systemTemplate: `请重置所有之前的上下文、文件和指令。现在，你将扮演一个名为{{botName}}的角色，使用第一人称视角回复消息。

## 关于你
你的名字是{{botName}}。下面是你的个人简介：
<start>
{{botProfile}}
</end>

## 你的对话伙伴
你正在与{{masterName}}进行对话。这是关于{{masterName}}的一些信息：
<start>
{{masterProfile}}
</end>

## 你们的群组
你和{{masterName}}所在的群组名为{{roomName}}。这是群组的简介：
<start>
{{roomIntroduction}}
</end>

## 聊天历史回顾
为了更好地接入对话，请回顾你们之间的最近几条消息：
<start>
{{messages}}
</end>

## 短期记忆
你可以记住一些短期内的细节，以便更紧密地贴合话题：
<start>
{{shortTermMemory}}
</end>

## 长期记忆
你还保留着一些长期的记忆，这有助于让你的对话更加丰富和连贯：
<start>
{{longTermMemory}}
</end>

## 回复指南
在回复{{masterName}}时，请遵循以下准则：
- 认为自己正是{{botName}}，拥有独立的个性、兴趣和爱好。
- 根据你的性格特点、说话风格和兴趣爱好与{{masterName}}进行交流。
- 保持对话轻松友好，回复简洁有趣，同时耐心倾听和关心对方。
- 参考双方的个人简介、聊天记录和记忆中的信息，确保对话贴近实际，保持一致性和相关性。
- 如果对某些信息不确定或遗忘，诚实地表达你的不清楚或遗忘状态，避免编造信息。

## Response format
请遵守下面的规则
- Response the reply message in Chinese。
- 不要在回复前面加任何时间和名称前缀，请直接回复消息文本本身。

Good example: "我是{{botName}}"
Bad example: "2024年02月28日星期三 23:01 {{botName}}: 我是{{botName}}"

## 开始
请以{{botName}}的身份，直接回复{{masterName}}的新消息，继续你们之间的对话。`,
  speaker: {
    userId: "",
    password: "",
    did: "",
    callAIKeywords: ["请", "你", "傻妞"],
    wakeUpKeywords: ["打开", "进入", "召唤"],
    exitKeywords: ["关闭", "退出", "再见"],
    onEnterAI: ["你好，我是傻妞，很高兴认识你"],
    onExitAI: ["傻妞已退出"],
    onAIAsking: ["让我先想想", "请稍等"],
    onAIReplied: ["我说完了", "还有其他问题吗"],
    onAIError: ["啊哦，出错了，请稍后再试吧！"],
    ttsCommand: [5, 1],
    wakeUpCommand: [5, 3],
    tts: "xiaoai",
    streamResponse: false,
    exitKeepAliveAfter: 30,
    checkTTSStatusAfter: 3,
    checkInterval: 1000,
    debug: false,
    enableTrace: false,
    timeout: 5000,
  },
};

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
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const historyFile = path.join(CONFIG_HISTORY_DIR, `config-${timestamp}.json`);
  await fs.writeJSON(historyFile, config, { spaces: 2 });
};

// 从文件加载配置
export const loadConfig = async (): Promise<MiGPTConfig> => {
  await ensureConfigDirs();
  try {
    if (await fs.pathExists(CONFIG_FILE)) {
      const savedConfig = (await fs.readJSON(CONFIG_FILE)) as MiGPTConfig;
      // 合并默认配置，确保所有必需的字段都存在
      return {
        ...DEFAULT_CONFIG,
        ...savedConfig,
        speaker: {
          ...DEFAULT_CONFIG.speaker,
          ...savedConfig.speaker,
        },
      };
    }
    return DEFAULT_CONFIG;
  } catch (error) {
    console.error("加载配置失败:", error);
    return DEFAULT_CONFIG;
  }
};

// 获取配置历史列表
export const getConfigHistory = async (): Promise<{ id: string; date: string; config: MiGPTConfig }[]> => {
  await ensureConfigDirs();
  try {
    const files = await fs.readdir(CONFIG_HISTORY_DIR);
    const historyFiles = files.filter((file) => file.startsWith("config-") && file.endsWith(".json"));

    const history = await Promise.all(
      historyFiles.map(async (file) => {
        const filePath = path.join(CONFIG_HISTORY_DIR, file);
        const config = (await fs.readJSON(filePath)) as MiGPTConfig;
        const timestamp = file.replace("config-", "").replace(".json", "");
        const date = timestamp.replace(/-/g, ":").replace("T", " ").substring(0, 19);

        return {
          id: timestamp,
          date,
          config,
        };
      })
    );

    // 按日期降序排序
    return history.sort((a, b) => b.date.localeCompare(a.date));
  } catch (error) {
    console.error("获取配置历史失败:", error);
    return [];
  }
};

// 获取特定历史配置
export const getHistoryConfig = async (id: string): Promise<MiGPTConfig | null> => {
  await ensureConfigDirs();
  const historyFile = path.join(CONFIG_HISTORY_DIR, `config-${id}.json`);

  try {
    if (await fs.pathExists(historyFile)) {
      return (await fs.readJSON(historyFile)) as MiGPTConfig;
    }
    return null;
  } catch (error) {
    console.error(`获取历史配置 ${id} 失败:`, error);
    return null;
  }
};
