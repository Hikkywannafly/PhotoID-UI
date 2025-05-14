CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  original_url TEXT NOT NULL,
  removed_bg_url TEXT,
  id_photo_url TEXT,
  id_photo_with_border_url TEXT,
  photo_sheet_url TEXT,
  size TEXT NOT NULL,
  background_color TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  original_url TEXT NOT NULL,
  removed_bg_url TEXT,
  id_photo_url TEXT,
  id_photo_with_border_url TEXT,
  photo_sheet_url TEXT,
  size TEXT NOT NULL,
  background_color TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE photo_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  photo_id UUID REFERENCES photos(id) ON DELETE CASCADE,
  
  -- Border options
  border_enabled BOOLEAN DEFAULT FALSE,
  border_width INTEGER,
  border_color TEXT,
  
  -- Sheet options
  sheet_enabled BOOLEAN DEFAULT FALSE,
  sheet_format TEXT,
  sheet_columns INTEGER,
  sheet_rows INTEGER,
  sheet_spacing INTEGER,
  
  -- Retouch options
  retouch_enabled BOOLEAN DEFAULT FALSE,
  smoothness_level INTEGER,
  
  -- Color blend options
  color_blend_enabled BOOLEAN DEFAULT FALSE,
  color_style TEXT,
  color_intensity FLOAT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL, -- 'free', 'basic', 'premium'
  price DECIMAL(10, 2) NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  auto_renew BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE TABLE credits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  balance INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  transaction_type TEXT NOT NULL, -- 'purchase', 'refund', 'credit_usage'
  description TEXT,
  photo_id UUID REFERENCES photos(id),
  subscription_id UUID REFERENCES subscriptions(id),
  status TEXT NOT NULL, -- 'pending', 'completed', 'failed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Tạo bucket cho ảnh
INSERT INTO storage.buckets (id, name, public) VALUES ('photos', 'photos', true);

-- Thiết lập RLS (Row Level Security) cho bucket
CREATE POLICY "Users can view their own photos" 
  ON storage.objects FOR SELECT 
  USING (auth.uid() = owner);

CREATE POLICY "Users can upload their own photos" 
  ON storage.objects FOR INSERT 
  WITH CHECK (auth.uid() = owner);

CREATE POLICY "Users can update their own photos" 
  ON storage.objects FOR UPDATE 
  USING (auth.uid() = owner);

CREATE POLICY "Users can delete their own photos" 
  ON storage.objects FOR DELETE 
  USING (auth.uid() = owner);
  CREATE OR REPLACE FUNCTION decrement_user_credits(user_id UUID, amount INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
  current_balance INTEGER;
BEGIN
  -- Lấy số dư hiện tại
  SELECT balance INTO current_balance FROM credits WHERE user_id = $1;
  
  -- Kiểm tra số dư
  IF current_balance < amount THEN
    RETURN FALSE;
  END IF;
  
  -- Giảm số dư
  UPDATE credits SET balance = balance - amount, updated_at = NOW() WHERE user_id = $1;
  
  -- Ghi lại giao dịch
  INSERT INTO transactions (user_id, amount, transaction_type, description, status)
  VALUES ($1, amount, 'credit_usage', 'Photo processing', 'completed');
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;