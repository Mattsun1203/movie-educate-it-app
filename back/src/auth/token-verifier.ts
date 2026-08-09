import { type JWTPayload, importSPKI, jwtVerify } from "jose";

export type AccessTokenPayload = JWTPayload & {
  sub: string;
  email: string;
};

// 公開鍵のインポートはリクエストに依存しない（Hyperdriveの接続と違い使い回しても安全）ため、
// Workerのアイソレートが再利用される間はモジュールスコープでキャッシュする。
let cachedPublicKey: { source: string; key: CryptoKey } | undefined;

async function getPublicKey(publicKeyBase64: string): Promise<CryptoKey> {
  if (cachedPublicKey?.source === publicKeyBase64) return cachedPublicKey.key;

  const pem = atob(publicKeyBase64);
  const key = await importSPKI(pem, "RS256");
  cachedPublicKey = { source: publicKeyBase64, key };
  return key;
}

export async function verifyAccessToken(
  token: string,
  publicKeyBase64: string,
): Promise<AccessTokenPayload> {
  const key = await getPublicKey(publicKeyBase64);
  const { payload } = await jwtVerify(token, key, { algorithms: ["RS256"] });

  if (typeof payload.sub !== "string" || typeof payload.email !== "string") {
    throw new Error("access tokenのpayloadにsub/emailが含まれていません");
  }

  return payload as AccessTokenPayload;
}
