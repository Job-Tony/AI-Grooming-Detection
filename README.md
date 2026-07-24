# AI-Based Early Detection of Online Child Grooming Using NLP and Explainable Deep Learning

## Overview

This project is an AI-powered system for the early detection of online child grooming conversations using Natural Language Processing (NLP) and Explainable Deep Learning.

The system analyzes chat conversations, predicts the likelihood of grooming behavior, assigns a risk score, and provides explainable predictions to assist moderators and investigators. The AI is designed as a decision-support system and does not replace human judgment.

---

## Features

- User Authentication using JWT
- Chat Upload Module
- Conversation Parsing
- PAN12 Dataset Processing
- DistilBERT + BiLSTM Deep Learning Model
- Explainable AI (SHAP)
- Risk Score Prediction
- REST API using FastAPI
- PostgreSQL Database
- Swagger API Documentation

---

## Technology Stack

### Backend
- FastAPI
- Python
- SQLAlchemy
- PostgreSQL
- Alembic

### AI & Machine Learning
- PyTorch
- Hugging Face Transformers
- DistilBERT
- BiLSTM
- SHAP

### Database
- PostgreSQL

### Tools
- Git
- GitHub
- VS Code

---

## Project Structure

```
backend/
│
├── ai/
│   ├── datasets/
│   ├── explainability/
│   ├── inference/
│   ├── models/
│   ├── preprocessing/
│   ├── tokenizer/
│   └── training/
│
├── app/
│   ├── api/
│   ├── config/
│   ├── database/
│   ├── dependencies/
│   ├── models/
│   ├── repositories/
│   ├── schemas/
│   ├── services/
│   └── utils/
│
├── alembic/
├── scripts/
├── storage/
├── requirements.txt
└── Dockerfile
```

---

## Installation

Clone the repository

```bash
git clone https://github.com/Job-Tony/AI-Grooming-Detection.git
```

Move into the project

```bash
cd AI-Grooming-Detection/backend
```

Create a virtual environment

```bash
python -m venv venv
```

Activate it

Windows

```bash
venv\Scripts\activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

---

## Configure Environment

Create a `.env` file.

Example:

```env
DATABASE_URL=postgresql+psycopg://username:password@localhost:5432/grooming_db
SECRET_KEY=your_secret_key
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

---

## Database Migration

```bash
alembic upgrade head
```

---

## Run the Server

```bash
uvicorn app.main:app --reload
```

Open:

```
http://127.0.0.1:8000/docs
```

---

## AI Pipeline

1. Upload Chat
2. Parse Conversation
3. Preprocess Text
4. DistilBERT Embedding
5. BiLSTM Classification
6. Risk Score Generation
7. Explainability using SHAP
8. API Response

---

## Dataset

Current implementation uses:

- PAN12 Dataset

Future datasets:

- PANC
- Custom anonymized datasets

---

## Future Enhancements

- React Dashboard
- Browser Extension
- Discord Bot
- Real-Time Monitoring
- Federated Learning
- Differential Privacy

---

## Disclaimer

This project is developed solely for educational and research purposes as part of a B.Tech Computer Science final-year project.

The system assists human moderators by identifying potentially risky conversations and should not be used as the sole basis for decision-making.

---

## Author

**Job Tony**

B.Tech Computer Science Engineering

Final Year Project