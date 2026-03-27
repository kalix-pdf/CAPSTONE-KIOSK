import express from "express";
import { getCategories, getProductsByCategory, createOrder, processOCRImage, adminLogin,
  fetchTotalDashboard, fetchAllProducts, addActivityLogs, fetchAllActivityLogs, fetchOrders, 
  fetchTotalCompletedToday, OrderUpdate, AllOrdersQeueueDisplay, getActiveCategory, getOrders } 
from "../controllers/user.controller.js";
import { ProductUpdate, AddNewProduct, ProductDeactivate } from "../controllers/product.controller.js";
import { CategoryAdd, categoryDelete } from "../controllers/category.controller.js";
import { AIPoweredProductDetails, PrescriptionAIPowered, MedinceScannerAIPowered } from "../controllers/generativeAI.controller.js";


import path from 'path';
import multer from 'multer';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/ocr-images');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'ocr-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
});

const productUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
});


router.get("/categories", getCategories);
router.get("/activeCategories", getActiveCategory);
router.get("/category/:categoryid/products", getProductsByCategory);
router.post("/order", createOrder);
router.post("/ocr/process", upload.single('prescription'), processOCRImage);

//OCR AI powered
router.post("/ocr/product/scan", upload.single('medicine'), MedinceScannerAIPowered)
router.post("/ocr/readPrescription", upload.single('prescription'), PrescriptionAIPowered);

//admin
router.post("/admin/login", adminLogin);
router.post("/admin/add/ActivityLogs", addActivityLogs);
router.get("/admin/fetchTotalDashboard", fetchTotalDashboard);
router.get("/products", fetchAllProducts);
router.get("/admin/ActivityLogs", fetchAllActivityLogs);

router.get("/admin/orders", fetchOrders)
router.get("/admin/AllOrders", AllOrdersQeueueDisplay)
router.get("/admin/fetch/orders", getOrders);

router.post("/admin/delete/category/:category_id", categoryDelete)

router.get("/admin/completedToday", fetchTotalCompletedToday)
router.post("/admin/update/product", productUpload.single('image'), ProductUpdate);

router.post("/admin/add/product", productUpload.single('image'), AddNewProduct);

router.post("/admin/add/category", CategoryAdd);
router.post("/admin/deactivate/product", ProductDeactivate)
router.post("/admin/update/order", OrderUpdate)

//Generative AI
router.post("/generate/product/details", AIPoweredProductDetails);


export default router;