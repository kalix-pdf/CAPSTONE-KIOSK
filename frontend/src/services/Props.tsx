
export interface Category {
  id: number,
  name: string,
  icon: string,
  color: string,
  medications_per_category: number
}

export interface Product {
  id: number;
  name: string;
  image: string | File;
  public_id: string;
  category: string;
  categoryid: number;
  dosage: string;
  prescriptionrequired: number;
  manufacturer: string;
  // description: string;
  barcode: string;
  price: number;
  stock: number;
  active_ingredients: string;
  // side_effects: string;
  type: number;
  category_name: string;
}

export interface TotalInventoryProps {
    total_medication: number;
    total_value_price: number;
    total_order: number;
}

export interface ActivityLogProps {
    id: string;
    date: string;
    user: number | null;
    type: number;
    action: string;
    description: string;
    metadata?: {
        productId?: number;
        categoryId?: number;
        category_name?: string;
        product_name?: string;
        changes?: Array<{ field: string; before: any; after: any }>;
        // [key: string]: any;
    };
    product_name: string;
    category_name: string;
}

export interface QueueDisplay {
  order_id: number;
  queue_number: number;
  status: number;
  created_at: string | Date;
}


export interface QueueTicket {
  order_id: number;
  phone_number?: string;
  queue_number: number;
  total_amount: number;
  status: number;
  created_at: string | Date;
  items: {
    dosage: string;
    product_id: number;
    quantity: number;
    product_name: string;
    price: number;
  }[],
  prescriptiondata: {
    image_url: string;
    extractedText: {
      Accuracy: string;
      AccuracyLevel: number;
      ExtractedText: (string | null)[];
      RecognizedMeds: string[];
    };
  } | null;
}

// AI Product Props
export interface AIOverview {
  overview: string;
  howToUse: string[];
  drugInteractions: string[];
  precautions: string[];
  storageInstructions: string[];
  whenToSeekHelp: string[];
  faqs: string[];
  dosageRecommendations: {
    adults: string;
    elderly: string;
    children: string;
    notes: string;
  },
}

export interface ExtractedPrescription {
  Valid: boolean;
  Error?: string;

  RecognizedMeds?: string[];
  ExtractedText?: {
    BrandName: string | null;
    GenericName: string | null;
    DosageStrength: string | null;
    DosageForm: string | null;
    Manufacturer: string | null;
    ExpiryDate: string | null;
    PatientInfo: string | null;
    PrescriberName: string | null;
    PrescriberAddress: string | null;
    DateIssued: string | null;
    Medications: {
      Name: string;
      Dosage: string | null;
      Instructions: string | null;
      Quantity: string | null;
      Refills: string | null;
    }[];
    DEANumber: string | null;
    LicenseNumber: string | null;
    AdditionalNotes: string | null;
  };
  Accuracy?: "low" | "medium" | "high";
  AccuracyLevel?: number;
}

//AI prescription
export interface AIResponse {
  extractedText: ExtractedPrescription;
  RecognizedMeds: Product[]; 
  message?: string;
  scanned_id: number;
}

//customer order
export interface customerOrderProps {
  order_id: number;
  image_data_id?: number | null;
  queue_number: number;
  created_at: string;
  total_amount: number;
  status: number;
  total_quantity: number;
  products: {
    quantity: number;
    product_id: number;
    product_name: string;
    type: number;
    dosage: string;
    price: number;
    prescriptionrequired: number;
    manufacturer: string;
    barcode: number
  }[]
}