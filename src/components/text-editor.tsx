import React, { useState, useRef, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bold,
  Italic,
  List,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
} from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const TextEditor: React.FC<{
  onChange: (text: string) => void;
  text: string;
  className?: string;
}> = ({ onChange, text: t, className }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [alignment, setAlignment] = useState<"left" | "center" | "right">(
    "left"
  );
  const [fontSize, setFontSize] = useState("16px");
  const [headingLevel, setHeadingLevel] = useState("p");

  const execCommand = (command: string, value: string = "") => {
    document.execCommand(command, false, value);
  };

  const ButtonBold = () => {
    execCommand("bold");
    setIsBold(!isBold);
  };

  const ButtonItalic = () => {
    execCommand("italic");
    setIsItalic(!isItalic);
  };

  const ButtonList = () => {
    execCommand("insertUnorderedList");
  };

  const setTextAlignment = (align: "left" | "center" | "right") => {
    execCommand("justifyLeft");
    execCommand("justifyCenter");
    execCommand("justifyRight");
    execCommand(`justify${align.charAt(0).toUpperCase() + align.slice(1)}`);
    setAlignment(align);
  };

  const changeFontSize = (size: string) => {
    execCommand("fontSize", "7");
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const span = document.createElement("span");
      span.style.fontSize = size;
      range.surroundContents(span);
    }
    setFontSize(size);
  };

  const changeHeadingLevel = (level: string) => {
    if (level === "p") {
      execCommand("formatBlock", "<p>");
    } else {
      execCommand("formatBlock", `<${level}>`);
    }
    setHeadingLevel(level);
  };

  useEffect(() => {
    if (editorRef.current?.innerHTML === t) return;

    if (editorRef.current) {
      editorRef.current.innerHTML = t; // Set initial text
    }
  }, [t]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML); // Pass updated content
    }
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="bg-muted p-2 flex flex-wrap gap-2 items-center">
        <Button
          type="button"
          variant={isBold ? "default" : "ghost"}
          onClick={ButtonBold}
          aria-label="Button bold"
          size="sm"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={isItalic ? "default" : "ghost"}
          onClick={ButtonItalic}
          aria-label="Button italic"
          size="sm"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          onClick={ButtonList}
          aria-label="Button list"
          size="sm"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={alignment === "left" ? "default" : "ghost"}
          onClick={() => setTextAlignment("left")}
          aria-label="Align left"
          size="sm"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={alignment === "center" ? "default" : "ghost"}
          onClick={() => setTextAlignment("center")}
          aria-label="Align center"
          size="sm"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={alignment === "right" ? "default" : "ghost"}
          onClick={() => setTextAlignment("right")}
          aria-label="Align right"
          size="sm"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <Select value={fontSize} onValueChange={changeFontSize}>
          <SelectTrigger className="w-[90px]">
            <SelectValue>
              <Type className="h-4 w-4 mr-2 inline-block" />
              {fontSize}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {["12px", "14px", "16px", "18px", "20px", "24px"].map(
              (size, idx) => (
                <SelectItem key={idx} value={size}>
                  {size}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
        <Select value={headingLevel} onValueChange={changeHeadingLevel}>
          <SelectTrigger className="w-[70px]">
            <SelectValue>{headingLevel.toUpperCase()}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {["p", "h1", "h2", "h3"].map((level, idx) => (
              <SelectItem key={idx} value={level}>
                {level.toUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div
        ref={editorRef}
        className={cn(
          "p-4 min-h-[200px] prose prose-sm max-w-none focus:outline-none",
          className
        )}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput} // Listen for content changes
        style={{ textAlign: alignment }}
      />
    </div>
  );
};

export default TextEditor;
