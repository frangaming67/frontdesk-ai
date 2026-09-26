export interface Challenge {
  contactHash: string;
  sessionHash: string;
  channel: "email" | "sms";
  codeHash?: string;
  providerId?: string;
  attempts: number;
  consentVersion: string;
  consentAt: string;
}
export type Limit = { key: string; max: number; seconds: number };
export interface VerificationStore {
  limit(rules: Limit[]): Promise<boolean>;
  put(id: string, challenge: Challenge): Promise<void>;
  attempt(id: string, contactHash: string, sessionHash: string): Promise<Challenge | null>;
  consume(id: string): Promise<boolean>;
}

// All counters are checked and incremented atomically across Vercel instances.
export const LIMIT_SCRIPT = `
for i,key in ipairs(KEYS) do
  if tonumber(redis.call('GET',key) or '0') >= tonumber(ARGV[(i-1)*2+1]) then return 0 end
end
for i,key in ipairs(KEYS) do
  local count = redis.call('INCR',key)
  if count == 1 then redis.call('EXPIRE',key,ARGV[(i-1)*2+2]) end
end
return 1`;
export const ATTEMPT_SCRIPT = `
local raw = redis.call('GET',KEYS[1])
if not raw then return false end
local item = cjson.decode(raw)
if item.contactHash ~= ARGV[1] or item.sessionHash ~= ARGV[2] then return false end
if item.attempts >= 5 then redis.call('DEL',KEYS[1]); return false end
item.attempts = item.attempts + 1
local encoded = cjson.encode(item)
redis.call('SET',KEYS[1],encoded,'KEEPTTL')
return encoded`;

export class RedisVerificationStore implements VerificationStore {
  private async command<T>(args: (string | number)[]): Promise<T> {
    const result = await fetch(process.env.UPSTASH_REDIS_REST_URL!, {
      method: "POST", cache: "no-store", signal: AbortSignal.timeout(6000),
      headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify(args),
    });
    if (!result.ok) throw new Error("Verification storage unavailable");
    const body = await result.json();
    if (body.error) throw new Error("Verification storage unavailable");
    return body.result as T;
  }
  async limit(rules: Limit[]) {
    return await this.command<number>(["EVAL", LIMIT_SCRIPT, rules.length, ...rules.map(rule => `fd:v1:limit:${rule.key}`), ...rules.flatMap(rule => [rule.max, rule.seconds])]) === 1;
  }
  async put(id: string, challenge: Challenge) {
    await this.command(["SET", `fd:v1:challenge:${id}`, JSON.stringify(challenge), "EX", 600]);
  }
  async attempt(id: string, contactHash: string, sessionHash: string) {
    const value = await this.command<string | null>(["EVAL", ATTEMPT_SCRIPT, 1, `fd:v1:challenge:${id}`, contactHash, sessionHash]);
    return value ? JSON.parse(value) as Challenge : null;
  }
  async consume(id: string) { return await this.command<number>(["DEL", `fd:v1:challenge:${id}`]) === 1; }
}
