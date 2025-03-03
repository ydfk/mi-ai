import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface KeywordDialogProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  onAddKeyword: (keyword: string) => void;
}

export function KeywordDialog({ isOpen, setIsOpen, onAddKeyword }: KeywordDialogProps) {
  const [newKeyword, setNewKeyword] = useState("");

  const handleAddKeyword = () => {
    if (newKeyword) {
      onAddKeyword(newKeyword);
      setNewKeyword("");
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>添加关键词</DialogTitle>
        </DialogHeader>
        <Input value={newKeyword} onChange={(e) => setNewKeyword(e.target.value)} placeholder="请输入关键词" />
        <DialogFooter>
          <Button onClick={handleAddKeyword}>添加</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
