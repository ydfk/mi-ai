import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import sensible from '@fastify/sensible';
import { MiGPT } from 'mi-gpt';
import { MiGPTConfig, ServerStatus, ApiResponse } from 'shared';
import { saveConfig, saveConfigHistory, loadConfig, getConfigHistory, getHistoryConfig } from './config/configStore';

// 创建 Fastify 实例
const app: FastifyInstance = Fastify({
  logger: true,
});

// 注册插件
app.register(cors);
app.register(sensible);

// 服务状态
let serviceStatus: ServerStatus = {
  running: false,
};

// MiGPT 客户端实例
let miGptClient: any = null;

// 路由定义
app.get('/api/status', async (request, reply) => {
  const response: ApiResponse<ServerStatus> = {
    success: true,
    data: serviceStatus,
  };
  return response;
});

// 启动服务
app.post<{ Body: MiGPTConfig }>('/api/start', async (request, reply) => {
  if (serviceStatus.running) {
    return {
      success: false,
      message: '服务已在运行中',
    };
  }

  try {
    const config = request.body;
    
    // 保存配置
    serviceStatus.config = config;
    await saveConfig(config);
    await saveConfigHistory(config);

    // 创建 MiGPT 实例
    miGptClient = MiGPT.create({
      speaker: {
        userId: config.speaker.userId,
        password: config.speaker.password,
        did: config.speaker.did,
      },
      ...config.options,
    });

    // 启动服务
    await miGptClient.start();
    
    // 更新状态
    serviceStatus.running = true;

    return {
      success: true,
      data: serviceStatus,
      message: '服务启动成功',
    };
  } catch (error) {
    app.log.error('启动服务失败:', error);
    return {
      success: false,
      message: `启动服务失败: ${(error as Error).message}`,
    };
  }
});

// 停止服务
app.post('/api/stop', async (request, reply) => {
  if (!serviceStatus.running) {
    return {
      success: false,
      message: '服务未运行',
    };
  }

  try {
    // 停止服务
    if (miGptClient) {
      await miGptClient.stop();
      miGptClient = null;
    }
    
    // 更新状态
    serviceStatus.running = false;

    return {
      success: true,
      data: serviceStatus,
      message: '服务已停止',
    };
  } catch (error) {
    app.log.error('停止服务失败:', error);
    return {
      success: false,
      message: `停止服务失败: ${(error as Error).message}`,
    };
  }
});

// 更新配置
app.post<{ Body: MiGPTConfig }>('/api/updateConfig', async (request, reply) => {
  if (serviceStatus.running) {
    return {
      success: false,
      message: '无法在服务运行时更新配置，请先停止服务',
    };
  }

  try {
    const config = request.body;
    serviceStatus.config = config;
    await saveConfig(config);
    await saveConfigHistory(config);

    return {
      success: true,
      data: config,
      message: '配置已更新',
    };
  } catch (error) {
    app.log.error('更新配置失败:', error);
    return {
      success: false,
      message: `更新配置失败: ${(error as Error).message}`,
    };
  }
});

// 获取配置
app.get('/api/config', async (request, reply) => {
  try {
    const config = await loadConfig();
    
    if (!config) {
      return {
        success: true,
        message: '尚无配置',
      };
    }
    
    // 如果服务正在运行，使用当前的配置
    if (serviceStatus.running && serviceStatus.config) {
      return {
        success: true,
        data: serviceStatus.config,
      };
    }
    
    return {
      success: true,
      data: config,
    };
  } catch (error) {
    app.log.error('获取配置失败:', error);
    return {
      success: false,
      message: `获取配置失败: ${(error as Error).message}`,
    };
  }
});

// 获取配置历史列表
app.get('/api/configHistory', async (request, reply) => {
  try {
    const history = await getConfigHistory();
    return {
      success: true,
      data: history,
    };
  } catch (error) {
    app.log.error('获取配置历史失败:', error);
    return {
      success: false,
      message: `获取配置历史失败: ${(error as Error).message}`,
    };
  }
});

// 获取特定历史配置
app.get<{ Params: { id: string } }>('/api/configHistory/:id', async (request, reply) => {
  try {
    const { id } = request.params;
    const config = await getHistoryConfig(id);
    
    if (!config) {
      return reply.notFound(`未找到ID为 ${id} 的配置`);
    }
    
    return {
      success: true,
      data: config,
    };
  } catch (error) {
    app.log.error('获取历史配置失败:', error);
    return {
      success: false,
      message: `获取历史配置失败: ${(error as Error).message}`,
    };
  }
});

// 应用历史配置
app.post<{ Params: { id: string } }>('/api/configHistory/:id/apply', async (request, reply) => {
  if (serviceStatus.running) {
    return {
      success: false,
      message: '无法在服务运行时更新配置，请先停止服务',
    };
  }
  
  try {
    const { id } = request.params;
    const config = await getHistoryConfig(id);
    
    if (!config) {
      return reply.notFound(`未找到ID为 ${id} 的配置`);
    }
    
    // 更新当前配置
    serviceStatus.config = config;
    await saveConfig(config);
    
    return {
      success: true,
      data: config,
      message: '已应用历史配置',
    };
  } catch (error) {
    app.log.error('应用历史配置失败:', error);
    return {
      success: false,
      message: `应用历史配置失败: ${(error as Error).message}`,
    };
  }
});

// 启动服务器
const start = async () => {
  try {
    // 加载保存的配置
    const savedConfig = await loadConfig();
    if (savedConfig) {
      serviceStatus.config = savedConfig;
    }
    
    await app.listen({ port: Number(process.env.PORT) || 3001, host: '0.0.0.0' });
    console.log(`服务器运行在 ${app.server.address()}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();