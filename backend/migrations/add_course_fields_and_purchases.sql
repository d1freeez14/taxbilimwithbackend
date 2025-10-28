-- Добавление новых полей в таблицу courses
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS category_id INTEGER REFERENCES categories(id),
ADD COLUMN IF NOT EXISTS access_duration VARCHAR(20) DEFAULT 'lifetime' CHECK (access_duration IN ('lifetime', '1_year', '2_years', '6_months')),
ADD COLUMN IF NOT EXISTS video_url TEXT;

-- Создание таблицы purchases
CREATE TABLE IF NOT EXISTS purchases (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('card', 'bank_transfer', 'cash')),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
    card_number_masked VARCHAR(20),
    card_holder VARCHAR(100),
    expiry_date VARCHAR(7),
    transaction_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Создание индексов для оптимизации
CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_course_id ON purchases(course_id);
CREATE INDEX IF NOT EXISTS idx_purchases_created_at ON purchases(created_at);
CREATE INDEX IF NOT EXISTS idx_courses_category_id ON courses(category_id);
CREATE INDEX IF NOT EXISTS idx_courses_access_duration ON courses(access_duration);

-- Добавление комментариев к таблицам
COMMENT ON TABLE purchases IS 'Таблица покупок курсов';
COMMENT ON COLUMN purchases.amount IS 'Сумма покупки';
COMMENT ON COLUMN purchases.payment_method IS 'Способ оплаты';
COMMENT ON COLUMN purchases.payment_status IS 'Статус платежа';
COMMENT ON COLUMN purchases.card_number_masked IS 'Замаскированный номер карты';
COMMENT ON COLUMN purchases.transaction_id IS 'ID транзакции в платежной системе';

COMMENT ON COLUMN courses.category_id IS 'ID категории курса';
COMMENT ON COLUMN courses.access_duration IS 'Длительность доступа к курсу';
COMMENT ON COLUMN courses.video_url IS 'Ссылка на видеозапись курса';
