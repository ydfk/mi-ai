import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { MiGPTConfig } from "shared";

interface BotSectionProps {
  form: UseFormReturn<MiGPTConfig>;
}

export function BotSection({ form }: BotSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">机器人配置</h3>
      <FormField
        control={form.control}
        name="bot.name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>机器人名称</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="bot.profile"
        render={({ field }) => (
          <FormItem>
            <FormLabel>机器人简介</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
