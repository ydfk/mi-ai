import { Button } from "@/components/ui/button";
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { MiGPTConfig } from "shared";

// 指定字段路径类型，包括所有可能的数组字段
type ArrayFieldName =
  | "speaker.callAIKeywords"
  | "speaker.wakeUpKeywords"
  | "speaker.exitKeywords"
  | "speaker.onEnterAI"
  | "speaker.onExitAI"
  | "speaker.onAIAsking"
  | "speaker.onAIReplied"
  | "speaker.onAIError"
  | "speaker.switchSpeakerKeywords";

interface ArrayFieldProps {
  name: ArrayFieldName;
  label: string;
  description?: string;
  form: UseFormReturn<MiGPTConfig>;
  openKeywordDialog: (field: string) => void;
}

export function ArrayField({ name, label, description, form, openKeywordDialog }: ArrayFieldProps) {
  const values = form.watch(name as any) || [];

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {values.map((value: string, index: number) => (
              <div key={index} className="flex items-center gap-2 bg-secondary p-2 rounded">
                <span>{value}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const newValues = [...values];
                    newValues.splice(index, 1);
                    form.setValue(name as any, newValues);
                  }}>
                  ×
                </Button>
              </div>
            ))}
          </div>
          <Button type="button" variant="outline" onClick={() => openKeywordDialog(name)}>
            添加
          </Button>
        </div>
      </FormControl>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
}
