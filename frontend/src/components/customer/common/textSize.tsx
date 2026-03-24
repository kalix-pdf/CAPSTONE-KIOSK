
export const getTextSizeClass = (baseSize: string) => {
        const textSize = "small";
        if (textSize === "small") {
        const sizeMap: { [key: string]: string } = {
            "text-sm": "text-xs",
            "text-base": "text-sm",
            "text-lg": "text-base",
            "text-xl": "text-lg",
            "text-2xl": "text-xl",
            "text-3xl": "text-2xl",
            "text-4xl": "text-3xl",
            "text-6xl": "text-5xl"
        };
        return sizeMap[baseSize] || baseSize;
        } else if (textSize === "large") {
        const sizeMap: { [key: string]: string } = {
            "text-xs": "text-sm",
            "text-sm": "text-base",
            "text-base": "text-lg",
            "text-lg": "text-xl",
            "text-xl": "text-2xl",
            "text-2xl": "text-3xl",
            "text-3xl": "text-4xl",
            "text-4xl": "text-5xl",
            "text-5xl": "text-6xl",
            "text-6xl": "text-7xl"
        };
        return sizeMap[baseSize] || baseSize;
        }
        return baseSize;
};