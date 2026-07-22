import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

type LimitResult = { success: boolean; retryAfterSec: number };

const MAX_MAP = 50_000;

type MemEntry = { count: number; resetAt: number };

const memStores = {
  login: new Map<string, MemEntry>(),
  register: new Map<string, MemEntry>(),
  payIp: new Map<string, MemEntry>(),
  payUser: new Map<string, MemEntry>(),
  iyziCb: new Map<string, MemEntry>(),
  clubApplyIp: new Map<string, MemEntry>(),
  clubApplyEmail: new Map<string, MemEntry>(),
  radioChatUser: new Map<string, MemEntry>(),
};

function prune(map: Map<string, MemEntry>) {
  if (map.size <= MAX_MAP) return;
  const now = Date.now();
  for (const [k, v] of map) {
    if (v.resetAt < now) map.delete(k);
    if (map.size <= MAX_MAP * 0.7) break;
  }
}

function memoryHit(map: Map<string, MemEntry>, key: string, limit: number, windowMs: number): LimitResult {
  prune(map);
  const now = Date.now();
  const e = map.get(key);
  if (!e || now >= e.resetAt) {
    map.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, retryAfterSec: 0 };
  }
  if (e.count >= limit) {
    return { success: false, retryAfterSec: Math.max(1, Math.ceil((e.resetAt - now) / 1000)) };
  }
  e.count += 1;
  return { success: true, retryAfterSec: 0 };
}

let sharedRedis: Redis | null | undefined;

function redisFromEnv(): Redis | null {
  if (sharedRedis !== undefined) return sharedRedis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    sharedRedis = null;
    return null;
  }
  sharedRedis = new Redis({ url, token });
  return sharedRedis;
}

let rlLogin: Ratelimit | null | undefined;
let rlRegister: Ratelimit | null | undefined;
let rlPayIp: Ratelimit | null | undefined;
let rlPayUser: Ratelimit | null | undefined;
let rlIyziCb: Ratelimit | null | undefined;
let rlClubApplyIp: Ratelimit | null | undefined;
let rlClubApplyEmail: Ratelimit | null | undefined;

function getRlLogin() {
  if (rlLogin !== undefined) return rlLogin;
  const r = redisFromEnv();
  if (!r) {
    rlLogin = null;
    return null;
  }
  rlLogin = new Ratelimit({
    redis: r,
    limiter: Ratelimit.slidingWindow(12, "15 m"),
    prefix: "noqta:login",
    analytics: true,
  });
  return rlLogin;
}

function getRlRegister() {
  if (rlRegister !== undefined) return rlRegister;
  const r = redisFromEnv();
  if (!r) {
    rlRegister = null;
    return null;
  }
  rlRegister = new Ratelimit({
    redis: r,
    limiter: Ratelimit.slidingWindow(6, "1 h"),
    prefix: "noqta:register",
    analytics: true,
  });
  return rlRegister;
}

function getRlPayIp() {
  if (rlPayIp !== undefined) return rlPayIp;
  const r = redisFromEnv();
  if (!r) {
    rlPayIp = null;
    return null;
  }
  rlPayIp = new Ratelimit({
    redis: r,
    limiter: Ratelimit.slidingWindow(40, "1 h"),
    prefix: "noqta:pay:ip",
    analytics: true,
  });
  return rlPayIp;
}

function getRlPayUser() {
  if (rlPayUser !== undefined) return rlPayUser;
  const r = redisFromEnv();
  if (!r) {
    rlPayUser = null;
    return null;
  }
  rlPayUser = new Ratelimit({
    redis: r,
    limiter: Ratelimit.slidingWindow(20, "1 h"),
    prefix: "noqta:pay:user",
    analytics: true,
  });
  return rlPayUser;
}

function getRlIyziCb() {
  if (rlIyziCb !== undefined) return rlIyziCb;
  const r = redisFromEnv();
  if (!r) {
    rlIyziCb = null;
    return null;
  }
  rlIyziCb = new Ratelimit({
    redis: r,
    limiter: Ratelimit.slidingWindow(60, "1 m"),
    prefix: "noqta:iyzi:cb",
    analytics: true,
  });
  return rlIyziCb;
}

function getRlClubApplyIp() {
  if (rlClubApplyIp !== undefined) return rlClubApplyIp;
  const r = redisFromEnv();
  if (!r) {
    rlClubApplyIp = null;
    return null;
  }
  rlClubApplyIp = new Ratelimit({
    redis: r,
    limiter: Ratelimit.slidingWindow(5, "30 m"),
    prefix: "noqta:club:apply:ip",
    analytics: true,
  });
  return rlClubApplyIp;
}

function getRlClubApplyEmail() {
  if (rlClubApplyEmail !== undefined) return rlClubApplyEmail;
  const r = redisFromEnv();
  if (!r) {
    rlClubApplyEmail = null;
    return null;
  }
  rlClubApplyEmail = new Ratelimit({
    redis: r,
    limiter: Ratelimit.slidingWindow(2, "30 d"),
    prefix: "noqta:club:apply:email",
    analytics: true,
  });
  return rlClubApplyEmail;
}

async function upstashLimit(rl: Ratelimit, key: string): Promise<LimitResult> {
  const out = await rl.limit(key);
  if (out.success) return { success: true, retryAfterSec: 0 };
  const resetMs = typeof out.reset === "number" ? out.reset : new Date(out.reset as unknown as string).getTime();
  const sec = Math.max(1, Math.ceil((resetMs - Date.now()) / 1000));
  return { success: false, retryAfterSec: sec };
}

/** Giriş: IP başına ~12 deneme / 15 dk */
export async function rateLimitLogin(ip: string): Promise<LimitResult> {
  const rl = getRlLogin();
  if (rl) return upstashLimit(rl, ip);
  return memoryHit(memStores.login, ip, 12, 15 * 60 * 1000);
}

/** Kayıt: IP başına 6 / saat */
export async function rateLimitRegister(ip: string): Promise<LimitResult> {
  const rl = getRlRegister();
  if (rl) return upstashLimit(rl, ip);
  return memoryHit(memStores.register, ip, 6, 60 * 60 * 1000);
}

/** Ödeme başlat: IP + kullanıcı ayrı limit */
export async function rateLimitPayInit(ip: string, userId: string): Promise<LimitResult> {
  const rlIp = getRlPayIp();
  const rlUser = getRlPayUser();
  if (rlIp && rlUser) {
    const a = await upstashLimit(rlIp, ip);
    if (!a.success) return a;
    return upstashLimit(rlUser, userId);
  }
  const a = memoryHit(memStores.payIp, ip, 40, 60 * 60 * 1000);
  if (!a.success) return a;
  return memoryHit(memStores.payUser, userId, 20, 60 * 60 * 1000);
}

/** İyzico callback flood */
export async function rateLimitIyzicoCallback(ip: string): Promise<LimitResult> {
  const rl = getRlIyziCb();
  if (rl) return upstashLimit(rl, ip);
  return memoryHit(memStores.iyziCb, ip, 60, 60 * 1000);
}

/** Noqta Club başvuru: IP bazlı + email bazlı basit koruma */
export async function rateLimitNoqtaClubApply(ip: string, email: string): Promise<LimitResult> {
  const rlIp = getRlClubApplyIp();
  const rlEmail = getRlClubApplyEmail();

  // Upstash varsa iki limit de çalışsın
  if (rlIp && rlEmail) {
    const a = await upstashLimit(rlIp, ip);
    if (!a.success) return a;
    return upstashLimit(rlEmail, email.toLowerCase().trim());
  }

  // Fallback: memory
  const a = memoryHit(memStores.clubApplyIp, ip, 5, 30 * 60 * 1000);
  if (!a.success) return a;
  return memoryHit(memStores.clubApplyEmail, email.toLowerCase().trim(), 2, 30 * 24 * 60 * 60 * 1000);
}

/** Radyo sohbeti: kullanıcı başına kısa süreli flood önleme */
export async function rateLimitRadioChatPost(userId: string): Promise<LimitResult> {
  return memoryHit(memStores.radioChatUser, userId, 24, 60 * 1000);
}
