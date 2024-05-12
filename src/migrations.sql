BEGIN; 
CREATE TABLE questions 
( 
    id SERIAL PRIMARY KEY, 
    question TEXT NOT NULL, 
    category TEXT NOT NULL, 
    selectCount INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE disease_type
( 
    id SERIAL PRIMARY KEY, 
    name TEXT NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE disease_subtype
(
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    disease_type_id INT NOT NULL REFERENCES disease_type(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE questions_by_disease
(
    id SERIAL PRIMARY KEY,
    question_id INT NOT NULL REFERENCES questions(id),
    disease_type_id INT REFERENCES disease_type(id),
    disease_subtype_id INT REFERENCES disease_subtype(id),
    metastatic BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO disease_type (name)
VALUES ('cancer'),
       ('kidney cancer');

INSERT INTO questions (question, category)
VALUES
('What type of cancer do I have?', 'general'),
('What is the stage of my cancer, and what does that mean?', 'general'),
('What are the treatment options available?', 'treatment'),
('What are the potential side effects of treatment?', 'treatment'),
('What is the prognosis with the treatment plans?', 'treatment'),
('Are there specific risk factors for kidney cancer that may affect my treatment?', 'disease specific'),
('What are the chances of recurrence?', 'general'),
('Are there any new treatments or clinical trials available?', 'general'),
('How will my kidney function be monitored during and after treatment?', 'disease specific'),
('What lifestyle changes should I consider to support my treatment and recovery?', 'lifestyle');

