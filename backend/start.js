#!/usr/bin/env node

// Production start script for Render
require('dotenv').config();

console.log('🔄 Production start script executing...');
console.log('📁 Working directory:', process.cwd());
console.log('📦 Node version:', process.version);
console.log('🔧 Environment variables loaded');

// Import and start the server
require('./dist/server.js');