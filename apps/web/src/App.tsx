import React, { useState, useEffect } from 'react';
import { api } from './api/service';
import { MiGPTConfig, ServerStatus } from 'shared';
import { Button } from './components/ui/button';
import { FormItem, FormLabel, FormControl } from './components/ui/form';
import { Input } from './components/ui/input';
import { Switch } from './components/ui/switch';
import { Checkbox } from './components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from './components/ui/dialog';

function App() {
  const [status, setStatus] = useState<ServerStatus>({ running: false });
  const [config, setConfig] = useState<MiGPTConfig>({
    speaker: {
      userId: '',
      password: '',
      did: '',
    },
    options: {
      prompt: '',
      maxTokens: 2000,
      temperature: 0.7,
      systemInstruction: '',
      debug: false,
      chatMode: true,
      contextCount: 10,
    },
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState({ title: '', message: '' });

  // 加载初始状态
  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await api.getStatus();
      if (response.success && response.data) {
        setStatus(response.data);
        if (response.data.config) {
          setConfig(response.data.config);
        }
      }
    } catch (error) {
      showDialog('错误', '获取状态失败');
    }
  };

  const showDialog = (title: string, message: string) => {
    setDialogContent({ title, message });
    setDialogOpen(true);
  };

  const handleStartService = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await api.startService(config);
      if (response.success) {
        setStatus(response.data || { running: true });
        setMessage('服务启动成功');
      } else {
        setMessage(`启动失败: ${response.message}`);
      }
    } catch (error) {
      setMessage('启动服务出错');
    } finally {
      setLoading(false);
    }
  };

  const handleStopService = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await api.stopService();
      if (response.success) {
        setStatus(response.data || { running: false });
        setMessage('服务已停止');
      } else {
        setMessage(`停止失败: ${response.message}`);
      }
    } catch (error) {
      setMessage('停止服务出错');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateConfig = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await api.updateConfig(config);
      if (response.success) {
        setMessage('配置已更新');
      } else {
        setMessage(`更新失败: ${response.message}`);
      }
    } catch (error) {
      setMessage('更新配置出错');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>, 
    section: 'speaker' | 'options', 
    key: string
  ) => {
    const value = e.target.value;
    
    setConfig({
      ...config,
      [section]: {
        ...config[section],
        [key]: e.target.type === 'number' ? Number(value) : value,
      },
    });
  };

  const handleSwitchChange = (
    checked: boolean,
    section: 'speaker' | 'options',
    key: string
  ) => {
    setConfig({
      ...config,
      [section]: {
        ...config[section],
        [key]: checked,
      },
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">小爱 GPT 控制面板</h1>
      
      {message && (
        <div className={`p-4 mb-6 rounded-md ${message.includes('失败') || message.includes('出错') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}
      
      <div className="flex justify-between mb-8">
        <div>
          <span className="font-medium mr-2">状态:</span>
          <span className={`px-3 py-1 rounded-full ${status.running ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            {status.running ? '运行中' : '已停止'}
          </span>
        </div>
        <div>
          {status.running ? (
            <Button onClick={handleStopService} disabled={loading} variant="destructive">
              {loading ? '处理中...' : '停止服务'}
            </Button>
          ) : (
            <Button onClick={handleStartService} disabled={loading}>
              {loading ? '处理中...' : '启动服务'}
            </Button>
          )}
        </div>
      </div>
      
      <div className="bg-gray-50 p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">配置设置</h2>
        
        {/* 基础设置 */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">基本设置</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormItem>
              <FormLabel>小米ID (不是手机号或邮箱)</FormLabel>
              <FormControl>
                <Input 
                  value={config.speaker.userId} 
                  onChange={(e) => handleInputChange(e, 'speaker', 'userId')} 
                  disabled={status.running}
                />
              </FormControl>
            </FormItem>
            
            <FormItem>
              <FormLabel>密码</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  value={config.speaker.password} 
                  onChange={(e) => handleInputChange(e, 'speaker', 'password')} 
                  disabled={status.running}
                />
              </FormControl>
            </FormItem>
            
            <FormItem>
              <FormLabel>设备ID (小爱音箱名称)</FormLabel>
              <FormControl>
                <Input 
                  value={config.speaker.did} 
                  onChange={(e) => handleInputChange(e, 'speaker', 'did')} 
                  disabled={status.running}
                />
              </FormControl>
            </FormItem>
          </div>
        </div>
        
        {/* 高级设置 */}
        <div>
          <h3 className="text-lg font-medium mb-3">高级设置</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormItem>
              <FormLabel>提示词</FormLabel>
              <FormControl>
                <Input 
                  value={config.options?.prompt || ''} 
                  onChange={(e) => handleInputChange(e, 'options', 'prompt')} 
                  disabled={status.running}
                />
              </FormControl>
            </FormItem>
            
            <FormItem>
              <FormLabel>最大Token数</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  value={config.options?.maxTokens} 
                  onChange={(e) => handleInputChange(e, 'options', 'maxTokens')} 
                  disabled={status.running}
                />
              </FormControl>
            </FormItem>
            
            <FormItem>
              <FormLabel>温度</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.1"
                  value={config.options?.temperature} 
                  onChange={(e) => handleInputChange(e, 'options', 'temperature')} 
                  disabled={status.running}
                />
              </FormControl>
            </FormItem>
            
            <FormItem>
              <FormLabel>系统提示词</FormLabel>
              <FormControl>
                <Input 
                  value={config.options?.systemInstruction || ''} 
                  onChange={(e) => handleInputChange(e, 'options', 'systemInstruction')} 
                  disabled={status.running}
                />
              </FormControl>
            </FormItem>
            
            <FormItem>
              <FormLabel>上下文数量</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  value={config.options?.contextCount} 
                  onChange={(e) => handleInputChange(e, 'options', 'contextCount')} 
                  disabled={status.running}
                />
              </FormControl>
            </FormItem>
            
            <FormItem>
              <div className="flex items-center space-x-2 mt-4">
                <FormLabel>调试模式</FormLabel>
                <Switch
                  checked={config.options?.debug || false}
                  onCheckedChange={(checked) => handleSwitchChange(checked, 'options', 'debug')}
                  disabled={status.running}
                />
              </div>
            </FormItem>
            
            <FormItem>
              <div className="flex items-center space-x-2 mt-4">
                <FormLabel>聊天模式</FormLabel>
                <Switch
                  checked={config.options?.chatMode || false}
                  onCheckedChange={(checked) => handleSwitchChange(checked, 'options', 'chatMode')}
                  disabled={status.running}
                />
              </div>
            </FormItem>
          </div>
        </div>
        
        {!status.running && (
          <div className="mt-6">
            <Button onClick={handleUpdateConfig} disabled={loading}>
              {loading ? '更新中...' : '保存配置'}
            </Button>
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogContent.title}</DialogTitle>
            <DialogDescription>{dialogContent.message}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setDialogOpen(false)}>确定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;