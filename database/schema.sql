-- Database Schema Considerations for Nova Admin Panel
-- Targeted Database: PostgreSQL

-- 1. Merchants KYC Table
CREATE TABLE merchants_kyc (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id VARCHAR(255) NOT NULL UNIQUE, -- Link to main store/user table
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    dob DATE,
    
    -- Address & Location
    address TEXT NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    state VARCHAR(100) NOT NULL,
    lat DECIMAL(10, 8),
    lng DECIMAL(11, 8),
    
    -- Document Verification: PAN
    pan_number VARCHAR(10) UNIQUE,
    pan_verified BOOLEAN DEFAULT FALSE,
    pan_image_url TEXT,
    
    -- Document Verification: GST
    gst_number VARCHAR(15) UNIQUE,
    gst_verified BOOLEAN DEFAULT FALSE,
    gst_image_url TEXT,
    
    -- Document Verification: FSSAI
    fssai_number VARCHAR(14) UNIQUE,
    fssai_expiry DATE,
    fssai_verified BOOLEAN DEFAULT FALSE,
    fssai_image_url TEXT,
    
    -- Additional Docs
    signature_verified BOOLEAN DEFAULT FALSE,
    signature_image_url TEXT,
    contract_pdf_url TEXT,
    
    -- Authorized Person
    authorized_person_name VARCHAR(255),
    authorized_doc_type VARCHAR(50), -- e.g., 'aadhaar', 'voter_id'
    authorized_doc_url TEXT,
    authorized_verified BOOLEAN DEFAULT FALSE,
    
    -- Status Tracking
    status VARCHAR(50) DEFAULT 'under_review' CHECK (status IN ('under_review', 'approved', 'rejected')),
    rejection_reason TEXT[], -- Array of strings for multiple reasons
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster queries
CREATE INDEX idx_merchants_kyc_status ON merchants_kyc(status);
CREATE INDEX idx_merchants_kyc_phone ON merchants_kyc(phone);


-- 2. Delivery Partners (Riders) KYC Table
CREATE TABLE delivery_kyc (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    delivery_id VARCHAR(255) NOT NULL UNIQUE, -- Link to main rider/user table
    
    -- Personal Info
    name VARCHAR(255) NOT NULL,
    father_name VARCHAR(255),
    phone VARCHAR(20) NOT NULL,
    dob DATE,
    
    -- Live Location / Home Address
    address TEXT NOT NULL,
    state VARCHAR(100),
    lat DECIMAL(10, 8),
    lng DECIMAL(11, 8),
    
    -- Identity Docs
    aadhar_image_url TEXT, -- Front/Back combined or separate fields if needed
    selfie_image_url TEXT, -- For facial verification
    
    -- eKYC Response Data (for cross-verification)
    ekyc_name VARCHAR(255),
    ekyc_father_name VARCHAR(255),
    ekyc_dob DATE,
    ekyc_address TEXT,
    
    -- Onboarding & Logistics
    onboarding_fee_paid BOOLEAN DEFAULT FALSE,
    transaction_id VARCHAR(100),
    vehicle_type VARCHAR(50) CHECK (vehicle_type IN ('Bike', 'Cycle', 'EV')),
    tshirt_size VARCHAR(5) CHECK (tshirt_size IN ('M', 'L', 'XL', 'XXL')),
    
    -- Status Tracking
    status VARCHAR(50) DEFAULT 'under_review' CHECK (status IN ('under_review', 'active', 'rejected', 'banned')),
    rejection_reason TEXT[],
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster queries
CREATE INDEX idx_delivery_kyc_status ON delivery_kyc(status);
CREATE INDEX idx_delivery_kyc_phone ON delivery_kyc(phone);
