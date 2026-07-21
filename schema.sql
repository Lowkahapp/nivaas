-- Users (landlords, admins, staff)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'landlord', -- landlord, admin, staff
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Properties (listings)
CREATE TABLE properties (
  id SERIAL PRIMARY KEY,
  landlord_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  society_name VARCHAR(255) NOT NULL,
  tower VARCHAR(100),
  address TEXT NOT NULL,
  locality VARCHAR(255) NOT NULL,
  city VARCHAR(100) DEFAULT 'Pune',
  pincode VARCHAR(10),
  bhk INTEGER NOT NULL,
  rent INTEGER NOT NULL,
  deposit INTEGER NOT NULL,
  maintenance INTEGER,
  area_sqft INTEGER,
  bathrooms INTEGER,
  balconies INTEGER,
  furnishing VARCHAR(50) NOT NULL, -- Fully Furnished, Semi Furnished, Unfurnished
  floor VARCHAR(50),
  parking BOOLEAN DEFAULT false,
  pet_friendly BOOLEAN DEFAULT false,
  available_from VARCHAR(100),
  amenities TEXT, -- JSON array
  nearby_places TEXT, -- JSON array
  description TEXT,
  images TEXT, -- JSON array of URLs
  videos TEXT, -- JSON array of URLs
  status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected, live
  rera_verified BOOLEAN DEFAULT false,
  field_verified BOOLEAN DEFAULT false,
  verified_by INTEGER REFERENCES users(id),
  verified_at TIMESTAMP,
  rating NUMERIC(2,1) DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Visit requests (leads)
CREATE TABLE visit_requests (
  id SERIAL PRIMARY KEY,
  property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
  tenant_name VARCHAR(255) NOT NULL,
  tenant_phone VARCHAR(20) NOT NULL,
  tenant_email VARCHAR(255),
  preferred_date DATE,
  status VARCHAR(50) DEFAULT 'new', -- new, contacted, visit_scheduled, lease_signed, cancelled
  assigned_to INTEGER REFERENCES users(id),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster queries
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_landlord ON properties(landlord_id);
CREATE INDEX idx_visit_requests_property ON visit_requests(property_id);
CREATE INDEX idx_visit_requests_status ON visit_requests(status);
CREATE INDEX idx_visit_requests_assigned ON visit_requests(assigned_to);
