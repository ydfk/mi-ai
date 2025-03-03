import { UseFormReturn } from "react-hook-form";
import { MiGPTConfig } from "shared";
import { ArrayField } from "./ArrayField";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SpeakerSectionProps {
  form: UseFormReturn<MiGPTConfig>;
  openKeywordDialog: (field: string) => void;
}

export function SpeakerSection({ form, openKeywordDialog }: SpeakerSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">小爱音箱配置</h3>

      {/* 账号信息 */}
      <AccountSection form={form} />

      {/* 唤醒词与提示语 */}
      <KeywordsSection form={form} openKeywordDialog={openKeywordDialog} />

      {/* MIoT设备指令 */}
      <CommandsSection form={form} />

      {/* TTS引擎配置 */}
      <TTSEngineSection form={form} openKeywordDialog={openKeywordDialog} />

      {/* 连续对话配置 */}
      <ContinuousDialogSection form={form} />

      {/* 其他选项 */}
      <OtherOptionsSection form={form} />
    </div>
  );
}

// 账号信息部分
function AccountSection({ form }: { form: UseFormReturn<MiGPTConfig> }) {
  return (
    <div className="space-y-4">
      <h4 className="font-medium">账号信息</h4>
      <FormField
        control={form.control}
        name="speaker.userId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>小米ID</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormDescription>请在「个人信息」-「小米 ID」查看，不是手机号或邮箱</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="speaker.password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>密码</FormLabel>
            <FormControl>
              <Input type="password" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="speaker.did"
        render={({ field }) => (
          <FormItem>
            <FormLabel>设备ID</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormDescription>小爱音箱 DID 或在米家中设置的名称（注意空格和大小写）</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

// 唤醒词与提示语部分
function KeywordsSection({ form, openKeywordDialog }: { form: UseFormReturn<MiGPTConfig>; openKeywordDialog: (field: string) => void }) {
  return (
    <div className="space-y-4">
      <h4 className="font-medium">唤醒词与提示语</h4>
      <ArrayField
        name="speaker.callAIKeywords"
        label="AI回复触发词"
        description="消息以这些关键词开头时，会调用 AI 来回复消息"
        form={form}
        openKeywordDialog={openKeywordDialog}
      />
      <ArrayField
        name="speaker.wakeUpKeywords"
        label="唤醒词"
        description="消息以这些关键词开头时，会进入 AI 唤醒状态"
        form={form}
        openKeywordDialog={openKeywordDialog}
      />
      <ArrayField
        name="speaker.exitKeywords"
        label="退出词"
        description="消息以这些关键词开头时，会退出 AI 唤醒状态"
        form={form}
        openKeywordDialog={openKeywordDialog}
      />
      <ArrayField
        name="speaker.onEnterAI"
        label="进入提示语"
        description="进入 AI 模式时的欢迎语（可为空）"
        form={form}
        openKeywordDialog={openKeywordDialog}
      />
      <ArrayField
        name="speaker.onExitAI"
        label="退出提示语"
        description="退出 AI 模式时的提示语（可为空）"
        form={form}
        openKeywordDialog={openKeywordDialog}
      />
      <ArrayField
        name="speaker.onAIAsking"
        label="思考提示语"
        description="AI 开始回答时的提示语（可为空）"
        form={form}
        openKeywordDialog={openKeywordDialog}
      />
      <ArrayField
        name="speaker.onAIReplied"
        label="回复完成提示语"
        description="AI 结束回答时的提示语（可为空）"
        form={form}
        openKeywordDialog={openKeywordDialog}
      />
      <ArrayField
        name="speaker.onAIError"
        label="错误提示语"
        description="AI 回答异常时的提示语（可为空）"
        form={form}
        openKeywordDialog={openKeywordDialog}
      />
    </div>
  );
}

// MIoT设备指令部分
function CommandsSection({ form }: { form: UseFormReturn<MiGPTConfig> }) {
  return (
    <div className="space-y-4">
      <h4 className="font-medium">MIoT设备指令</h4>
      <FormField
        control={form.control}
        name="speaker.ttsCommand"
        render={({ field }) => (
          <FormItem>
            <FormLabel>TTS指令</FormLabel>
            <FormControl>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={field.value[0]}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    field.onChange([value, field.value[1]]);
                  }}
                  placeholder="第1个数字"
                />
                <Input
                  type="number"
                  value={field.value[1]}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    field.onChange([field.value[0], value]);
                  }}
                  placeholder="第2个数字"
                />
              </div>
            </FormControl>
            <FormDescription>请到 https://home.miot-spec.com 查询具体指令</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="speaker.wakeUpCommand"
        render={({ field }) => (
          <FormItem>
            <FormLabel>唤醒指令</FormLabel>
            <FormControl>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={field.value[0]}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    field.onChange([value, field.value[1]]);
                  }}
                  placeholder="第1个数字"
                />
                <Input
                  type="number"
                  value={field.value[1]}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    field.onChange([field.value[0], value]);
                  }}
                  placeholder="第2个数字"
                />
              </div>
            </FormControl>
            <FormDescription>请到 https://home.miot-spec.com 查询具体指令</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="speaker.playingCommand"
        render={({ field }) => (
          <FormItem>
            <FormLabel>播放状态指令</FormLabel>
            <FormControl>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={field.value?.[0]}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    field.onChange(field.value ? [value, field.value[1], field.value[2]] : [value, 0, 0]);
                  }}
                  placeholder="第1个数字"
                />
                <Input
                  type="number"
                  value={field.value?.[1]}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    field.onChange(field.value ? [field.value[0], value, field.value[2]] : [0, value, 0]);
                  }}
                  placeholder="第2个数字"
                />
                <Input
                  type="number"
                  value={field.value?.[2]}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    field.onChange(field.value ? [field.value[0], field.value[1], value] : [0, 0, value]);
                  }}
                  placeholder="第3个数字"
                />
              </div>
            </FormControl>
            <FormDescription>一般无需配置，播放状态异常时配置</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

// TTS引擎配置部分
function TTSEngineSection({ form, openKeywordDialog }: { form: UseFormReturn<MiGPTConfig>; openKeywordDialog: (field: string) => void }) {
  return (
    <div className="space-y-4">
      <h4 className="font-medium">TTS引擎</h4>
      <FormField
        control={form.control}
        name="speaker.tts"
        render={({ field }) => (
          <FormItem>
            <FormLabel>TTS引擎</FormLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="选择TTS引擎" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="xiaoai">小爱同学</SelectItem>
                <SelectItem value="custom">自定义</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <ArrayField
        name="speaker.switchSpeakerKeywords"
        label="切换音色关键词"
        description="以此关键词开头即可切换音色，如：把声音换成 xxx（可选）"
        form={form}
        openKeywordDialog={openKeywordDialog}
      />
    </div>
  );
}

// 连续对话配置部分
function ContinuousDialogSection({ form }: { form: UseFormReturn<MiGPTConfig> }) {
  return (
    <div className="space-y-4">
      <h4 className="font-medium">连续对话</h4>
      <FormField
        control={form.control}
        name="speaker.streamResponse"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between">
            <div className="space-y-0.5">
              <FormLabel>启用连续对话</FormLabel>
              <FormDescription>部分小爱音箱型号无法查询到正确的播放状态，需要关闭连续对话</FormDescription>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="speaker.exitKeepAliveAfter"
        render={({ field }) => (
          <FormItem>
            <FormLabel>自动退出时间（秒）</FormLabel>
            <FormControl>
              <Input type="number" value={field.value} onChange={(e) => field.onChange(Number(e.target.value))} />
            </FormControl>
            <FormDescription>连续对话时，无响应多久后自动退出（建议不超过60秒）</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="speaker.checkTTSStatusAfter"
        render={({ field }) => (
          <FormItem>
            <FormLabel>TTS状态检测延迟（秒）</FormLabel>
            <FormControl>
              <Input type="number" value={field.value} onChange={(e) => field.onChange(Number(e.target.value))} />
            </FormControl>
            <FormDescription>下发TTS指令多长时间后开始检测设备播放状态</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="speaker.checkInterval"
        render={({ field }) => (
          <FormItem>
            <FormLabel>状态检测间隔（毫秒）</FormLabel>
            <FormControl>
              <Input type="number" value={field.value} onChange={(e) => field.onChange(Number(e.target.value))} />
            </FormControl>
            <FormDescription>播放状态检测间隔，最低500毫秒</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

// 其他选项部分
function OtherOptionsSection({ form }: { form: UseFormReturn<MiGPTConfig> }) {
  return (
    <div className="space-y-4">
      <h4 className="font-medium">其他选项</h4>
      <FormField
        control={form.control}
        name="speaker.debug"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between">
            <div className="space-y-0.5">
              <FormLabel>调试模式</FormLabel>
              <FormDescription>启用调试日志输出</FormDescription>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="speaker.enableTrace"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between">
            <div className="space-y-0.5">
              <FormLabel>跟踪Mi Service</FormLabel>
              <FormDescription>启用Mi Service相关日志输出</FormDescription>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="speaker.timeout"
        render={({ field }) => (
          <FormItem>
            <FormLabel>请求超时（毫秒）</FormLabel>
            <FormControl>
              <Input type="number" value={field.value} onChange={(e) => field.onChange(Number(e.target.value))} />
            </FormControl>
            <FormDescription>网络请求超时时长</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
