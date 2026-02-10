-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  order_id TEXT NOT NULL,
  payment_key TEXT NOT NULL,
  amount INTEGER NOT NULL,
  status TEXT NOT NULL,
  method TEXT,
  receipt_url TEXT,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('active', 'trialing', 'canceled', 'past_due', 'incomplete')),
  price_id TEXT,
  billing_key TEXT, -- 빌링키 저장 컬럼 추가
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  next_payment_date TIMESTAMPTZ, -- 다음 결제 예정일
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can view their own payments
CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT USING (auth.uid() = user_id);

-- Users can view their own subscription
CREATE POLICY "Users can view own subscription" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);
