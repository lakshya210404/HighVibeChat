🚀 HighVibeChat (HVC)

HighVibeChat is a real-time chat application designed to match users instantly and enable seamless, low-latency communication. The project focuses on scalable real-time messaging, modern frontend architecture, and production-ready deployment.

🔗 Live Demo: https://high-vibe-chat.vercel.app

✨ Features

⚡ Real-time 1-on-1 chat

🔄 Instant user matching

🔐 Secure authentication & session handling

📡 Low-latency messaging with real-time subscriptions

🎨 Clean, modern UI built with reusable components

☁️ Fully deployed and production-ready

🧠 Tech Stack
Frontend

React + TypeScript

Vite for fast builds

Tailwind CSS + shadcn/ui

Component-based architecture

Backend / Infrastructure

Supabase

Authentication

Real-time database

Row-level security

Vercel for deployment

Environment-based configuration

🏗️ System Architecture
Client (React + TS)
        |
        |  Real-time subscriptions
        v
Supabase (Auth + DB)
        |
        v
 Vercel Deployment


Frontend communicates directly with Supabase using secure keys

Real-time listeners handle message delivery instantly

Scales without managing custom servers

📂 Project Structure
HighVibeChat/
├── public/          # Static assets
├── src/             # React source code
│   ├── components/  # UI components
│   ├── pages/       # Application views
│   ├── lib/         # Utilities & helpers
│   └── styles/      # Global styles
├── supabase/        # Supabase configuration
├── .env             # Environment variables
├── README.md
└── package.json

🛠️ Setup & Installation
1️⃣ Clone the repo
git clone https://github.com/lakshya210404/HighVibeChat.git
cd HighVibeChat

2️⃣ Install dependencies
npm install
# or
bun install

3️⃣ Environment Variables

Create a .env file and add:

VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key

4️⃣ Run locally
npm run dev


App runs on http://localhost:5173

🔐 Security

Supabase Row Level Security (RLS)

Environment-based secrets

No sensitive keys exposed to the client

📈 What I Learned

Designing real-time systems with subscriptions

Debugging latency and race conditions

Structuring scalable React applications

Deploying full-stack apps to production

Making data-driven architectural decisions

🚧 Future Improvements

🔍 Typing indicators

🧑‍🤝‍🧑 Group chat support

🗂️ Chat history & persistence

🛡️ Advanced moderation & reporting

📱 Mobile responsiveness improvements

👤 Author

Lakshya Prasad
💼 Computer Science @ Western University
🔗 GitHub: https://github.com/lakshya210404

🌐 Portfolio: https://lakshya-job-portfolio.vercel.app
