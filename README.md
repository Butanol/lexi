# Lexi

Lexi is a web‑based compliance assistant designed for automated analysis
of internal circulars, regulatory documents, and financial reports. It
centralizes document ingestion, tracks regulatory changes, and flags
potential inconsistencies or discrepancies to reduce manual review
and accelerate compliance workflows.\
Built for **Singhacks 2025**.

![UI](screenshot.png)

---

## 🚀 Features

-   **Document Ingestion & Storage**\
    Upload and manage internal circulars, regulatory notices, SOPs, and
    financial documents.

-   **Automated Regulatory Analysis**\
    NLP pipelines extract key rules, obligations, and policy changes
    across documents.

-   **Discrepancy Detection**\
    Scans financial documents and formatting.

-   **Change Tracking**\
    Automatically updates between new and existing regulatory documents by running a scrape on \
    financial institutions.

-   **Dashboard for Compliance Teams**\
    A consolidated view of flagged risks, obligations, and upcoming
    actions.

------------------------------------------------------------------------

## ⚙️ Setting Up

### Prerequisites

-   Python 3.12+
-   Node.js 18+
-   npm (bundled with Node.js)

------------------------------------------------------------------------

## 📦 Installation

### 1. Clone the Repository

``` bash
git clone https://github.com/Butanol/lexi.git
cd lexi
```

### 2. Install Frontend Dependencies

``` bash
cd frontend
npm install
npm run dev
```

### 3. Set Up the Backend

``` bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 4. Create .env file with
```
GROQ_API_KEY=your_key
JIGSAW_API_KEY=your_key
```

------------------------------------------------------------------------

## Future Enhancements

-   RAG‑based reasoning over document collections\
-   Embedding‑based semantic search\
-   Compliance timelines & obligation reminders\
-   Multi‑company / multi‑department document spaces\
-   More advanced action recommendation system

------------------------------------------------------------------------

## Credits

Created for *Singhacks 2025*.
