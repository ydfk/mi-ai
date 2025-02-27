/**
 * MiGPT 配置类型定义
 */

export interface SpeakerConfig {
  userId: string;
  password: string;
  did: string;
}

export interface GPTOptions {
  prompt?: string;
  maxTokens?: number;
  temperature?: number;
  systemInstruction?: string;
  debug?: boolean;
  chatMode?: boolean;
  contextCount?: number;
}

export interface MiGPTConfig {
  speaker: SpeakerConfig;
  options?: GPTOptions;
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