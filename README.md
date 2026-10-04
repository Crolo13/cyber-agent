# Cyber Agent

Cyber Agent is an AI-assisted cybersecurity project that analyzes failed login activity and helps identify potentially suspicious behavior.

## Features

- Accepts failed login attempt data
- Uses a dedicated login-analysis tool
- Returns a risk level based on the activity
- Explains why behavior may be suspicious
- Provides recommended next steps
- Uses a Node.js and Express backend

## Technologies

- Node.js
- Express.js
- JavaScript
- Ollama
- AI Agent Tool Calling
- REST APIs

## Project Structure

- `server.js` - Backend API server
- `agent.js` - Main AI agent logic
- `tools/analyzeLogin.js` - Login analysis tool

## Example

Input:

```text
The admin account had 10 failed login attempts from IP 192.168.1.50.
