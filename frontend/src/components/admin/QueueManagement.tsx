import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { QueueTicket } from "../../services/Props";
import { Phone, CheckCircle, XCircle, Clock, BarChart, Users, FileText, Pill, Eye, AlertTriangle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { updateOrder } from "../../services/admin/updateData.api";

interface QueueManagementProps {
  orders: QueueTicket[] | null;
  completedToday: { total: number } | null;
  waitingQueue: QueueTicket[] | null;
}

export function QueueManagement({ orders, completedToday, waitingQueue}  : QueueManagementProps) {
  const [showPrescriptionDialog, setShowPrescriptionDialog] = useState(false);  
  const currentlyServing = orders?.filter(ticket => ticket.status === 2);
  const completed = orders?.filter(ticket => ticket.status === 3);
  
  // const averageWaitTime = currentlyServing.length > 0
  //   ? Math.floor(currentlyServing.reduce((acc, t) => {
  //       const waitTime = (new Date().getTime() - new Date(t.joinTime).getTime()) / 1000 / 60;
  //       return acc + waitTime;
  //     }, 0) / queue.length)
  //   : 0;

  // const getServiceLabel = (service: string) => {
  //   const labels: Record<string, string> = {
  //     "prescription-pickup": "Prescription Pickup",
  //     "consultation": "Pharmacist Consultation",
  //     "vaccine": "Vaccination Service",
  //     "general": "General Inquiry"
  //   };
  //   return labels[service] || service;
  // };

  const getWaitTime = (joinTime: string | Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - new Date(joinTime).getTime()) / 1000 / 60);
    return diff;
  };

  const orderUpdate = async(type: number, order_id: number) => {
    const result = await updateOrder(type, order_id)

    if (!result.success) {
      return result.message;
    } else {
      return result.message;
    }

  }

  const handleCallNext = async(id: number) => {
    if (waitingQueue?.length === 0) {
      toast.error("No customers in queue");
      return;
    }

    const message = await orderUpdate(2, id);
    toast.success(message);
  };

  const handleComplete = async(id: number) => {
    const message = await orderUpdate(3, id);
    toast.success(message);
  };

  const handleNoShow = async(id: number) => {
    const message = await orderUpdate(4, id);
    toast.success(message);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-gray-900">Queue Management</h2>
          <p className="text-gray-600">Manage customer queue and service flow</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card padded>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>In Queue</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-gray-900">{waitingQueue?.length}</div>
              <p className="text-muted-foreground">Waiting customers</p>
            </CardContent>
          </Card>

          <Card padded>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-gray-900">{completedToday?.total}</div>
              <p className="text-muted-foreground">Today</p>
            </CardContent>
          </Card>

          <Card padded>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Avg Wait</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {/* <div className="text-gray-900">{averageWaitTime}m</div> */}
              <p className="text-muted-foreground">Average time</p>
            </CardContent>
          </Card>

          <Card padded>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Total Today</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-gray-900">{currentlyServing?.length}</div>
              <p className="text-muted-foreground">All customers</p>
            </CardContent>
          </Card>
        </div>

        {/* Currently Serving */}
      <Card padded className="border-2 border-green-500">
        <CardHeader className="bg-green-50">
          <CardTitle>Currently Serving</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {currentlyServing && currentlyServing.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="text-5xl font-bold text-green-600">
                    #{currentlyServing[0].queue_number}
                  </div>
                  <div>
                    <p className="text-gray-600">Prescription Pickup</p>
                    <Badge variant="outline" className="mt-2">
                      Wait time: {getWaitTime(currentlyServing[0].created_at)}m
                    </Badge>
                    {currentlyServing[0].phone_number && (
                      <Badge variant="outline" className="mt-2 ml-2">
                        <Phone className="h-3 w-3 mr-1" />
                        {currentlyServing[0].phone_number}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {currentlyServing[0].prescriptiondata?.image_url !== null && (
                    <Button onClick={() => setShowPrescriptionDialog(true)}
                      size="lg" variant="outline" className="bg-blue-50 hover:bg-blue-100">
                      <Eye className="h-5 w-5 mr-2" />
                      View Prescription
                      {(currentlyServing[0].prescriptiondata?.extractedText?.AccuracyLevel ?? 100) < 90 && (
                        <Badge variant="destructive" className="ml-2">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Review
                        </Badge>
                      )}
                    </Button>
                  )}
                  <Button onClick={() => handleComplete(currentlyServing[0].order_id)}
                    size="lg" className="bg-green-600 hover:bg-green-700">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Complete
                  </Button>
                  <Button onClick={() => handleNoShow(currentlyServing[0].order_id)}
                    size="lg" variant="destructive">
                    <XCircle className="h-5 w-5 mr-2" />
                    No Show
                  </Button>
                </div>
              </div>

              {/* Order Items Summary */}
              {currentlyServing?.[0]?.items && currentlyServing?.[0]?.items.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-gray-900 mb-3 flex items-center gap-2">
                    <Pill className="h-4 w-4" />
                    Order Items ({currentlyServing?.[0]?.items.length})
                  </h4>
                  <div className="space-y-2">
                    {currentlyServing?.[0]?.items.map((item) => (
                      <div key={item.product_id} className="flex justify-between text-sm">
                        <span className="text-gray-700">
                          {item.product_name} - {item.dosage} x {item.quantity}
                        </span>
                        <span className="text-gray-900">
                          ₱{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                    <div className="border-t pt-2 mt-2 flex justify-between">
                      <span className="text-gray-900">Total:</span>
                      <span className="text-gray-900">
                        ₱{currentlyServing?.[0]?.total_amount}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* OCR Accuracy Display */}
              {(() => {
                const accuracyLevel = currentlyServing?.[0]?.prescriptiondata?.extractedText?.AccuracyLevel;
                return accuracyLevel !== null && accuracyLevel !== undefined && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-gray-900 mb-3 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      OCR Scan Quality
                    </h4>
                    <div className="flex items-center gap-4">
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                        accuracyLevel >= 90
                          ? 'bg-green-100 text-green-800'
                          : accuracyLevel >= 70
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {accuracyLevel >= 90 ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <AlertTriangle className="h-5 w-5" />
                        )}
                        <div>
                          <div className="font-semibold">{accuracyLevel}% Accuracy</div>
                          <div className="text-sm">
                            Confidence: {accuracyLevel >= 90 ? 'High' : accuracyLevel >= 70 ? 'Medium' : 'Low'}
                          </div>
                        </div>
                      </div>
                      {accuracyLevel < 90 && (
                        <div className="flex-1 text-sm text-orange-700">
                          <AlertTriangle className="h-4 w-4 inline mr-1" />
                          Manual verification required
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : (  // ← THIS was the main bug: the else branch was nested inside the if block
            <div className="text-center py-8">
              <p className="text-2xl text-gray-400 mb-4">No customer being served</p>
              <Button
                onClick={() => waitingQueue?.[0]?.order_id && handleCallNext(waitingQueue[0].order_id)}
                disabled={!waitingQueue?.[0]?.order_id}
                size="lg"
              >
                <Phone className="h-5 w-5 mr-2" /> Call Next Customer
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

        {/* Prescription Viewer Dialog */}
        <Dialog open={showPrescriptionDialog} onOpenChange={setShowPrescriptionDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {currentlyServing?.[0]?.prescriptiondata && (() => {
              const prescriptiondata = currentlyServing[0].prescriptiondata;
              const accuracyLevel = prescriptiondata?.extractedText?.AccuracyLevel;

              return (
                <>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Prescription Details - {currentlyServing[0].queue_number}
                    </DialogTitle>
                    <DialogDescription />
                  </DialogHeader>

                  {/* OCR Accuracy and Confidence Metrics */}
                  {accuracyLevel != null && (
                    <Card className={`border-2 ${
                      accuracyLevel >= 90 ? 'border-green-300 bg-green-50'
                      : accuracyLevel >= 70 ? 'border-yellow-300 bg-yellow-50'
                      : 'border-red-300 bg-red-50'
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              {accuracyLevel >= 90 ? (
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                              ) : (
                                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                              )}
                              <p className="text-gray-700">OCR Accuracy</p>
                            </div>
                            <div className="text-2xl text-gray-900">{accuracyLevel}%</div>
                            <p className="text-xs text-gray-600 mt-1">
                              Confidence level: {accuracyLevel >= 90 ? 'High' : accuracyLevel >= 70 ? 'Medium' : 'Low'}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Warning for low accuracy */}
                  {accuracyLevel != null && accuracyLevel < 90 && (
                    <div className="bg-orange-50 border-2 border-orange-400 p-4 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-6 w-6 text-orange-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-orange-900">
                            <strong>⚠️ Verification Alert - Pharmacist Action Required</strong>
                          </p>
                          <p className="text-orange-800 mt-2">
                            The OCR accuracy level is below the recommended 90% threshold. Confidence level: {accuracyLevel >= 70 ? 'Medium' : 'Low'}.
                          </p>
                          <ul className="text-orange-800 text-sm mt-2 ml-4 space-y-1 list-disc">
                            <li>Carefully verify the original physical prescription</li>
                            <li>Cross-check extracted medication names and dosages</li>
                            <li>Confirm patient information matches</li>
                            <li>Consult with prescribing physician if discrepancies found</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  <Tabs defaultValue="scanned" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="scanned">Scanned Image</TabsTrigger>
                      <TabsTrigger value="extracted">Extracted Text</TabsTrigger>
                      <TabsTrigger value="medications">Medications</TabsTrigger>
                    </TabsList>

                    {/* Scanned Image Tab */}
                    {prescriptiondata.image_url ? (
                      <TabsContent value="scanned" className="space-y-4">
                      <Card>
                        <CardContent className="p-6">
                          <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center min-h-[400px]">
                            <img src={`http://localhost:5000/${prescriptiondata.image_url.replace(/\\/g, "/")}`} />
                              {/* alt="Scanned Prescription" className="max-w-full max-h-[500px] rounded shadow-lg" /> */}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    ) : (
                      <p className="text-gray-400">No prescription image available</p>
                    )}

                    {/* Extracted Text Tab */}
                    <TabsContent value="extracted" className="space-y-4">
                      <Card className="py-4">
                        <CardHeader>
                          <CardTitle>OCR Extracted Text</CardTitle>
                          <CardDescription>Text extracted from the scanned prescription</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="bg-gray-50 rounded-lg p-6">
                            <pre className="text-gray-900 whitespace-pre-wrap font-mono text-sm">
                              {typeof prescriptiondata.extractedText === 'object'
                                ? JSON.stringify(prescriptiondata.extractedText, null, 2)
                                : prescriptiondata.extractedText}
                            </pre>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* Medications Tab */}
                    <TabsContent value="medications" className="space-y-4">
                      <Card className="py-4">
                        <CardHeader>
                          <CardTitle>Extracted Medications</CardTitle>
                          <CardDescription />
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            Mediciation Name: {prescriptiondata?.extractedText?.RecognizedMeds}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>

                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                    <p className="text-yellow-900">
                      ⚠️ <strong>Reminder:</strong> Verify the original prescription document before dispensing medications.
                    </p>
                  </div>
                </>
              );
            })()}
          </DialogContent>
        </Dialog>

        {/* Queue Table */}
        <Card padded className="border-lumot-600">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Waiting Queue</CardTitle>
                <CardDescription>{currentlyServing?.length} customers waiting</CardDescription>
              </div>
                <Button onClick={() => waitingQueue?.[0]?.order_id && handleCallNext(waitingQueue[0].order_id)}
                    disabled={!waitingQueue?.[0]?.order_id} size="lg" >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Next
                </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Position</TableHead>
                  <TableHead>Ticket #</TableHead>
                  {/* <TableHead>Name</TableHead> */}
                  <TableHead>Service</TableHead>
                  <TableHead>Wait Time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {waitingQueue && waitingQueue?.length > 0 ? (
                  waitingQueue?.map((ticket, index) => (
                    <TableRow key={ticket.order_id}>
                      <TableCell>
                        <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center">
                          <span className="text-blue-600">{index + 1}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">#{ticket.queue_number}</TableCell>
                      {/* <TableCell>{ticket.name}</TableCell> */}
                      <TableCell>Prescription Pickup</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          {getWaitTime(ticket.created_at)}m
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-yellow-50">
                          Waiting
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-400 py-8">
                      No customers in queue
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}