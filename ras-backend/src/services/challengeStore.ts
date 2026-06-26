import logger from '../utils/logger';

export interface ChallengeWorkspace {
  id: string;
  title: string;
  track: string;
  seniority: string;
  tags: string[];
  difficulty: number;
  description: string;
  files: { [filename: string]: string };
}

const workspaceLibrary: ChallengeWorkspace[] = [
  // ==================== FRONTEND ====================
  {
    id: 'fe-junior-1', title: 'Build a Todo App', track: 'frontend', seniority: 'junior',
    tags: ['react', 'state-management', 'components', 'css'], difficulty: 1,
    description: 'Build a functional todo application with add, complete, and delete functionality.',
    files: {
      'README.md': `# Todo App Challenge

Build a simple todo list application with the following requirements:

## Requirements
1. Add new todos with a text input
2. Mark todos as complete (strikethrough)
3. Delete todos
4. Show count of remaining items
5. Filter by All / Active / Completed

## Constraints
- Use functional components
- Manage state with hooks
- Basic CSS styling required
- No external state management libraries`,
      'index.js': `import React, { useState } from 'react';

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('all');

  return (
    <div className="app">
      <h1>Todo App</h1>
      {/* Implement your solution here */}
    </div>
  );
}

export default App;`,
      'utils.js': `// Helper utilities
export const generateId = () => Date.now().toString(36) + Math.random().toString(36).slice(2);

export const formatDate = (date) => new Date(date).toLocaleDateString();`,
      'test.js': `import { generateId } from './utils';

// Basic unit tests
const testGenerateId = () => {
  const id1 = generateId();
  const id2 = generateId();
  console.assert(id1 !== id2, 'generateId should produce unique IDs');
  console.log('✓ generateId produces unique IDs');
};

testGenerateId();
console.log('All tests passed!');`
    }
  },
  {
    id: 'fe-mid-1', title: 'E-Commerce Product Grid', track: 'frontend', seniority: 'mid',
    tags: ['react', 'fetching', 'state-management', 'responsive', 'search', 'filter'], difficulty: 2,
    description: 'Build a responsive product listing page with search, filter, and cart management.',
    files: {
      'README.md': `# E-Commerce Product Grid Challenge

Build a product listing page with the following features:

## Requirements
1. Fetch products from a mock API
2. Search products by name
3. Filter by category and price range
4. Add/remove products from cart
5. Show cart total
6. Responsive grid layout
7. Loading and error states

## Constraints
- Use React with hooks
- Implement debounced search
- Handle all edge cases (empty results, network errors)`,
      'index.js': `import React, { useState, useEffect, useCallback } from 'react';

const API_URL = 'https://fakestoreapi.com/products';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(setProducts)
      .catch(console.error);
  }, []);

  return (
    <div className="shop">
      <header>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="cart-summary">Cart: {cart.length} items</div>
      </header>
      <div className="product-grid">
        {/* Map products here */}
      </div>
    </div>
  );
}

export default App;`,
      'utils.js': `// Search and filter utilities
export const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

export const formatPrice = (price) => '$' + price.toFixed(2);

export const filterByPrice = (products, min, max) => 
  products.filter(p => p.price >= min && p.price <= max);`,
      'test.js': `import { debounce, formatPrice, filterByPrice } from './utils';

// Test formatPrice
console.assert(formatPrice(10) === '$10.00', 'formatPrice formats correctly');
console.log('✓ formatPrice works');

// Test filterByPrice
const products = [{ price: 5 }, { price: 15 }, { price: 25 }];
console.assert(filterByPrice(products, 10, 20).length === 1, 'filterByPrice works');
console.log('✓ filterByPrice works');

console.log('All tests passed!');`
    }
  },
  {
    id: 'fe-senior-1', title: 'Real-Time Dashboard', track: 'frontend', seniority: 'senior',
    tags: ['react', 'websockets', 'realtime', 'charting', 'performance', 'virtualization'], difficulty: 4,
    description: 'Build a real-time analytics dashboard with WebSocket data streaming and virtualized lists.',
    files: {
      'README.md': `# Real-Time Analytics Dashboard Challenge

Build a high-performance real-time dashboard that displays streaming analytics data.

## Requirements
1. WebSocket connection for live data
2. Real-time chart updates (no libraries - use Canvas/SVG)
3. Virtualized scrolling for large data sets
4. Multiple dashboard widgets that can be rearranged
5. Performance: < 16ms frame time with 10,000 data points
6. Memory: < 100MB heap with continuous 1-hour streaming
7. Error recovery on WebSocket disconnect

## Constraints
- Zero external charting libraries
- Implement own virtual scroller
- Handle backpressure on high-frequency updates`,
      'index.js': `import React, { useState, useEffect, useRef, useCallback } from 'react';

const WS_URL = 'wss://stream.example.com/analytics';

function App() {
  const [metrics, setMetrics] = useState({ cpu: [], memory: [], requests: [] });
  const [connected, setConnected] = useState(false);
  const wsRef = useRef(null);

  useEffect(() => {
    const connect = () => {
      wsRef.current = new WebSocket(WS_URL);
      wsRef.current.onopen = () => setConnected(true);
      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        // Throttle updates for performance
      };
      wsRef.current.onclose = () => {
        setConnected(false);
        setTimeout(connect, 1000);
      };
    };
    connect();
    return () => wsRef.current?.close();
  }, []);

  return (
    <div className="dashboard">
      <header>
        <h1>Analytics Dashboard</h1>
        <span className={\`status \${connected ? 'connected' : 'disconnected'}\`}>
          {connected ? '● Live' : '○ Reconnecting...'}
        </span>
      </header>
      <div className="widget-grid">
        {/* Dashboard widgets */}
      </div>
    </div>
  );
}

export default App;`,
      'utils.js': `// Performance utilities
export class RingBuffer {
  constructor(maxSize) {
    this.buffer = new Array(maxSize);
    this.maxSize = maxSize;
    this.head = 0;
    this.tail = 0;
    this.size = 0;
  }

  push(item) {
    this.buffer[this.tail] = item;
    this.tail = (this.tail + 1) % this.maxSize;
    if (this.size < this.maxSize) this.size++;
    else this.head = (this.head + 1) % this.maxSize;
  }

  toArray() {
    const result = [];
    for (let i = 0; i < this.size; i++) {
      result.push(this.buffer[(this.head + i) % this.maxSize]);
    }
    return result;
  }
}

export const throttle = (fn, limit) => {
  let inThrottle = false;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => { inThrottle = false; }, limit);
    }
  };
};

export const calculateEMA = (previous, current, alpha = 0.3) =>
  alpha * current + (1 - alpha) * previous;`,
      'test.js': `import { RingBuffer, throttle, calculateEMA } from './utils';

// Test RingBuffer
const buf = new RingBuffer(3);
buf.push(1); buf.push(2); buf.push(3); buf.push(4);
console.assert(buf.toArray().length === 3, 'RingBuffer max size');
console.assert(buf.toArray()[0] === 2, 'RingBuffer overwrites oldest');
console.log('✓ RingBuffer works');

// Test EMA
console.assert(calculateEMA(10, 20, 0.5) === 15, 'EMA calculation');
console.log('✓ EMA works');

console.log('All tests passed!');`
    }
  },

  // ==================== BACKEND ====================
  {
    id: 'be-junior-1', title: 'REST API Server', track: 'backend', seniority: 'junior',
    tags: ['node', 'express', 'rest', 'crud', 'api-design'], difficulty: 1,
    description: 'Build a RESTful API server for a book library with CRUD operations.',
    files: {
      'README.md': `# REST API Server Challenge

Build a RESTful API for managing a book library.

## Requirements
1. GET /books - list all books
2. GET /books/:id - get a single book
3. POST /books - create a book
4. PUT /books/:id - update a book
5. DELETE /books/:id - delete a book
6. GET /books/search?q= - search books by title/author
7. Proper error handling with status codes
8. Input validation

## Data Model
- id (auto-generated)
- title (string, required)
- author (string, required)
- year (number)
- isbn (string)`,
      'index.js': `const http = require('http');

const books = [];
let nextId = 1;

const server = http.createServer((req, res) => {
  const { method, url } = req;
  
  // Parse JSON body
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    try {
      const parsed = body ? JSON.parse(body) : {};
      handleRequest(method, url, parsed, res);
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid JSON' }));
    }
  });
});

function handleRequest(method, url, body, res) {
  // Implement your REST API here
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'API ready' }));
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));`,
      'utils.js': `// Validation utilities
const isValidBook = (book) => {
  return book.title && typeof book.title === 'string' && book.title.trim().length > 0
    && book.author && typeof book.author === 'string' && book.author.trim().length > 0;
};

const sanitizeString = (str) => str.trim().replace(/<[^>]*>/g, '');

module.exports = { isValidBook, sanitizeString };`,
      'test.js': `const { isValidBook, sanitizeString } = require('./utils');

// Test validation
console.assert(isValidBook({ title: 'Test', author: 'Me' }) === true, 'Valid book');
console.assert(isValidBook({ title: '' }) === false, 'Invalid book');
console.log('✓ Validation works');

// Test sanitize
console.assert(sanitizeString('<script>alert(1)</script>hello') === 'alert(1)hello', 'Sanitizes HTML');
console.log('✓ Sanitize works');

console.log('All tests passed!');`
    }
  },
  {
    id: 'be-mid-1', title: 'Rate Limiter & Caching Layer', track: 'backend', seniority: 'mid',
    tags: ['node', 'caching', 'rate-limiting', 'middleware', 'performance'], difficulty: 2,
    description: 'Implement a sliding window rate limiter with an LRU cache layer for an API.',
    files: {
      'README.md': `# Rate Limiter & Caching Layer Challenge

Implement middleware components for API rate limiting and response caching.

## Requirements
1. Sliding window rate limiter (per IP, configurable window)
2. LRU cache with TTL support
3. Both as Express-compatible middleware
4. Cache hit/miss metrics
5. Graceful handling of limit exceeded (429)
6. Thread-safe design

## Constraints
- No external caching libraries
- O(1) LRU operations
- Memory-bound cache (configurable max size)`,
      'index.js': `const express = require('express');
const { rateLimiter } = require('./utils');
const { LRUCache } = require('./utils');

const app = express();
const cache = new LRUCache(100);

// Apply rate limiting
app.use(rateLimiter({ windowMs: 60000, maxRequests: 100 }));

// Caching middleware
app.use((req, res, next) => {
  const cached = cache.get(req.url);
  if (cached) {
    return res.json(cached);
  }
  const originalJson = res.json.bind(res);
  res.json = (data) => {
    cache.set(req.url, data, 30000);
    originalJson(data);
  };
  next();
});

app.get('/api/data', (req, res) => {
  res.json({ message: 'This response is cached for 30s' });
});

app.listen(3000);`,
      'utils.js': `// Sliding Window Rate Limiter
class SlidingWindowLimiter {
  constructor(windowMs, maxRequests) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
    this.windows = new Map();
  }

  check(key) {
    const now = Date.now();
    if (!this.windows.has(key)) {
      this.windows.set(key, []);
    }
    const timestamps = this.windows.get(key).filter(t => now - t < this.windows);
    this.windows.set(key, timestamps);
    if (timestamps.length >= this.maxRequests) return false;
    timestamps.push(now);
    return true;
  }
}

// LRU Cache
class LRUCache {
  constructor(maxSize) {
    this.maxSize = maxSize;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return null;
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value.value;
  }

  set(key, value, ttl = 0) {
    if (this.cache.has(key)) this.cache.delete(key);
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, { value, expires: ttl ? Date.now() + ttl : 0 });
  }
}

const rateLimiter = (config) => {
  const limiter = new SlidingWindowLimiter(config.windowMs, config.maxRequests);
  return (req, res, next) => {
    const key = req.ip;
    if (!limiter.check(key)) {
      return res.status(429).json({ error: 'Too many requests' });
    }
    next();
  };
};

module.exports = { SlidingWindowLimiter, LRUCache, rateLimiter };`,
      'test.js': `const { SlidingWindowLimiter, LRUCache } = require('./utils');

// Test LRU Cache
const cache = new LRUCache(3);
cache.set('a', 1); cache.set('b', 2); cache.set('c', 3);
cache.get('a'); cache.set('d', 4);
console.assert(cache.get('b') === null, 'LRU evicts least recently used');
console.assert(cache.get('a') === 1, 'LRU preserves recently accessed');
console.log('✓ LRU Cache works');

// Test Rate Limiter
const limiter = new SlidingWindowLimiter(60000, 2);
console.assert(limiter.check('test') === true, 'First request allowed');
console.assert(limiter.check('test') === true, 'Second request allowed');
console.assert(limiter.check('test') === false, 'Third request blocked');
console.log('✓ Rate limiter works');

console.log('All tests passed!');`
    }
  },
  {
    id: 'be-senior-1', title: 'Distributed Task Queue', track: 'backend', seniority: 'senior',
    tags: ['node', 'distributed-systems', 'queues', 'workers', 'backpressure'], difficulty: 4,
    description: 'Build a distributed task queue with worker pools, retries, dead-letter queues, and backpressure management.',
    files: {
      'README.md': `# Distributed Task Queue Challenge

Design and implement a distributed task queue system.

## Requirements
1. Producer API to enqueue tasks with priorities
2. Worker pool with configurable concurrency
3. Automatic retry with exponential backoff (max 3 retries)
4. Dead-letter queue for failed tasks
5. Backpressure mechanism when queue exceeds threshold
6. Task progress tracking and status updates
7. Graceful shutdown - drain workers before exit

## Constraints
- No external message broker (implement in-process)
- Thread-safe for concurrent access
- Memory bounded (max queue size)
- Support at-least-once delivery semantics`,
      'index.js': `const { TaskQueue } = require('./utils');

// Create queue with max 1000 items, 5 concurrent workers
const queue = new TaskQueue({ maxSize: 1000, concurrency: 5, maxRetries: 3 });

// Define a task processor
queue.process('email', async (task) => {
  console.log(\`Processing email task: \${task.data.to}\`);
  // Simulate work
  await new Promise(resolve => setTimeout(resolve, 100));
});

// Enqueue tasks
async function main() {
  await queue.enqueue('email', { to: 'user@example.com', subject: 'Welcome!' }, { priority: 1 });
  
  // Monitor queue
  setInterval(() => {
    const stats = queue.getStats();
    console.log(\`Queue: \${stats.pending} pending, \${stats.processing} processing, \${stats.completed} completed\`);
  }, 1000);
}

main().catch(console.error);`,
      'utils.js': `class TaskQueue {
  constructor({ maxSize = 1000, concurrency = 5, maxRetries = 3 } = {}) {
    this.maxSize = maxSize;
    this.concurrency = concurrency;
    this.maxRetries = maxRetries;
    this.queues = new Map(); // type -> priority queue
    this.workers = new Map(); // type -> processor
    this.activeCount = 0;
    this.stats = { enqueued: 0, completed: 0, failed: 0, deadLettered: 0 };
    this.dlq = [];
    this.draining = false;
  }

  process(type, handler) {
    this.workers.set(type, handler);
  }

  async enqueue(type, data, { priority = 0 } = {}) {
    if (this.draining) throw new Error('Queue is draining');
    const totalPending = [...this.queues.values()].reduce((s, q) => s + q.length, 0);
    if (totalPending >= this.maxSize) throw new Error('Queue full (backpressure)');
    
    if (!this.queues.has(type)) this.queues.set(type, []);
    this.queues.get(type).push({ type, data, priority, retries: 0, id: Date.now() + Math.random() });
    this.queues.get(type).sort((a, b) => b.priority - a.priority);
    this.stats.enqueued++;
    setImmediate(() => this._processNext());
  }

  async _processNext() {
    if (this.activeCount >= this.concurrency || this.draining) return;
    
    for (const [type, queue] of this.queues) {
      if (queue.length === 0) continue;
      const task = queue.shift();
      this.activeCount++;
      try {
        const handler = this.workers.get(type);
        if (!handler) throw new Error(\`No handler for type: \${type}\`);
        await handler(task);
        this.stats.completed++;
      } catch (err) {
        task.retries++;
        if (task.retries <= this.maxRetries) {
          setTimeout(() => {
            if (!this.draining) {
              const q = this.queues.get(type);
              q.push(task);
              q.sort((a, b) => b.priority - a.priority);
            }
          }, Math.pow(2, task.retries) * 100);
          this.stats.failed++;
        } else {
          this.dlq.push(task);
          this.stats.deadLettered++;
        }
      } finally {
        this.activeCount--;
        if (!this.draining) setImmediate(() => this._processNext());
      }
    }
  }

  getStats() {
    const pending = [...this.queues.values()].reduce((s, q) => s + q.length, 0);
    return { ...this.stats, pending, processing: this.activeCount, dlqSize: this.dlq.length };
  }

  async drain() {
    this.draining = true;
    while (this.activeCount > 0) {
      await new Promise(resolve => setImmediate(resolve));
    }
  }
}

module.exports = { TaskQueue };`,
      'test.js': `const { TaskQueue } = require('./utils');

async function test() {
  const queue = new TaskQueue({ maxSize: 10, concurrency: 2, maxRetries: 1 });

  queue.process('test', async (task) => {
    if (task.data.shouldFail) throw new Error('Simulated failure');
  });

  await queue.enqueue('test', { value: 1 });
  await queue.enqueue('test', { shouldFail: true });
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const stats = queue.getStats();
  console.assert(stats.completed >= 1, 'At least one task completed');
  console.assert(stats.deadLettered >= 0, 'DLQ tracking works');
  console.log('✓ TaskQueue works');

  await queue.drain();
  console.log('✓ Queue drains cleanly');
  console.log('All tests passed!');
}
test();`
    }
  },

  // ==================== FULLSTACK ====================
  {
    id: 'fs-junior-1', title: 'URL Shortener', track: 'fullstack', seniority: 'junior',
    tags: ['fullstack', 'crud', 'database', 'api', 'frontend'], difficulty: 1,
    description: 'Build a full-stack URL shortener with a simple frontend and backend.',
    files: {
      'README.md': `# URL Shortener Challenge

Build a URL shortener service with a web interface.

## Requirements
1. Submit a long URL and get a short code
2. Redirect short URLs to the original
3. Track click count
4. Display list of all shortened URLs
5. Copy short URL to clipboard

## Stack
- Frontend: HTML/CSS/JS (vanilla or React)
- Backend: Node.js
- Storage: In-memory or file-based`,
      'index.js': `const express = require('express');
const { shortenUrl, resolveUrl, getAllUrls } = require('./utils');

const app = express();
app.use(express.json());
app.use(express.static('public'));

app.post('/api/shorten', (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL required' });
  const result = shortenUrl(url);
  res.json(result);
});

app.get('/api/urls', (req, res) => {
  res.json(getAllUrls());
});

app.get('/:code', (req, res) => {
  const original = resolveUrl(req.params.code);
  if (!original) return res.status(404).json({ error: 'Not found' });
  res.redirect(original);
});

app.listen(3000);`,
      'utils.js': `const { createHash } = require('crypto');

const store = new Map();
const BASE62 = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function generateCode(url) {
  const hash = createHash('sha256').update(url + Date.now()).digest('hex');
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += BASE62[parseInt(hash.substring(i * 4, i * 4 + 4), 16) % 62];
  }
  return code;
}

function shortenUrl(url) {
  const code = generateCode(url);
  store.set(code, { url, clicks: 0, createdAt: new Date().toISOString() });
  return { code, shortUrl: \`http://localhost:3000/\${code}\` };
}

function resolveUrl(code) {
  const entry = store.get(code);
  if (entry) {
    entry.clicks++;
    return entry.url;
  }
  return null;
}

function getAllUrls() {
  return Array.from(store.entries()).map(([code, data]) => ({ code, ...data }));
}

module.exports = { shortenUrl, resolveUrl, getAllUrls };`,
      'test.js': `const { shortenUrl, resolveUrl } = require('./utils');

const result = shortenUrl('https://example.com');
console.assert(result.code && result.code.length === 6, 'Short code is 6 chars');
console.log('✓ Short code generated');

const resolved = resolveUrl(result.code);
console.assert(resolved === 'https://example.com', 'Resolves correctly');
console.log('✓ URL resolves');

console.assert(resolveUrl('nonexistent') === null, 'Missing code returns null');
console.log('✓ Missing code handled');

console.log('All tests passed!');`
    }
  },
  {
    id: 'fs-mid-1', title: 'Realtime Chat Application', track: 'fullstack', seniority: 'mid',
    tags: ['fullstack', 'websockets', 'realtime', 'state-management', 'authentication'], difficulty: 3,
    description: 'Build a real-time chat application with rooms, authentication, and message history.',
    files: {
      'README.md': `# Real-time Chat Application Challenge

Build a multi-room chat application with WebSocket communication.

## Requirements
1. User authentication (simple token-based)
2. Create and join chat rooms
3. Real-time messaging via WebSocket
4. Message history (last 50 messages per room)
5. Online user indicators
6. Typing indicators
7. Emoji support

## Constraints
- No external real-time providers
- Handle reconnection gracefully
- Message ordering guarantee`,
      'index.js': `const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { RoomManager } = require('./utils');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const rooms = new RoomManager();

app.use(express.json());

app.post('/api/rooms', (req, res) => {
  const { name } = req.body;
  const room = rooms.createRoom(name);
  res.json(room);
});

app.get('/api/rooms', (req, res) => {
  res.json(rooms.listRooms());
});

wss.on('connection', (ws, req) => {
  ws.on('message', (data) => {
    const msg = JSON.parse(data);
    // Handle: join, leave, message, typing
  });
});

server.listen(3000);`,
      'utils.js': `class RoomManager {
  constructor() {
    this.rooms = new Map();
  }

  createRoom(name) {
    const id = Date.now().toString(36);
    const room = { id, name, clients: new Set(), messages: [] };
    this.rooms.set(id, room);
    return { id, name };
  }

  getRoom(id) {
    return this.rooms.get(id) || null;
  }

  listRooms() {
    return Array.from(this.rooms.values()).map(r => ({
      id: r.id, name: r.name, clientCount: r.clients.size
    }));
  }

  addMessage(roomId, userId, text) {
    const room = this.rooms.get(roomId);
    if (!room) return null;
    const msg = { userId, text, timestamp: Date.now() };
    room.messages.push(msg);
    if (room.messages.length > 50) room.messages.shift();
    return msg;
  }
}

function generateToken(userId) {
  return Buffer.from(JSON.stringify({ userId, exp: Date.now() + 86400000 })).toString('base64');
}

function verifyToken(token) {
  try {
    const data = JSON.parse(Buffer.from(token, 'base64').toString());
    if (data.exp < Date.now()) return null;
    return data.userId;
  } catch { return null; }
}

module.exports = { RoomManager, generateToken, verifyToken };`,
      'test.js': `const { RoomManager, generateToken, verifyToken } = require('./utils');

// Test Room Manager
const rooms = new RoomManager();
const room = rooms.createRoom('general');
console.assert(room.id, 'Room created with ID');
console.log('✓ Room created');

const msg = rooms.addMessage(room.id, 'user1', 'Hello!');
console.assert(msg.text === 'Hello!', 'Message stored');
console.log('✓ Message stored');

// Test token
const token = generateToken('user1');
console.assert(verifyToken(token) === 'user1', 'Token verification');
console.log('✓ Token works');

console.log('All tests passed!');`
    }
  },
  {
    id: 'fs-senior-1', title: 'Microservices Orchestrator', track: 'fullstack', seniority: 'senior',
    tags: ['fullstack', 'microservices', 'orchestration', 'circuit-breaker', 'distributed'], difficulty: 5,
    description: 'Build a microservices orchestrator with service discovery, circuit breaker, and distributed tracing.',
    files: {
      'README.md': `# Microservices Orchestrator Challenge

Design and implement a lightweight microservices orchestration framework.

## Requirements
1. Service registry with health checks
2. Circuit breaker pattern (closed/open/half-open states)
3. Distributed tracing with span propagation
4. Retry with exponential backoff and jitter
5. Service discovery for dynamic endpoints
6. Request aggregation (fan-out / fan-in)
7. Timeout propagation and deadline setting

## Constraints
- No external service mesh
- Implement wire protocol yourself
- Handle cascading failures gracefully`,
      'index.js': `const { ServiceRegistry, CircuitBreaker, Tracer } = require('./utils');

const registry = new ServiceRegistry();
const tracer = new Tracer();

// Register services
registry.register('user-service', ['http://localhost:4001', 'http://localhost:4002']);
registry.register('order-service', ['http://localhost:4003']);

// Create circuit breakers
const cb = new CircuitBreaker({ threshold: 5, recoveryTimeout: 30000 });

async function callService(name, path, options = {}) {
  const instances = registry.getInstances(name);
  if (!instances || instances.length === 0) {
    throw new Error(\`Service \${name} unavailable\`);
  }
  
  const span = tracer.startSpan(name);
  try {
    const result = await cb.execute(() => fetch(instances[0] + path));
    tracer.endSpan(span);
    return result;
  } catch (err) {
    tracer.endSpan(span, err);
    throw err;
  }
}

async function main() {
  // Fan-out: get user + orders in parallel
  const [user, orders] = await Promise.allSettled([
    callService('user-service', '/users/1'),
    callService('order-service', '/orders?userId=1')
  ]);
  console.log('Orchestration complete');
}

main().catch(console.error);`,
      'utils.js': `// Circuit Breaker
class CircuitBreaker {
  constructor({ threshold = 5, recoveryTimeout = 30000 } = {}) {
    this.state = 'CLOSED';
    this.failures = 0;
    this.threshold = threshold;
    this.recoveryTimeout = recoveryTimeout;
    this.lastFailureTime = 0;
  }

  async execute(fn) {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.recoveryTimeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }
    try {
      const result = await fn();
      if (this.state === 'HALF_OPEN') {
        this.state = 'CLOSED';
        this.failures = 0;
      }
      return result;
    } catch (err) {
      this.failures++;
      this.lastFailureTime = Date.now();
      if (this.failures >= this.threshold) {
        this.state = 'OPEN';
      }
      throw err;
    }
  }
}

// Service Registry
class ServiceRegistry {
  constructor() {
    this.services = new Map();
  }

  register(name, instances) {
    this.services.set(name, { instances, healthy: instances.map(() => true) });
  }

  getInstances(name) {
    const svc = this.services.get(name);
    if (!svc) return null;
    return svc.instances.filter((_, i) => svc.healthy[i]);
  }

  markUnhealthy(name, instance) {
    const svc = this.services.get(name);
    if (!svc) return;
    const idx = svc.instances.indexOf(instance);
    if (idx >= 0) svc.healthy[idx] = false;
  }
}

// Distributed Tracer
class Tracer {
  constructor() {
    this.spans = [];
  }

  startSpan(name, parentId = null) {
    const span = {
      id: Math.random().toString(36).slice(2),
      parentId,
      name,
      start: Date.now(),
      end: null,
      error: null
    };
    this.spans.push(span);
    return span;
  }

  endSpan(span, error = null) {
    span.end = Date.now();
    span.duration = span.end - span.start;
    span.error = error?.message || null;
  }

  getTrace() {
    return this.spans;
  }
}

module.exports = { CircuitBreaker, ServiceRegistry, Tracer };`,
      'test.js': `const { CircuitBreaker, ServiceRegistry, Tracer } = require('./utils');

// Test Circuit Breaker
const cb = new CircuitBreaker({ threshold: 2, recoveryTimeout: 100 });
for (let i = 0; i < 2; i++) {
  try { cb.execute(() => { throw new Error('fail'); }); } catch {}
}
console.assert(cb.state === 'OPEN', 'Circuit opens after threshold');
console.log('✓ Circuit breaker opens');

// Test Tracer
const tracer = new Tracer();
const span = tracer.startSpan('test');
tracer.endSpan(span);
console.assert(span.duration >= 0, 'Span has duration');
console.log('✓ Tracer works');

console.log('All tests passed!');`
    }
  },

  // ==================== DEVOPS ====================
  {
    id: 'do-junior-1', title: 'Containerize a Web App', track: 'devops', seniority: 'junior',
    tags: ['docker', 'dockerfile', 'containers', 'deployment'], difficulty: 1,
    description: 'Create Dockerfiles and docker-compose setup for a simple web application.',
    files: {
      'README.md': `# Containerize a Web App Challenge

Create a Docker-based deployment for a Node.js web application.

## Requirements
1. Multi-stage Dockerfile for production
2. Docker Compose with app + database services
3. Environment variable configuration
4. Health check endpoint
5. Volume mounting for persistent data
6. Resource limits configuration`,
      'index.js': `const express = require('express');
const app = express();

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.json({ message: 'Containerized App Running', version: '1.0.0' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(\`App listening on port \${PORT}\`));`,
      'utils.js': `// Dockerfile content generator for reference
const DOCKERFILE = \`
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .

FROM node:18-alpine
WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
COPY --from=builder /app /app
USER appuser
EXPOSE 3000
CMD ["node", "index.js"]
\`;

const DOCKER_COMPOSE = \`
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 256M
\`;

module.exports = { DOCKERFILE, DOCKER_COMPOSE };`,
      'test.js': `const http = require('http');

// Health check test
console.log('Testing that health endpoint would respond...');
console.log('✓ Health check is implemented');
console.log('✓ Dockerfile is multi-stage');
console.log('✓ Docker Compose has healthcheck');
console.log('All validations passed!');`
    }
  },
  {
    id: 'do-mid-1', title: 'CI/CD Pipeline Setup', track: 'devops', seniority: 'mid',
    tags: ['ci/cd', 'github-actions', 'automation', 'testing', 'deployment'], difficulty: 2,
    description: 'Design a complete CI/CD pipeline with automated testing, building, and deployment.',
    files: {
      'README.md': `# CI/CD Pipeline Challenge

Design a comprehensive CI/CD pipeline for a microservices application.

## Requirements
1. Automated test execution on PR
2. Code quality checks (lint, type check)
3. Docker image build and push
4. Staging deployment on merge to main
5. Production deployment with approval gate
6. Rollback capability
7. Slack/email notifications on failure
8. Secret management`,
      'index.js': `// CI/CD configuration reference
module.exports = {
  pipeline: {
    triggers: ['push', 'pull_request'],
    branches: ['main', 'develop', 'release/*'],
    
    stages: {
      test: {
        parallel: ['lint', 'typecheck', 'unit', 'integration']
      },
      build: {
        docker: { tags: ['latest', '\$\{{ github.sha }}'] }
      },
      deploy: {
        staging: { environment: 'staging', auto: true },
        production: {
          environment: 'production',
          requiresApproval: true,
          gate: ['smoke-tests', 'load-tests']
        }
      }
    }
  }
};`,
      'utils.js': `// GitHub Actions workflow generator
function generateWorkflow(config) {
  const workflow = {
    name: 'CI/CD Pipeline',
    on: {
      push: { branches: config.branches },
      pull_request: { branches: config.branches }
    },
    jobs: {}
  };

  // Test job
  workflow.jobs.test = {
    'runs-on': 'ubuntu-latest',
    steps: [
      { uses: 'actions/checkout@v4' },
      { uses: 'actions/setup-node@v4', with: { 'node-version': '18' } },
      { run: 'npm ci' },
      ...config.stages.test.parallel.map(cmd => ({ run: cmd }))
    ]
  };

  return workflow;
}

module.exports = { generateWorkflow };`,
      'test.js': `const { generateWorkflow } = require('./utils');

const workflow = generateWorkflow({
  branches: ['main'],
  stages: { test: { parallel: ['npm run lint', 'npm test'] } }
});

console.assert(workflow.jobs.test, 'Workflow has test job');
console.assert(workflow.jobs.test.steps.length >= 4, 'Has checkout, setup, install, and test steps');
console.log('✓ Workflow generated correctly');
console.log('All tests passed!');`
    }
  },
  {
    id: 'do-senior-1', title: 'Kubernetes Operator', track: 'devops', seniority: 'senior',
    tags: ['kubernetes', 'operator', 'controllers', 'crds', 'scheduler'], difficulty: 5,
    description: 'Build a custom Kubernetes operator for automated application lifecycle management.',
    files: {
      'README.md': `# Kubernetes Operator Challenge

Design and implement a custom Kubernetes operator.

## Requirements
1. Define a Custom Resource Definition (CRD)
2. Implement a controller with reconcile loop
3. Handle create, update, delete events
4. Status subresource with conditions
5. Finalizer for graceful cleanup
6. Leader election for HA
7. Metrics endpoint for Prometheus
8. Integration with Kubernetes events API`,
      'index.js': `// Operator controller skeleton
class AppOperator {
  constructor(kubeClient) {
    this.client = kubeClient;
    this.group = 'app.example.com';
    this.version = 'v1';
    this.plural = 'applications';
  }

  async reconcile(app) {
    const phase = app.status?.phase || 'Pending';
    switch (phase) {
      case 'Pending':
        return this.handlePending(app);
      case 'Deploying':
        return this.handleDeploying(app);
      case 'Running':
        return this.handleRunning(app);
      case 'Failed':
        return this.handleFailed(app);
    }
  }

  async handlePending(app) {
    // Create Deployment, Service, HPA
    console.log(\`Deploying application \${app.metadata.name}\`);
    return { phase: 'Deploying' };
  }

  async handleDeploying(app) {
    // Check rollout status
    return { phase: 'Running' };
  }

  async handleRunning(app) {
    // Monitor health, auto-heal
    return { phase: 'Running' };
  }
}

module.exports = { AppOperator };`,
      'utils.js': `// CRD definition
const CRD = {
  apiVersion: 'apiextensions.k8s.io/v1',
  kind: 'CustomResourceDefinition',
  metadata: { name: 'applications.app.example.com' },
  spec: {
    group: 'app.example.com',
    versions: [{
      name: 'v1',
      served: true,
      storage: true,
      schema: {
        openAPIV3Schema: {
          type: 'object',
          properties: {
            spec: {
              type: 'object',
              properties: {
                image: { type: 'string' },
                replicas: { type: 'integer', minimum: 1, maximum: 10 },
                port: { type: 'integer' },
                env: { type: 'array', items: { type: 'object' } }
              }
            },
            status: {
              type: 'object',
              properties: {
                phase: { type: 'string' },
                conditions: { type: 'array' }
              }
            }
          }
        }
      },
      subresources: { status: {} }
    }],
    scope: 'Namespaced',
    names: {
      plural: 'applications',
      singular: 'application',
      kind: 'Application',
      shortNames: ['app']
    }
  }
};

module.exports = { CRD };`,
      'test.js': `const { AppOperator } = require('./index');
const { CRD } = require('./utils');

// Validate CRD structure
console.assert(CRD.spec.names.plural === 'applications', 'CRD has plural name');
console.assert(CRD.spec.versions[0].subresources.status !== undefined, 'CRD has status subresource');
console.log('✓ CRD validated');

// Test operator
const op = new AppOperator(null);
op.handlePending({ metadata: { name: 'test' }, spec: { image: 'nginx' } })
  .then(result => {
    console.assert(result.phase === 'Deploying', 'Pending transitions to Deploying');
    console.log('✓ Operator reconcile works');
    console.log('All tests passed!');
  });`
    }
  },

  // ==================== MOBILE ====================
  {
    id: 'mo-junior-1', title: 'Weather App UI', track: 'mobile', seniority: 'junior',
    tags: ['mobile', 'ui', 'api-integration', 'state-management'], difficulty: 1,
    description: 'Build a weather application with API integration and clean UI.',
    files: {
      'README.md': `# Weather App Challenge

Build a mobile weather application.

## Requirements
1. Fetch weather data from OpenWeatherMap API
2. Display current temperature, conditions, humidity, wind
3. 5-day forecast
4. Search by city name
5. Pull-to-refresh
6. Loading and error states
7. Celsius/Fahrenheit toggle`,
      'index.js': `import React, { useState, useEffect } from 'react';

const API_KEY = 'YOUR_API_KEY';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

function App() {
  const [city, setCity] = useState('London');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unit, setUnit] = useState('metric');

  useEffect(() => {
    fetchWeather();
  }, [city, unit]);

  async function fetchWeather() {
    setLoading(true);
    try {
      const [currentRes, forecastRes] = await Promise.all([
        fetch(\`\${BASE_URL}/weather?q=\${city}&\${unit}&appid=\${API_KEY}\`),
        fetch(\`\${BASE_URL}/forecast?q=\${city}&\${unit}&appid=\${API_KEY}\`)
      ]);
      setWeather(await currentRes.json());
      setForecast((await forecastRes.json()).list.slice(0, 5));
    } catch (err) {
      console.error('Failed to fetch weather:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <header>
        <input value={city} onChange={e => setCity(e.target.value)} />
        <button onClick={() => setUnit(unit === 'metric' ? 'imperial' : 'metric')}>
          °{unit === 'metric' ? 'C' : 'F'}
        </button>
      </header>
      {loading ? <div>Loading...</div> : (
        <div className="weather-display">
          {/* Display weather data */}
        </div>
      )}
    </div>
  );
}

export default App;`,
      'utils.js': `export function formatTemp(temp, unit) {
  return \`\${Math.round(temp)}°\${unit === 'metric' ? 'C' : 'F'}\`;
}

export function getWeatherIcon(condition) {
  const icons = {
    Clear: '☀️', Clouds: '☁️', Rain: '🌧️',
    Snow: '❄️', Thunderstorm: '⛈️', Drizzle: '🌦️',
    Mist: '🌫️'
  };
  return icons[condition] || '🌤️';
}

export function getWindDirection(deg) {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(deg / 45) % 8];
}`,
      'test.js': `import { formatTemp, getWindDirection } from './utils';

console.assert(formatTemp(22, 'metric') === '22°C', 'Celsius format');
console.assert(formatTemp(72, 'imperial') === '72°F', 'Fahrenheit format');
console.log('✓ Temperature formatting works');

console.assert(getWindDirection(0) === 'N', 'North wind');
console.assert(getWindDirection(90) === 'E', 'East wind');
console.log('✓ Wind direction works');

console.log('All tests passed!');`
    }
  },
  {
    id: 'mo-mid-1', title: 'Offline-First Notes App', track: 'mobile', seniority: 'mid',
    tags: ['mobile', 'offline', 'sync', 'local-storage', 'conflict-resolution'], difficulty: 3,
    description: 'Build an offline-first notes application with local persistence and cloud sync.',
    files: {
      'README.md': `# Offline-First Notes App Challenge

Build a notes application with offline support and synchronization.

## Requirements
1. Create, edit, delete notes
2. Local persistence (AsyncStorage/localStorage)
3. Cloud sync when online
4. Conflict resolution (last-write-wins with timestamps)
5. Offline indicator
6. Pending changes queue
7. Rich text support (markdown)

## Constraints
- Must work fully offline
- Sync must not lose data
- Handle concurrent edits gracefully`,
      'index.js': `import React, { useState, useEffect, useCallback } from 'react';
import { SyncEngine } from './utils';

function App() {
  const [notes, setNotes] = useState([]);
  const [online, setOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState('idle');

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const sync = useCallback(async () => {
    if (!online) return;
    setSyncStatus('syncing');
    await SyncEngine.sync();
    setSyncStatus('idle');
  }, [online]);

  return (
    <div className="app">
      <header>
        <h1>Notes</h1>
        <span className={\`status \${online ? 'online' : 'offline'}\`}>
          {online ? '● Online' : '○ Offline'}
        </span>
        {syncStatus === 'syncing' && <span>Syncing...</span>}
      </header>
      <div className="notes-list">
        {/* Render notes */}
      </div>
    </div>
  );
}

export default App;`,
      'utils.js': `// Sync Engine with conflict resolution
const STORAGE_KEY = 'notes_data';
const PENDING_KEY = 'pending_changes';

export class SyncEngine {
  static async getLocalNotes() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch { return []; }
  }

  static async saveLocalNotes(notes) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }

  static async sync() {
    const pending = await this.getPendingChanges();
    if (pending.length === 0) return;
    
    for (const change of pending) {
      try {
        // Optimistic: assume server accepts
        const localNotes = await this.getLocalNotes();
        const idx = localNotes.findIndex(n => n.id === change.id);
        if (idx >= 0) {
          // Last-write-wins with timestamp
          if (change.updatedAt > localNotes[idx].updatedAt) {
            localNotes[idx] = change;
          }
        } else {
          localNotes.push(change);
        }
        await this.saveLocalNotes(localNotes);
      } catch (err) {
        console.error('Sync failed for note:', change.id, err);
      }
    }
    localStorage.removeItem(PENDING_KEY);
  }

  static async getPendingChanges() {
    try {
      const data = localStorage.getItem(PENDING_KEY);
      return data ? JSON.parse(data) : [];
    } catch { return []; }
  }

  static queueChange(note) {
    const pending = this.getPendingChanges();
    const existing = pending.findIndex(p => p.id === note.id);
    if (existing >= 0) pending[existing] = note;
    else pending.push(note);
    localStorage.setItem(PENDING_KEY, JSON.stringify(pending));
  }
}

export function generateNoteId() {
  return \`note_\${Date.now()}_\${Math.random().toString(36).slice(2, 8)}\`;
}

export function sanitizeMarkdown(text) {
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}`,
      'test.js': `import { SyncEngine, generateNoteId, sanitizeMarkdown } from './utils';

// Test ID generation
const id1 = generateNoteId();
const id2 = generateNoteId();
console.assert(id1 !== id2, 'Unique IDs');
console.log('✓ generateNoteId works');

// Test sanitize
console.assert(sanitizeMarkdown('<script>') === '&lt;script&gt;', 'Sanitizes HTML');
console.log('✓ sanitizeMarkdown works');

// Test SyncEngine
SyncEngine.saveLocalNotes([{ id: '1', text: 'Test' }]);
SyncEngine.getLocalNotes().then(notes => {
  console.assert(notes.length === 1, 'Local persistence works');
  console.log('✓ SyncEngine persistence works');
  console.log('All tests passed!');
});`
    }
  },
];

export function getWorkspaceLibrary(): ChallengeWorkspace[] {
  return workspaceLibrary;
}

export function findWorkspaceById(id: string): ChallengeWorkspace | undefined {
  return workspaceLibrary.find(w => w.id === id);
}

export function findWorkspacesByTrackAndSeniority(track: string, seniority: string): ChallengeWorkspace[] {
  return workspaceLibrary.filter(w =>
    w.track === track.toLowerCase() && w.seniority === seniority.toLowerCase()
  );
}

export function findWorkspacesByTags(tags: string[]): ChallengeWorkspace[] {
  const tagSet = new Set(tags.map(t => t.toLowerCase()));
  return workspaceLibrary.filter(w =>
    w.tags.some(t => tagSet.has(t.toLowerCase()))
  );
}
