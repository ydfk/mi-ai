/**
 * MiGPT 配置类型定义
 */

export interface BotProfile {
  name: string;
  profile: string;
}

export interface MasterProfile {
  name: string;
  profile: string;
}

export type TTSProvider = "xiaoai" | "custom";
export type ActionCommand = [number, number];
export type PlayingCommand = [number, number, number];

export interface SpeakerConfig {
  // 账号基本信息
  userId: string;
  password: string;
  did: string;

  // 唤醒词与提示语
  callAIKeywords: string[];
  wakeUpKeywords: string[];
  exitKeywords: string[];
  onEnterAI: string[];
  onExitAI: string[];
  onAIAsking: string[];
  onAIReplied: string[];
  onAIError: string[];

  // MIoT 设备指令
  ttsCommand: ActionCommand;
  wakeUpCommand: ActionCommand;
  playingCommand?: PlayingCommand;

  // TTS 引擎
  tts: TTSProvider;
  switchSpeakerKeywords?: string[];

  // 连续对话
  streamResponse: boolean;
  exitKeepAliveAfter: number;
  checkTTSStatusAfter: number;
  checkInterval: number;

  // 其他选项
  debug: boolean;
  enableTrace: boolean;
  timeout: number;
}

export interface SystemPrompt {
  template: string;
}

export interface MiGPTConfig {
  bot: BotProfile;
  master: MasterProfile;
  speaker: SpeakerConfig;
  systemTemplate: string;
}

/**
 * 服务器状态
 */
export interface ServerStatus {
  running: boolean;
  config?: MiGPTConfig;
}

/**
 * API 响应格式
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}
