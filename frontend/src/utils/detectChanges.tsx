
export function detectChanges( formData: Record<string, any>, original: Record<string, any>,
    omit: string[] = ["id", "createdAt", "updatedAt"] ): Array<{ field: string; before: any; after: any }> {
    
    return Object.keys(formData)
        .filter((key) => {
            if (omit.includes(key)) return false;
            return String(formData[key]) !== String(original[key]);
        })
        .map((key) => ({
            field: key,
            before: original[key],
            after: formData[key],
        }));
}