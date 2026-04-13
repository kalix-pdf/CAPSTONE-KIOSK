import { AlertTriangle, Check, CheckCircle2, FileText, Pill, XCircle } from "lucide-react";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Product, AIResponse } from "../../../services/Props";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground mb-2">
      {children}
    </p>
  );
}

function InfoRow({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex justify-between items-start py-[7px] border-b border-border last:border-0 text-base gap-3">
      <span className="text-muted-foreground shrink-0 min-w-[130px]">{label}</span>
      {value
        ? <span className="text-right text-foreground">{value}</span>
        : <span className="text-right text-muted-foreground/60 italic">Not detected</span>}
    </div>
  );
}
 
function AccuracyBar({ level }: { level: number }) {
  const color =
    level >= 90 ? "bg-green-500" :
    level >= 75 ? "bg-yellow-500" :
    "bg-red-500";
  const badge =
    level >= 90 ? <Badge className="bg-green-100 text-green-800 border-0 text-[11px]">High</Badge> :
    level >= 75 ? <Badge className="bg-yellow-100 text-yellow-800 border-0 text-[11px]">Medium</Badge> :
                  <Badge className="bg-red-100 text-red-800 border-0 text-[11px]">Low</Badge>;
 
  return (
    <div className="flex gap-4 items-center">
      <div className="flex-1">
        <p className="text-base text-muted-foreground mb-1">OCR confidence</p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-medium">{level}%</span>
          {badge}
        </div>
        <div className="mt-2 h-1.5 rounded-full bg-secondary overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${level}%` }} />
        </div>
        {level < 75 && (
          <p className="text-[11px] text-muted-foreground mt-1.5">
            Try better lighting or flatten the document for a cleaner scan.
          </p>
        )}
      </div>
    </div>
  );
}

function InvalidDocumentView({
  error,
  onReset,
  onCancel,
  errorTitle,
  errorIllustration
}: {
  error: string;
  onReset: () => void;
  onCancel: () => void;
  errorTitle: string;
  errorIllustration: string;
}) {
  return (
    <div className="space-y-4">
      {/* Error banner */}
      <div className="flex gap-3 items-start p-3 rounded-lg bg-destructive/10 border border-destructive/25 text-destructive">
        <XCircle className="h-5 w-5 shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-base">Invalid document</p>
          <p className="text-base mt-0.5 opacity-80">{error}</p>
        </div>
      </div>
 
      {/* Illustration + message */}
      <div className="rounded-lg border bg-card p-6 text-center space-y-3">
        <div className="mx-auto w-14 h-14 rounded-full bg-muted flex items-center justify-center">
          <FileText className="h-7 w-7 text-muted-foreground" />
        </div>
        <div>
          <p className="font-medium text-sm">{errorTitle}</p>
          <p className="text-base text-muted-foreground mt-1 max-w-xs mx-auto">
            {errorIllustration}
          </p>
        </div>
      </div>
 
      {/* Checklist */}
      {errorTitle === "Not a prescription" ? (
        <div className="rounded-lg border bg-card p-4">
          <SectionLabel>What a valid prescription looks like</SectionLabel>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {[
              "Prescriber name and credentials (MD, DO, NP, PA)",
              "Patient name or date of birth",
              "At least one medication with dosage",
              "Prescriber signature or DEA / license number",
              "Date of issue",
            ].map((item) => (
              <li key={item} className="flex gap-2 items-start">
                <Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ): (
        <div className="rounded-lg border bg-card p-4">
          <SectionLabel>What a valid Medicine looks like</SectionLabel>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {[
              "Medication name and dosage",
              "Manufacturer information",
              "Make sure the medicine label is clear and not blurry",
            ].map((item) => (
              <li key={item} className="flex gap-2 items-start">
                <Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
 
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={onCancel}>Cancel</Button>
        <Button className="flex-1" onClick={onReset}>Try again</Button>
      </div>
    </div>
  );
}


function ValidResultView({ AIResponse, recognizedMeds, onReset, onConfirm }: {
  AIResponse: AIResponse;
  recognizedMeds: Product[];
  onReset: () => void;
  onConfirm: () => void;
}) {
  const extracted = AIResponse.extractedText;
  const level = Number(extracted.AccuracyLevel ?? 0);
  const isLowAccuracy = level < 75;
 
  return (
    <div className="space-y-4">
      {/* Success banner */}
      <div className="flex gap-3 items-start p-3 rounded-lg bg-green-50 border border-green-200 text-green-900">
        <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-sm">Valid prescription detected</p>
          <p className="text-base mt-0.5 opacity-80">Review the extracted information below before adding to cart.</p>
          <p className="text-base mt-0.5 opacity-80">I-Review ang na-iskan na reseta bago i-add to cart</p>
        </div>
      </div>
 
      {/* Prescription details */}
      <div className="rounded-lg border bg-card p-4">
        <SectionLabel>Prescription details / Detalye ng Reseta</SectionLabel>
        <InfoRow label="Patient" value={extracted.ExtractedText?.PatientInfo} />
        <InfoRow label="Prescriber" value={extracted.ExtractedText?.PrescriberName} />
        <InfoRow label="Clinic address" value={extracted.ExtractedText?.PrescriberAddress} />
        <InfoRow label="Date issued" value={extracted.ExtractedText?.DateIssued} />
        <InfoRow label="License no." value={extracted.ExtractedText?.LicenseNumber} />
        <InfoRow label="DEA number" value={extracted.ExtractedText?.DEANumber} />
        {extracted.ExtractedText?.AdditionalNotes && (
          <InfoRow label="Notes" value={extracted.ExtractedText.AdditionalNotes} />
        )}
      </div>
 
      {/* Medications on the Rx */}
      {(extracted.ExtractedText?.Medications?.length ?? 0) > 0 && (
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between mb-3">
            <SectionLabel>Medications on prescription / Na-Iskan na gamot sa Reseta</SectionLabel>
            <Badge variant="secondary">{extracted.ExtractedText!.Medications.length} item(s)</Badge>
          </div>
          <div className="space-y-2">
            {extracted.ExtractedText!.Medications.map((med, i) => (
              <div key={i} className="rounded-md bg-secondary/50 border-l-[3px] border-green-500 px-3 py-2.5">
                <p className="font-medium text-base">{med.Name}</p>
                <p className="text-base text-muted-foreground mt-0.5">
                  {[med.Dosage, med.Instructions, med.Quantity && `Qty: ${med.Quantity}`, med.Refills && `Refills: ${med.Refills}`]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
 
      {/* Matched products */}
      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-center justify-between mb-1">
          <SectionLabel>Available in pharmacy</SectionLabel>
          <Badge variant={recognizedMeds.length > 0 ? "secondary" : "outline"}>
            {recognizedMeds.length} matched
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">You can modify / change the branded or generic medicine in cart</p>
        <p className="text-sm text-muted-foreground mb-3">Maaari mong baguhin ang branded o generic, dagdagan, alisin ang gamot sa cart section</p>
 
        {recognizedMeds.length > 0 ? (
          <div className="divide-y divide-border">
            {recognizedMeds.map((med) => (
              <div key={med.id} className="flex items-center gap-3 py-2.5">
                <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <Check className="h-3.5 w-3.5 text-green-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-medium truncate">{med.name} {med.manufacturer}</p>
                  <p className="text-sm text-muted-foreground">{med.dosage}</p>
                  <div className="flex gap-1.5 mt-1.5 flex-wrap">
                    <Badge variant={med.type === 1 ? "secondary" : "destructive"} className="text-[10px] p-2 bg-red-50 text-red-700 border-red-300">
                      {med.type === 1 ? "Branded" : "Generic"}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] p-2 bg-red-50 text-red-700 border-red-300">
                      {med.prescriptionrequired === 1 ? "Rx required" : "OTC Medicine"}
                    </Badge>
                    <Badge variant={med.stock > 0 ? "secondary" : "destructive"}
                      className="text-[10px] p-2" >
                      {med.stock > 0 ? "In stock" : "Out of stock"}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm font-medium shrink-0">
                  ₱{med.price.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-5 space-y-1">
            <Pill className="h-8 w-8 mx-auto text-muted-foreground/40" />
            <p className="text-base font-medium">No matching products</p>
            <p className="text-base text-muted-foreground">
              {AIResponse.message ?? "The prescribed medication is not currently in our inventory."}
            </p>
          </div>
        )}
      </div>
 
      {/* Accuracy */}
      <div className="rounded-lg border bg-card p-4">
        <AccuracyBar level={level} />
      </div>
 
      {/* Pharmacist notice */}
      <div
        className={`flex gap-3 items-start p-3 rounded-lg border text-sm ${
          isLowAccuracy
            ? "bg-red-50 border-red-200 text-red-900"
            : "bg-amber-50 border-amber-200 text-amber-900"
        }`}
      >
        <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
        <div>
          <p className="font-medium">
            {isLowAccuracy ? "Pharmacist review strongly recommended" : "Pharmacist verification required"}
          </p>
          <p className="text-sm mt-0.5 opacity-80">
            {isLowAccuracy
              ? `Confidence is ${level}% — below the 75% threshold. A pharmacist must manually verify the original prescription.`
              : "A licensed pharmacist must confirm this prescription before dispensing any medication."}
          </p>
          <hr className="py-2"/>
          <p className="text-sm mt-0.5 opacity-80">
            {isLowAccuracy
              ? "Mababa ang konpidensya ng system sa na-iskan na reseta. Manual checking ng pharmasya ay kinakailangan."
              : "Mataas ang konpidensya ng system, maari pa rin itong i-verify ng pharmasya"}
          </p>
          
        </div>
      </div>
 
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={onReset}>Scan again</Button>
        <Button
          className="flex-1"
          disabled={recognizedMeds.length === 0}
          onClick={onConfirm}
        >
          Add to cart ({recognizedMeds.length})
        </Button>
      </div>
    </div>
  );
}

export { ValidResultView, SectionLabel, InfoRow, AccuracyBar, InvalidDocumentView }