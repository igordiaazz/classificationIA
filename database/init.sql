CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS prediction_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filename VARCHAR(255) NOT NULL,
    predicted_class VARCHAR(50) NOT NULL,
    confidence DECIMAL(5, 4) NOT NULL,
    image_data TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_prediction_history_created_at ON prediction_history(created_at DESC);
