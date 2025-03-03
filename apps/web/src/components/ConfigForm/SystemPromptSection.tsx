import { Textarea } from "@/components/ui/textarea";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { MiGPTConfig } from "shared";

interface SystemPromptSectionProps {
  form: UseFormReturn<MiGPTConfig>;
}

export function SystemPromptSection({ form }: SystemPromptSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">系统提示词</h3>
      <FormField
        control={form.control}
        name="systemTemplate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>提示词模板</FormLabel>
            <FormControl>
              <Textarea {...field} className="min-h-[200px]" />
            </FormControl>
            <FormDescription>
              使用 {"{{变量名}}"} 来插入变量，如 {"{{botName}}"}, {"{{masterName}}"} 等
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
