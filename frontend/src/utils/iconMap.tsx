import { Pill, Shield, Heart, Droplet, Stethoscope, Thermometer,Package } 
from "lucide-react";

export const iconMap: Record<string, any> = { Pill, Shield, Heart, Droplet, Stethoscope, Thermometer, Package };


const COLORS = [
    "bg-blue-50", "bg-blue-100", "bg-blue-500", "bg-blue-600", "bg-blue-700",
    "bg-cyan-500", "bg-gray-500", "bg-green-100",
    "bg-green-200", "bg-green-500", "bg-green-600", "bg-indigo-500"
];

export const getRandomIcon = () => {
    const icons = Object.keys(iconMap);
    return icons[Math.floor(Math.random() * icons.length)];
}

export const getRandomColor = () => {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
}