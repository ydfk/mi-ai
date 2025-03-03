import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { MiGPTConfig } from "shared";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { BotSection } from "./BotSection";
import { MasterSection } from "./MasterSection";
import { SystemPromptSection } from "./SystemPromptSection";
import { SpeakerSection } from "./SpeakerSection";
import { KeywordDialog } from "./KeywordDialog";

// 表单验证schema
const configFormSchema = z.object({
  bot: z.object({
    name: z.string().min(1, "机器人名称不能为空"),
    profile: z.string().min(1, "机器人简介不能为空"),
  }),
  master: z.object({
    name: z.string().min(1, "主人名称不能为空"),
    profile: z.string().min(1, "主人简介不能为空"),
  }),
  systemTemplate: z.string().min(1, "系统提示词不能为空"),
  speaker: z.object({
    // 账号信息
    userId: z.string().min(1, "小米ID不能为空"),
    password: z.string().min(1, "密码不能为空"),
    did: z.string().min(1, "设备ID不能为空"),

    // 唤醒词与提示语
    callAIKeywords: z.array(z.string()).min(1, "至少需要一个唤醒词"),
    wakeUpKeywords: z.array(z.string()).min(1, "至少需要一个唤醒词"),
    exitKeywords: z.array(z.string()).min(1, "至少需要一个退出词"),
    onEnterAI: z.array(z.string()),
    onExitAI: z.array(z.string()),
    onAIAsking: z.array(z.string()),
    onAIReplied: z.array(z.string()),
    onAIError: z.array(z.string()),

    // MIoT设备指令
    ttsCommand: z.tuple([z.number(), z.number()]).transform((arr) => arr as [number, number]),
    wakeUpCommand: z.tuple([z.number(), z.number()]).transform((arr) => arr as [number, number]),
    playingCommand: z
      .tuple([z.number(), z.number(), z.number()])
      .transform((arr) => arr as [number, number, number])
      .optional(),

    // TTS引擎
    tts: z.enum(["xiaoai", "custom"] as const, {
      required_error: "请选择TTS引擎",
      invalid_type_error: "请选择有效的TTS引擎",
    }),
    switchSpeakerKeywords: z.array(z.string()).optional(),

    // 连续对话
    streamResponse: z.boolean(),
    exitKeepAliveAfter: z.number().min(1).max(60),
    checkTTSStatusAfter: z.number().min(1),
    checkInterval: z.number().min(500),

    // 其他选项
    debug: z.boolean(),
    enableTrace: z.boolean(),
    timeout: z.number().min(1000),
  }),
});

const defaultConfig: MiGPTConfig = {
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
- 不要在回复前面加任何时间和名称前缀，请直接回复消息文本本身。`,
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

interface ConfigFormProps {
  initialConfig?: MiGPTConfig;
  onSubmit: (config: MiGPTConfig) => void;
}

export function ConfigForm({ initialConfig, onSubmit }: ConfigFormProps) {
  const form = useForm<MiGPTConfig>({
    resolver: zodResolver(configFormSchema),
    defaultValues: initialConfig || defaultConfig,
  });

  const [isAddKeywordOpen, setIsAddKeywordOpen] = useState(false);
  const [currentKeywordField, setCurrentKeywordField] = useState<string>("");

  const openKeywordDialog = (fieldName: string) => {
    setCurrentKeywordField(fieldName);
    setIsAddKeywordOpen(true);
  };

  const handleAddKeyword = (keyword: string) => {
    if (keyword && currentKeywordField) {
      const currentValue = form.getValues(currentKeywordField as any) || [];
      form.setValue(currentKeywordField as any, [...currentValue, keyword]);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          {/* Bot配置 */}
          <BotSection form={form} />

          {/* Master配置 */}
          <MasterSection form={form} />

          {/* 系统提示词 */}
          <SystemPromptSection form={form} />

          {/* Speaker配置 */}
          <SpeakerSection form={form} openKeywordDialog={openKeywordDialog} />
        </div>

        <Button type="submit">保存配置</Button>
        <KeywordDialog isOpen={isAddKeywordOpen} setIsOpen={setIsAddKeywordOpen} onAddKeyword={handleAddKeyword} />
      </form>
    </Form>
  );
}
