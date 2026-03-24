import { useState, useEffect } from "react";
import { Button } from "../../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../ui/dialog";
import { Delete, Space } from "lucide-react";

interface OnScreenKeyboardProps {
  isOpen: boolean;
  onClose: () => void;
  onInput: (value: string) => void;
  initialValue?: string;
  title?: string;
  placeholder?: string;
  type?: "text" | "tel";
}

export function OnScreenKeyboard({
  isOpen,
  onClose,
  onInput,
  initialValue = "",
  title = "Enter Text",
  placeholder = "",
  type = "text"
}: OnScreenKeyboardProps) {
  const [value, setValue] = useState(initialValue);
  const [isShiftActive, setIsShiftActive] = useState(false);
  const [isCapsLock, setIsCapsLock] = useState(false);

  // Sync internal value with initialValue when it changes or when keyboard opens
  useEffect(() => {
    // For phone numbers, always start with +639 if empty
    if (type === "tel" && !initialValue) {
      setValue("+639");
    } else {
      setValue(initialValue);
    }
    // Reset shift and caps lock when opening new field
    setIsShiftActive(false);
    setIsCapsLock(false);
  }, [initialValue, isOpen, type]);

  const qwertyRows = [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"]
  ];

  const numericRows = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["+", "0", "-"]
  ];

  const specialChars = ["@", "#", "$", "%", "&", "*", "(", ")", "-", "_", "+", "="];

  const handleKeyPress = (key: string) => {
    let newValue = value;
    
    if (key === "BACKSPACE") {
      // For phone numbers, don't allow deleting the +639 prefix
      if (type === "tel" && value.length <= 4) {
        return;
      }
      newValue = value.slice(0, -1);
    } else if (key === "SPACE") {
      newValue = value + " ";
    } else if (key === "SHIFT") {
      setIsShiftActive(!isShiftActive);
      return;
    } else if (key === "CAPS") {
      setIsCapsLock(!isCapsLock);
      setIsShiftActive(false);
      return;
    } else {
      // For phone numbers, ensure +639 prefix is present
      if (type === "tel" && (value === "" || !value.startsWith("+639"))) {
        newValue = "+639" + key;
      } else {
        const shouldUppercase = isCapsLock || isShiftActive;
        newValue = value + (shouldUppercase ? key.toUpperCase() : key.toLowerCase());
      }
      
      // Reset shift after single key press (not caps lock)
      if (isShiftActive && !isCapsLock) {
        setIsShiftActive(false);
      }
    }
    
    setValue(newValue);
  };

  const handleDone = () => {
    onInput(value);
    onClose();
  };

  const handleCancel = () => {
    setValue(initialValue);
    onClose();
  };

  const handleClear = () => {
    // For phone numbers, reset to +639 prefix
    if (type === "tel") {
      setValue("+639");
    } else {
      setValue("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="max-w-4xl p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl">{title}</DialogTitle>
          <DialogDescription className="sr-only">
            {type === "text" ? "Use the on-screen keyboard to enter text" : "Use the numeric keypad to enter phone number"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Display Input */}
          <div className="bg-gray-50 border-2 border-blue-300 rounded-lg p-4 min-h-[80px] flex items-center">
            <div className="text-2xl w-full break-words">
              {value || <span className="text-gray-400">{placeholder}</span>}
            </div>
          </div>

          {type === "text" ? (
            // QWERTY Keyboard Layout
            <div className="space-y-2">
              {/* Number Row */}
              <div className="flex gap-1 justify-center">
                {qwertyRows[0].map((key) => (
                  <Button
                    key={key}
                    onClick={() => handleKeyPress(key)}
                    variant="outline"
                    className="h-14 w-14 text-xl font-semibold hover:bg-blue-100 hover:border-blue-400"
                  >
                    {key}
                  </Button>
                ))}
                <Button
                  onClick={() => handleKeyPress("BACKSPACE")}
                  variant="outline"
                  className="h-14 w-20 hover:bg-red-100 hover:border-red-400"
                >
                  <Delete className="h-5 w-5" />
                </Button>
              </div>

              {/* First Letter Row */}
              <div className="flex gap-1 justify-center">
                {qwertyRows[1].map((key) => (
                  <Button
                    key={key}
                    onClick={() => handleKeyPress(key)}
                    variant="outline"
                    className="h-14 w-14 text-xl font-semibold hover:bg-blue-100 hover:border-blue-400"
                  >
                    {isCapsLock || isShiftActive ? key.toUpperCase() : key.toLowerCase()}
                  </Button>
                ))}
              </div>

              {/* Second Letter Row */}
              <div className="flex gap-1 justify-center">
                <Button
                  onClick={() => handleKeyPress("CAPS")}
                  variant={isCapsLock ? "default" : "outline"}
                  className={`h-14 w-20 text-sm font-semibold ${isCapsLock ? "bg-blue-600" : "hover:bg-blue-100 hover:border-blue-400"}`}
                >
                  CAPS
                </Button>
                {qwertyRows[2].map((key) => (
                  <Button
                    key={key}
                    onClick={() => handleKeyPress(key)}
                    variant="outline"
                    className="h-14 w-14 text-xl font-semibold hover:bg-blue-100 hover:border-blue-400"
                  >
                    {isCapsLock || isShiftActive ? key.toUpperCase() : key.toLowerCase()}
                  </Button>
                ))}
              </div>

              {/* Third Letter Row */}
              <div className="flex gap-1 justify-center">
                <Button
                  onClick={() => handleKeyPress("SHIFT")}
                  variant={isShiftActive ? "default" : "outline"}
                  className={`h-14 w-20 text-sm font-semibold ${isShiftActive ? "bg-blue-600" : "hover:bg-blue-100 hover:border-blue-400"}`}
                >
                  SHIFT
                </Button>
                {qwertyRows[3].map((key) => (
                  <Button
                    key={key}
                    onClick={() => handleKeyPress(key)}
                    variant="outline"
                    className="h-14 w-14 text-xl font-semibold hover:bg-blue-100 hover:border-blue-400"
                  >
                    {isCapsLock || isShiftActive ? key.toUpperCase() : key.toLowerCase()}
                  </Button>
                ))}
                <Button
                  onClick={() => handleKeyPress("BACKSPACE")}
                  variant="outline"
                  className="h-14 w-20 hover:bg-red-100 hover:border-red-400"
                >
                  <Delete className="h-5 w-5" />
                </Button>
              </div>

              {/* Special Characters Row */}
              <div className="flex gap-1 justify-center">
                {specialChars.map((key) => (
                  <Button
                    key={key}
                    onClick={() => handleKeyPress(key)}
                    variant="outline"
                    className="h-14 w-14 text-xl font-semibold hover:bg-blue-100 hover:border-blue-400"
                  >
                    {key}
                  </Button>
                ))}
              </div>

              {/* Space Bar Row */}
              <div className="flex gap-2 justify-center">
                <Button
                  onClick={handleClear}
                  variant="outline"
                  className="h-14 w-28 text-base font-semibold hover:bg-yellow-100 hover:border-yellow-400"
                >
                  Clear
                </Button>
                <Button
                  onClick={() => handleKeyPress("SPACE")}
                  variant="outline"
                  className="h-14 flex-1 max-w-md hover:bg-blue-100 hover:border-blue-400"
                >
                  <Space className="h-5 w-5 mr-2" />
                  Space
                </Button>
                <Button
                  onClick={() => handleKeyPress(".")}
                  variant="outline"
                  className="h-14 w-14 text-xl font-semibold hover:bg-blue-100 hover:border-blue-400"
                >
                  .
                </Button>
                <Button
                  onClick={() => handleKeyPress(",")}
                  variant="outline"
                  className="h-14 w-14 text-xl font-semibold hover:bg-blue-100 hover:border-blue-400"
                >
                  ,
                </Button>
              </div>
            </div>
          ) : (
            // Numeric Keyboard Layout (for phone numbers)
            <div className="space-y-2 max-w-md mx-auto">
              {numericRows.map((row, rowIndex) => (
                <div key={rowIndex} className="flex gap-2 justify-center">
                  {row.map((key) => (
                    <Button
                      key={key}
                      onClick={() => handleKeyPress(key)}
                      variant="outline"
                      className="h-16 w-24 text-2xl font-semibold hover:bg-blue-100 hover:border-blue-400"
                    >
                      {key}
                    </Button>
                  ))}
                </div>
              ))}
              
              {/* Phone-specific keys */}
              <div className="flex gap-2 justify-center">
                <Button
                  onClick={handleClear}
                  variant="outline"
                  className="h-16 w-24 text-base font-semibold hover:bg-yellow-100 hover:border-yellow-400"
                >
                  Clear
                </Button>
                <Button
                  onClick={() => handleKeyPress("SPACE")}
                  variant="outline"
                  className="h-16 w-24 hover:bg-blue-100 hover:border-blue-400"
                >
                  <Space className="h-5 w-5" />
                </Button>
                <Button
                  onClick={() => handleKeyPress("BACKSPACE")}
                  variant="outline"
                  className="h-16 w-24 hover:bg-red-100 hover:border-red-400"
                >
                  <Delete className="h-5 w-5" />
                </Button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              onClick={handleCancel}
              variant="outline"
              className="flex-1 h-14 text-lg font-semibold"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDone}
              className="flex-1 h-14 text-lg font-semibold bg-blue-600 hover:bg-blue-700"
            >
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
