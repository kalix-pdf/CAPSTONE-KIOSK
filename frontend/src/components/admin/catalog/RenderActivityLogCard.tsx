import { Activity, BarChart, ChevronRight, Clock, FileText, Pill, ShoppingCart, Tag, User } from "lucide-react";
import { Card, CardContent } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { ActivityLogProps } from "../../../services/Props";

interface Props {
  log: ActivityLogProps;
  setSelectedActivity: (log: ActivityLogProps) => void;
  setIsActivityDetailOpen: (open: boolean) => void;
}

export const RenderActivityLogCard = ({ log, setSelectedActivity, setIsActivityDetailOpen }: Props) => {

    const getLogIcon = () => {
      switch (log.type) {
        case 1:
        case 3:
        case 5:
          return <Pill className="h-4 w-4" />;
        case 2:
        case 6:
          return <Tag className="h-4 w-4" />;
        case 3:
          return <BarChart className="h-4 w-4" />;
        case 7:
          return <ShoppingCart className="h-4 w-4" />;
        default:
          return <Activity className="h-4 w-4" />;
      }
    };

    const getLogColor = () => {
      switch (log.type) {
        case 1:
        case 2:
          return 'bg-green-50 border-green-200';
        case 5:
        case 6:
          return 'bg-red-50 border-red-200';
        case 3:
        case 3:
          return 'bg-blue-50 border-blue-200';
        case 7:
          return 'bg-purple-50 border-purple-200';
        default:
          return 'bg-gray-50 border-gray-200';
      }
    };

    const getActionBadgeColor = () => {
      switch (log.type) {
        case 1:
        case 2:
          return 'bg-green-100 text-green-700 border-green-300';
        case 5:
        case 6:
          return 'bg-red-100 text-red-700 border-red-300';
        case 3:
        case 3:
          return 'bg-blue-100 text-blue-700 border-blue-300';
        case 7:
          return 'bg-purple-100 text-purple-700 border-purple-300';
        default:
          return 'bg-gray-100 text-gray-700 border-gray-300';
      }
    };

    const formatTimestamp = (date: string) => {
      const d = new Date(date);
      const now = new Date();
      const diffMs = now.getTime() - d.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
      
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      
      return d.toLocaleDateString('en-PH', { 
        month: 'short', 
        day: 'numeric', 
        year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
      });
    };

    return (
      <Card key={log.id} 
        className={`border-2 ${getLogColor()} cursor-pointer hover:shadow-md transition-shadow`}
        onClick={() => { setSelectedActivity(log); setIsActivityDetailOpen(true);}}>

        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="mt-1">
              {getLogIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <Badge variant="outline" className={`text-xs ${getActionBadgeColor()}`}>
                      {log.action}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <User className="h-3 w-3" />
                      {log.user}
                    </div>
                  </div>
                  <p className="text-base font-medium text-gray-900 py-2">{log.description}</p>
                  {log.type === 1 && (
                    <><p className="text-sm text-gray-900">Product Name: {log.product_name}</p>
                    <p className="text-sm text-gray-900">Category: {log.category_name}</p>
                    </>
                  )}
                  
                  {log.metadata?.changes && (
                    <div className="text-sm text-gray-600 mt-1 font-mono bg-white/50 px-2 py-1 rounded">
                      {log.metadata.changes.map((change, index) => (
                        <p key={index}> Changes:
                          <span className="font-semibold">{change.field}:</span>{" "}
                          <span className="line-through text-base text-red-500">{String(change.before)}</span>
                          {" → "}
                          <span className="text-green-600">{String(change.after)}</span>
                        </p>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-xs text-gray-500 whitespace-nowrap">
                    <Clock className="h-3 w-3" />
                    {formatTimestamp(log.date)}
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
};