import { useState, useEffect } from "react";
import { api } from "./api/service";
import { MiGPTConfig, ServerStatus } from "shared";
import { Button } from "./components/ui/button";
import { ConfigForm } from "./components/ConfigForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./components/ui/dialog";

function App() {
  const [status, setStatus] = useState<ServerStatus>({ running: false });
  const [config, setConfig] = useState<MiGPTConfig>();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState({ title: "", message: "" });

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
      showDialog("错误", "获取状态失败");
    }
  };

  const showDialog = (title: string, message: string) => {
    setDialogContent({ title, message });
    setDialogOpen(true);
  };

  const handleStartService = async () => {
    if (!config) {
      showDialog("错误", "请先配置服务");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const response = await api.startService(config);
      if (response.success) {
        setStatus(response.data || { running: true });
        setMessage("服务启动成功");
      } else {
        setMessage(`启动失败: ${response.message}`);
      }
    } catch (error) {
      setMessage("启动服务出错");
    } finally {
      setLoading(false);
    }
  };

  const handleStopService = async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await api.stopService();
      if (response.success) {
        setStatus(response.data || { running: false });
        setMessage("服务已停止");
      } else {
        setMessage(`停止失败: ${response.message}`);
      }
    } catch (error) {
      setMessage("停止服务出错");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateConfig = async (newConfig: MiGPTConfig) => {
    setLoading(true);
    setMessage("");
    try {
      const response = await api.updateConfig(newConfig);
      if (response.success) {
        setConfig(newConfig);
        setMessage("配置已更新");
      } else {
        setMessage(`更新失败: ${response.message}`);
      }
    } catch (error) {
      setMessage("更新配置出错");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">小爱 GPT 控制面板</h1>

      {message && (
        <div
          className={`p-4 mb-6 rounded-md ${message.includes("失败") || message.includes("出错") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
          {message}
        </div>
      )}

      <div className="flex justify-between mb-8">
        <div>
          <span className="font-medium mr-2">状态:</span>
          <span className={`px-3 py-1 rounded-full ${status.running ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
            {status.running ? "运行中" : "已停止"}
          </span>
        </div>
        <div>
          {status.running ? (
            <Button onClick={handleStopService} disabled={loading} variant="destructive">
              {loading ? "处理中..." : "停止服务"}
            </Button>
          ) : (
            <Button onClick={handleStartService} disabled={loading}>
              {loading ? "处理中..." : "启动服务"}
            </Button>
          )}
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">配置设置</h2>
        <ConfigForm initialConfig={config} onSubmit={handleUpdateConfig} />
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
