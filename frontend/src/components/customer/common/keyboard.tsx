import { useState } from "react";

export const keyboardActivate = () => {
    const [showKeyboard, setShowKeyboard] = useState(false);
    const [keyboardField, setKeyboardField] = useState<"name" | "phone" | "search" | null>(null);
    const [keyboardValue, setKeyboardValue] = useState("");
    
    return {
        showKeyboard,
        setShowKeyboard,
        keyboardField,
        setKeyboardField,
        keyboardValue,
        setKeyboardValue
    };

}