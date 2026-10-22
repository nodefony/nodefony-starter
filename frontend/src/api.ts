/**
 * Lecture VÉRIFIÉE des réponses de l'API, partagée par la vitrine.
 *
 * Un `fetch(...).then((r) => r.json())` rend `any` : le déclarer `ApiData` avec
 * une conversion ne vérifie rien, et une réponse qui dévie (route changée,
 * erreur serveur rendue en JSON) casse plus loin, dans le rendu, sans désigner
 * la cause. Ces fonctions lisent la forme reçue et rendent `null` quand elle
 * n'est pas celle attendue : l'appelant décide quoi afficher.
 *
 * Pas de bibliothèque de schéma ici : ce fichier part dans le bundle du
 * NAVIGATEUR, et deux gardes de trois lignes n'en valent pas le poids.
 */

/** Réponse de `GET /api/hello`. */
export interface ApiData {
  hello: string;
  pid: number;
  /** Identité résolue par la zone firewall `main` (^/api) — « anonyme » sinon. */
  who?: string;
}

/** Réponse de la route PROTÉGÉE `GET /api/secure/hello` (zone `secure`, 401 sans session). */
export interface SecureData {
  message: string;
  zone: string;
  pid: number;
}

/** `value` est-il un objet dont on peut lire les champs par leur nom ? */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/** Nodefony enveloppe les réponses dans `{ result }` : on rend le contenu. */
function unwrap(json: unknown): unknown {
  return isRecord(json) && json.result != null ? json.result : json;
}

/**
 * Lit la réponse de `/api/hello`.
 *
 * @param json - corps JSON reçu, enveloppé ou non.
 * @returns les données, ou `null` si la forme n'est pas celle d'un `ApiData`.
 */
export function readApiData(json: unknown): ApiData | null {
  const body = unwrap(json);
  if (!isRecord(body)) return null;
  const { hello, pid, who } = body;
  if (typeof hello !== "string" || typeof pid !== "number") return null;
  return typeof who === "string" ? { hello, pid, who } : { hello, pid };
}

/**
 * Lit la réponse de `/api/secure/hello`.
 *
 * @param json - corps JSON reçu, enveloppé ou non.
 * @returns les données, ou `null` si la forme n'est pas celle d'un `SecureData`.
 */
export function readSecureData(json: unknown): SecureData | null {
  const body = unwrap(json);
  if (!isRecord(body)) return null;
  const { message, zone, pid } = body;
  if (
    typeof message !== "string" ||
    typeof zone !== "string" ||
    typeof pid !== "number"
  ) {
    return null;
  }
  return { message, zone, pid };
}
