import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
import * as fs from "node:fs";
import { getProduct } from '../services/product.service.js';
import { saveOCRImage } from "../services/user.service.js"

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function AIPoweredProductDetails (req, res) {
    try {
        const { product_name } = req.body;

        const prompt = `
                You are a medical/pharmaceutical expert. Generate detailed information about the product: "${product_name}".
                
                Respond ONLY with a valid JSON object. No markdown, no code blocks, no explanation.
                
                Use this exact structure:
                {
                "overview": "A 2-3 sentence summary of what this product is and what it treats",
                "howToUse": [
                    "Step or instruction 1",
                    "Step or instruction 2",
                    "Step or instruction 3"
                ],
                "drugInteractions": [
                    "Interaction warning 1",
                    "Interaction warning 2"
                ],
                "precautions": [
                    "Precaution 1",
                    "Precaution 2"
                ],
                "storageInstructions": [
                    "Storage instruction 1",
                    "Storage instruction 2"
                ],
                "whenToSeekHelp": [
                    "Situation 1",
                    "Situation 2"
                ],
                "faqs": [
                    "Q: Question? A: Answer."
                ],
                "dosageRecommendations": {
                    "adults": "Dosage for adults",
                    "elderly": "Dosage for elderly",
                    "children": "Dosage for children",
                    "notes": "Important dosage notes"
                }
                }
            `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",   
            contents: prompt,
        });
        const text = response.text;

        const clean = text.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(clean);

        // console.log('Gemini response:', JSON.stringify(parsed, null, 2));

        return res.status(200).json(parsed);

    } catch (error) {
        console.error('Gemini AI error:', error);
        return res.status(500).json({ message: 'Failed to generate product details' });
    }

}


export async function PrescriptionAIPowered (req, res) {
    const filePath = req.file.path;

    // const base64ImageFile = fs.readFileSync(filePath, {
    //     encoding: "base64",
    // });

    const scannedID = await saveOCRImage(filePath, 0);

    try {
        // const prompt = `You are a highly trained medical and pharmaceutical document analyst with expertise in verifying prescription authenticity.
        //         Your task has TWO phases:
        //         ---
        //         PHASE 1 — IMAGE VALIDATION
        //         First, determine if the image is a legitimate prescription document.
        //         A valid prescription typically contains:
        //         - A prescriber's name, credentials (MD, DO, NP, PA, etc.), and contact info
        //         - Patient name and/or date of birth
        //         - At least one medication name with dosage or instructions
        //         - A prescriber signature or DEA number
        //         - A date of issue

        //         If the image does NOT appear to be a prescription (e.g., it's a photo, screenshot, food label, ID card, blank page, unrelated document, etc.), respond ONLY with this exact JSON and nothing else:
        //         {
        //         "Valid": false,
        //         "Error": "Invalid Input: No prescription detected."
        //         }
        //         ---
        //         PHASE 2 — EXTRACTION (only if image passes Phase 1)
        //         If the image IS a prescription, extract all readable information and respond ONLY with this exact JSON structure. No markdown, no code blocks, no extra explanation:
        //         {
        //         "Valid": true,
        //         "RecognizedMeds": [
        //             "medication name ONLY, no dosage (e.g., Lipitor, Metformin)"
        //         ],
        //         "ExtractedText": {
        //             "PatientInfo": "patient name and/or date of birth if visible, else null",
        //             "PrescriberName": "prescriber full name and credentials, else null",
        //             "PrescriberAddress": "clinic or office address if visible, else null",
        //             "DateIssued": "prescription date if visible, else null",
        //             "Medications": [
        //             {
        //                 "Name": "medication name",
        //                 "Dosage": "dosage if visible, else null",
        //                 "Instructions": "sig/directions if visible, provide english and tagalog translation, else null",
        //                 "Quantity": "number of tablets or units if visible, else null",
        //                 "Refills": "refill information if visible, else null"
        //             }
        //             ],
        //             "DEANumber": "DEA number if visible, else null",
        //             "LicenseNumber": "license number if visible, else null",
        //             "AdditionalNotes": "any other relevant text on the prescription, else null"
        //         },
        //         "Accuracy": "low if below 85%, high if above 90%, medium otherwise",
        //         "AccuracyLevel": a plain integer 0-100 representing OCR confidence, no % symbol, no quotes (e.g., 95)
        //         }`;
        //  const response = await ai.models.generateContent({
        //     model: "gemini-2.5-flash",
        //     contents: [
        //         {
        //             inlineData: {
        //                 mimeType: "image/jpeg",
        //                 data: base64ImageFile,
        //             },
        //         },
        //         { text: prompt }
        //     ],
        // });

        // const text = response.text.trim();
        // const clean = text.replace(/```json|```/g, "").trim();
        // const parsed = JSON.parse(clean);

        // const recognizedMeds = await Promise.all(
        //     (Array.isArray(parsed?.['RecognizedMeds']) ? parsed['RecognizedMeds'] : []).map(med => getProduct(med))
        // );
        
        // const flatResults = recognizedMeds.flat();

        // if (flatResults.length === 0) {
        //     return res.status(200).json({scanned_id: scannedID, extractedText: parsed, RecognizedMeds: [],
        //         message: "No available medicine found" });
        // }

        // return res.status(200).json({scanned_id: scannedID, extractedText: parsed, RecognizedMeds: flatResults });

      const hardcodedResponse = {
        // extractedText: {
        //     Valid: false,
        //     Error: "Invalid Input: No prescription detected."
        // }
        scanned_id: scannedID,
        extractedText: {
            Valid: true,
            RecognizedMeds: ["Lisinopril", "Metformin", "Atorvastatin"],
            ExtractedText: {
                PatientInfo: "Juan dela Cruz, DOB: 03/15/1980",
                PrescriberName: "Dr. Maria Santos, M.D.",
                PrescriberAddress: "123 Rizal Avenue, Makati City, Metro Manila, Philippines",
                DateIssued: "03/21/2026",
                Medications: [
                    {
                        Name: "Paracetamo Bigogesic",
                        Dosage: "10mg",
                        Instructions: "Take 1 tablet by mouth once daily in the morning",
                        Quantity: "30 tablets",
                        Refills: "3 refills"
                    },
                    {
                        Name: "Bioflu",
                        Dosage: "500mg",
                        Instructions: "Take 1 tablet by mouth twice daily with meals",
                        Quantity: "60 tablets",
                        Refills: "2 refills"
                    },
                    {
                        Name: "Atorvastatin",
                        Dosage: "20mg",
                        Instructions: "Take 1 tablet by mouth once daily at bedtime",
                        Quantity: "30 tablets",
                        Refills: null
                    }
                ],
                DEANumber: null,
                LicenseNumber: "PRC-12345678",
                AdditionalNotes: "Patient advised to monitor blood pressure and blood sugar levels regularly."
            },
            Accuracy: "low",
            AccuracyLevel: 68
        },
        RecognizedMeds: [
            {
                id: 3,
                name: "Paracetamol",
                dosage: "10mg",
                price: 10,
                stock: 100,
                manufacturer: "Unilab",
                type: 0,
                prescriptionrequired: 0
            },
            {
                id: 2,
                name: "Paracetamol",
                dosage: "10mg",
                price: 10,
                stock: 100,
                manufacturer: "Biogesic",
                type: 1,
                prescriptionrequired: 0
            },
            {
                id: 7,
                name: "Bioflu",
                dosage: "500mg",
                price: 90,
                stock: 100,
                type: 0,
                prescriptionrequired: 1,
                manufacturer: "Generika"
            },
        ]
    };

    return res.status(200).json(hardcodedResponse);

    } catch (error) {
        console.error('Gemini AI error:', error);
        return res.status(500).json({ message: 'Failed to generate product details' });
    }
    
}


export async function MedinceScannerAIPowered (req, res) {
    // const filePath = req.file.path;

    // const base64ImageFile = fs.readFileSync(filePath, {
    //     encoding: "base64",
    // });
    
    // const scannedID = await saveOCRImage(filePath, 1);

    try {
        // const prompt = `You are a highly trained pharmaceutical document analyst specializing in medicine label recognition and drug information extraction.
        //     Your task has TWO phases:
        //     ---
        //     PHASE 1 — IMAGE VALIDATION
        //     Determine if the image is a legitimate medicine label or medicine packaging.
        //     A valid medicine label typically contains ONE OR MORE of:
        //     - A medicine/drug name (generic or brand)
        //     - Dosage strength (e.g., 500mg, 10mg/5ml)
        //     - Dosage form (tablet, capsule, syrup, injection, etc.)
        //     - Manufacturer or distributor name
        //     If the image does NOT appear to be a medicine label or packaging (e.g., it's a food label, ID card, prescription slip, blank page, unrelated document, random photo, screenshot, etc.), respond ONLY with this exact JSON and nothing else:
        //     {
        //     "Valid": false,
        //     "Error": "Invalid Input: No medicine label detected."
        //     }
        //     ---
        //     PHASE 2 — EXTRACTION (only if image passes Phase 1)
        //     If the image IS a medicine label or packaging, extract all readable information and respond ONLY with this exact JSON structure. No markdown, no code blocks, no extra explanation:
        //     {
        //     "Valid": true,
        //     "RecognizedMeds": [
        //         "generic or brand medicine name ONLY, no dosage (e.g., Biogesic, Amoxicillin)"
        //     ],
        //     "ExtractedText": {
        //         "BrandName": "brand name if visible, else null",
        //         "GenericName": "generic/active ingredient name if visible, else null",
        //         "DosageStrength": "strength and unit if visible (e.g., 500mg, 250mg/5ml), else null",
        //         "DosageForm": "form if visible (e.g., tablet, capsule, syrup, drops), else null",
        //         "Manufacturer": "manufacturer or distributor name if visible, else null",
        //         "ExpiryDate": "expiry date if visible (e.g., 06/2027), else null",
        //     },
        //     "Accuracy": "low if below 85%, high if above 90%, medium otherwise",
        //     "AccuracyLevel": a plain integer 0-100 representing OCR confidence, no % symbol, no quotes (e.g., 88)
        //     }`;

        //  const response = await ai.models.generateContent({
        //     model: "gemini-2.5-flash",
        //     contents: [
        //         {
        //             inlineData: {
        //                 mimeType: "image/jpeg",
        //                 data: base64ImageFile,
        //             },
        //         },
        //         { text: prompt }
        //     ],
        // });

        // const text = response.text.trim();
        // const clean = text.replace(/```json|```/g, "").trim();
        // const parsed = JSON.parse(clean);

        // const recognizedMeds = await Promise.all(parsed.RecognizedMeds.map(med => getProduct(med)));
        // const flatResults = recognizedMeds.flat();

        // if (flatResults.length === 0) {
        //     console.log("No medicines found, sending fallback response");
        //     return res.status(404).json({
        //         scanned_id: scannedID,
        //         extractedText: parsed,
        //         RecognizedMeds: [],
        //         message: "No available medicine found"
        //     });
        // }

        // return res.status(200).json({scanned_id: scannedID, extractedText: parsed, RecognizedMeds: flatResults });

      const hardcodedResponse = {
        // extractedText: {
        //     Valid: false,
        //     Error: "Invalid Input: No medicine label detected."
        // }
        extractedText: {
            Valid: true,
            RecognizedMeds: ["Biogesic"],
            ExtractedText: {
                BrandName: "Biogesic",
                GenericName: "Paracetamol",
                DosageStrength: "500mg",
                DosageForm: "Tablet",
                Manufacturer: "Unilab Inc.",
                ExpiryDate: "06/2027",
                LotNumber: "LOT-2024-0872",
                StorageInstructions: "Store below 30°C. Keep away from direct sunlight.",
                Indications: "For relief of mild to moderate pain and fever.",
                Warnings: "Do not exceed recommended dose. Keep out of reach of children.",
                Dosage: "Adults: 1-2 tablets every 4-6 hours as needed.",
                ActiveIngredients: ["Paracetamol 500mg"],
                AdditionalNotes: null,
            },
            Accuracy: "very low",
            AccuracyLevel: 70,
        },
        RecognizedMeds: [
            {
                id: 1,
                name: "Paracetamol",
                dosage: "500mg Tablet",
                price: 12.50,
                stock: 150,
                manufacturer: "Unilab Inc.",
            },
        ],
            message: undefined,
        };

        return res.status(200).json(hardcodedResponse);
            
    } catch (error) {
        console.error('Gemini AI error:', error);
        return res.status(500).json({ message: 'Failed to generate product details' });
    }
    
}