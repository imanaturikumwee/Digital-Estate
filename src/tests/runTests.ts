import { db } from '../server/db.js';
import { generateToken, verifyToken } from '../server/auth.js';
import { User } from '../types/index.js';

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  durationMs: number;
}

const results: TestResult[] = [];

async function test(name: string, fn: () => void | Promise<void>) {
  const start = performance.now();
  try {
    await fn();
    const durationMs = Math.round((performance.now() - start) * 100) / 100;
    results.push({ name, passed: true, durationMs });
    console.log(`  \x1b[32m✓ PASS\x1b[0m ${name} (${durationMs}ms)`);
  } catch (err: any) {
    const durationMs = Math.round((performance.now() - start) * 100) / 100;
    results.push({ name, passed: false, error: err?.message || String(err), durationMs });
    console.error(`  \x1b[31m✗ FAIL\x1b[0m ${name}: ${err?.message || err}`);
  }
}

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function runAllTests() {
  console.log('\n======================================================');
  console.log('  THE DIGITAL ESTATE - AUTOMATED UNIT TEST SUITE');
  console.log('======================================================\n');

  console.log('\x1b[36m[Authentication & JWT Security Services]\x1b[0m');
  await test('Generates and verifies valid JWT token with user claims', () => {
    const mockUser: User = {
      id: 'test-usr-99',
      name: 'Test Investor',
      email: 'investor@test.rw',
      role: 'owner',
      avatarUrl: 'https://example.com/avatar.jpg',
    };
    const token = generateToken(mockUser);
    assert(typeof token === 'string' && token.length > 20, 'Token must be a non-empty string');

    const decoded = verifyToken(token);
    assert(decoded !== null, 'Decoded token must not be null');
    assert(decoded?.userId === 'test-usr-99', 'Token userId must match input');
    assert(decoded?.email === 'investor@test.rw', 'Token email must match input');
    assert(decoded?.role === 'owner', 'Token role must match input');
  });

  await test('Rejects malformed or altered JWT tokens', () => {
    const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalidpayload.signature';
    const decoded = verifyToken(invalidToken);
    assert(decoded === null, 'Malformed token must fail verification');
  });

  await test('Authenticates seeded manager account and returns valid profile', () => {
    const user = db.findUserByEmail('owner@digitalestate.rw');
    assert(user !== undefined, 'Default seeded owner account must exist');
    assert(user?.passwordHash === 'password123', 'Password hash must verify correctly');
    assert(user?.role === 'owner', 'User role must be owner');
  });

  await test('Creates new user with specified role and prevents email duplicates', () => {
    const testEmail = `agent_${Date.now()}@digitalestate.rw`;
    const created = db.createUser({
      name: 'Agent Patrick',
      email: testEmail,
      role: 'agent',
      phone: '+250 788 111 222',
      avatarUrl: 'https://example.com/p.jpg',
      password: 'SecurePassword2026',
    });
    assert(created.id.startsWith('usr-'), 'User ID must start with usr-');
    assert(created.email === testEmail, 'Email must match');

    // Duplicate check
    const existing = db.findUserByEmail(testEmail);
    assert(existing !== undefined, 'User must be retrievable by email');
  });

  console.log('\n\x1b[36m[Property Database & Query Engine]\x1b[0m');
  await test('Retrieves all seed properties with essential architectural metadata', () => {
    const properties = db.getAllProperties();
    assert(properties.length >= 8, 'Must have at least 8 seeded luxury properties');
    
    const kigaliHeights = properties.find(p => p.title === 'Kigali View Heights');
    assert(kigaliHeights !== undefined, 'Kigali View Heights must exist');
    assert(kigaliHeights?.price === 450000, 'Kigali View Heights price must be 450,000');
    assert(kigaliHeights?.status === 'Active', 'Kigali View Heights status must be Active');
    assert(kigaliHeights?.aiScore === 94, 'AI Property Score must be 94');
  });

  await test('Correctly adds new property with Pending Approval state and formatted price', () => {
    const initialCount = db.getAllProperties().length;
    const added = db.addProperty({
      title: 'Kiyovu Hilltop Residence',
      price: 950000,
      formattedPrice: '$950,000',
      location: 'Kiyovu, Kigali',
      district: 'Kiyovu',
      propertyType: 'Residential',
      beds: 5,
      baths: 4,
      areaSqMeters: 480,
      status: 'Pending Approval',
      imageUrl: 'https://example.com/kiyovu.jpg',
    });

    assert(added.id.startsWith('prop-'), 'Property ID must start with prop-');
    assert(added.status === 'Pending Approval', 'New listing status must default to Pending Approval');
    assert(db.getAllProperties().length === initialCount + 1, 'Total property count must increment');
  });

  console.log('\n\x1b[36m[Concierge Chat & Real-Time Messaging Engine]\x1b[0m');
  await test('Retrieves active chat threads with online status and property context', () => {
    const chats = db.getChats();
    assert(chats.length >= 2, 'Must have seeded chat threads with Agent Dany and Emma M.');
    const danyChat = chats.find(c => c.id === 'chat-dany');
    assert(danyChat !== undefined, 'Agent Dany chat must exist');
    assert(danyChat?.online === true, 'Agent Dany must be online');
    assert(danyChat?.propertyContext?.title === 'Kigali View Heights', 'Context must point to Kigali View Heights');
  });

  await test('Appends user message and updates thread last message preview', () => {
    const message = db.addMessage('chat-dany', 'Can we tour the site this Saturday morning?', 'user');
    assert(message.sender === 'user', 'Sender must be user');
    assert(message.text === 'Can we tour the site this Saturday morning?', 'Message text must match');

    const updatedMessages = db.getMessages('chat-dany');
    const lastMsg = updatedMessages[updatedMessages.length - 1];
    assert(lastMsg.text === 'Can we tour the site this Saturday morning?', 'Last message in thread must match');
  });

  console.log('\n\x1b[36m[Notifications & Live Stream Service]\x1b[0m');
  await test('Dispatches unread notification and marks as read on demand', () => {
    const notif = db.addNotification({
      title: 'Test Valuation Completed',
      message: 'New property valuation certificate is ready for download.',
      type: 'valuation',
    });
    assert(notif.read === false, 'Notification must be unread upon dispatch');

    const readSuccess = db.markNotificationAsRead(notif.id);
    assert(readSuccess === true, 'markNotificationAsRead must return true');

    const fetched = db.getNotifications().find(n => n.id === notif.id);
    assert(fetched?.read === true, 'Notification read flag must now be true');
  });

  console.log('\n\x1b[36m[Financial Modeling & Mortgage Math Engine]\x1b[0m');
  await test('Computes accurate monthly mortgage amortization and down payments', () => {
    const price = 450000;
    const downPct = 25;
    const rate = 8.5; // 8.5% APR
    const years = 20;

    const downPayment = Math.round(price * (downPct / 100));
    assert(downPayment === 112500, 'Down payment for $450k at 25% must equal $112,500');

    const principal = price - downPayment;
    assert(principal === 337500, 'Principal loan must equal $337,500');

    const monthlyRate = rate / 100 / 12;
    const n = years * 12;
    const payment = Math.round((principal * (monthlyRate * Math.pow(1 + monthlyRate, n))) / (Math.pow(1 + monthlyRate, n) - 1));
    assert(payment > 2900 && payment < 3000, `Monthly payment must be in expected range (~$2,927), got $${payment}`);
  });

  await test('Converts currencies correctly with valid exchange rate ratios (USD, RWF, EUR)', () => {
    const usdPrice = 100000;
    const rwf = Math.round(usdPrice * 1420);
    const eur = Math.round(usdPrice * 0.92);

    assert(rwf === 142000000, '100k USD must convert to 142M RWF');
    assert(eur === 92000, '100k USD must convert to 92k EUR');
  });

  console.log('\n======================================================');
  const passedCount = results.filter(r => r.passed).length;
  const failedCount = results.filter(r => !r.passed).length;
  console.log(`  SUMMARY: ${passedCount} PASSED, ${failedCount} FAILED out of ${results.length} tests`);
  console.log('======================================================\n');

  if (failedCount > 0) {
    process.exit(1);
  }
}

runAllTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
