import { Activity, Edit, Plus, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { useState, useEffect } from "react";
import { Badge } from "../../ui/badge";
import { ActivityLogProps } from "../../../services/Props";
import { fetchActivityLogs } from "../../../services/fetchData.api"
import { RenderActivityLogCard } from "./RenderActivityLogCard";
// import { ActivityDialog } from "./ActivityDialog";

export const ActivityLogs = () => {
    const [activityLogFilter, setActivityLogFilter] = useState<'added' | 'edited' | 'deleted'>('added');
    const [activityLogs, setActivityLogs] = useState<ActivityLogProps[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedActivity, setSelectedActivity] = useState<ActivityLogProps | null>(null);
    const [isActivityDetailOpen, setIsActivityDetailOpen] = useState(false);

    useEffect(() => {
        fetchActivityLogs()
          .then(res => {
            setActivityLogs(res); 
          })
          .catch(console.error)
          .finally(() => setLoading(false));
      }, []); 

    if (loading) return <p>Loading...</p>;

    return (
        <>
        <Tabs value={activityLogFilter} onValueChange={(value: any) => setActivityLogFilter(value as any)}>
            <TabsList className="grid w-full grid-cols-4 max-w-2xl">
            <TabsTrigger value="added">
                <Plus className="h-4 w-4 mr-2" />
                Added
            </TabsTrigger>
            <TabsTrigger value="edited">
                <Edit className="h-4 w-4 mr-2" />
                Edited
            </TabsTrigger>
            <TabsTrigger value="deleted">
                <Trash2 className="h-4 w-4 mr-2" />
                Deleted
            </TabsTrigger>
            </TabsList>

            <TabsContent value="added" className="mt-4">
            {(() => {
                const filteredLogs = activityLogs?.filter(log => 
                    log.type === 1 || log.type === 2 );

                return (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                        Showing {filteredLogs?.length} added items • New products and categories
                    </p>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                        <Plus className="h-3 w-3 mr-1" />
                        {filteredLogs?.length} Added
                    </Badge>
                    </div>
                    <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {filteredLogs?.map((log) => {
                        return <RenderActivityLogCard
                            key={log.id}
                            log={log}
                            setSelectedActivity={setSelectedActivity}
                            setIsActivityDetailOpen={setIsActivityDetailOpen}/>
                    })}
                    </div>
                    {filteredLogs?.length === 0 && (
                    <div className="text-center py-12">
                        <Plus className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600">No items added yet</p>
                        <p className="text-gray-500 text-sm mt-2">New products and categories will appear here</p>
                    </div>
                    )}
                </div>
                );
            })()}
            </TabsContent>

            <TabsContent value="edited" className="mt-4">
            {(() => {
                const filteredLogs = activityLogs?.filter(log => 
                    log.type === 3 || log.type === 4 );
                    
                return (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                        Showing {filteredLogs?.length} edited items • Product updates and stock changes
                    </p>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                        <Edit className="h-3 w-3 mr-1" />
                        {filteredLogs?.length} Edited
                    </Badge>
                    </div>
                    <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {filteredLogs?.map((log) => {
                        return <RenderActivityLogCard
                            key={log.id}
                            log={log}
                            setSelectedActivity={setSelectedActivity}
                            setIsActivityDetailOpen={setIsActivityDetailOpen}/>
                    })}
                    </div>
                    {filteredLogs?.length === 0 && (
                    <div className="text-center py-12">
                        <Edit className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600">No items edited yet</p>
                        <p className="text-gray-500 text-sm mt-2">Product updates and stock changes will appear here</p>
                    </div>
                    )}
                </div>
                );
            })()}
            </TabsContent>

            <TabsContent value="deleted" className="mt-4">
            {(() => {
                const filteredLogs = activityLogs?.filter(log => 
                    log.type === 5 || log.type === 6)
                    
                return (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                        Showing {filteredLogs?.length} deleted items • Removed products and categories (not restored)
                    </p>
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">
                        <Trash2 className="h-3 w-3 mr-1" />
                        {filteredLogs?.length} Deleted
                    </Badge>
                    </div>
                    <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {filteredLogs?.map((log) => {
                        return <RenderActivityLogCard
                            key={log.id}
                            log={log}
                            setSelectedActivity={setSelectedActivity}
                            setIsActivityDetailOpen={setIsActivityDetailOpen}/>
                    })}
                    </div>
                    {filteredLogs?.length === 0 && (
                    <div className="text-center py-12">
                        <Trash2 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600">No items deleted yet</p>
                        <p className="text-gray-500 text-sm mt-2">Removed products and categories will appear here</p>
                    </div>
                    )}
                </div>
                );
            })()}
            </TabsContent>
        </Tabs>
        
        {/* <ActivityDialog 
            selectedActivity={selectedActivity}
            isActivityDetailOpen={isActivityDetailOpen}
            setIsActivityDetailOpen={setIsActivityDetailOpen}/> */}
        </>
    );
}