/**
 * Firebase integration using Cloud Function proxies
 * MCP server is now a thin client that calls Assay Cloud Functions
 * No Firestore access needed - all handled by backend!
 */

const ASSAY_FUNCTIONS_BASE_URL = process.env.ASSAY_FUNCTIONS_BASE_URL || 
  'https://us-east4-pdfsummaries.cloudfunctions.net';

// Firebase Web API key for token verification (service-level, not user-provided)
// This is a public API key restricted by domain/API restrictions in Firebase Console
const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY || 
  'AIzaSyBBq7eyl1vvcZWTdM1CmnPjlcX0OEsr5Ws';

/**
 * Verify Firebase ID token using Firebase Auth REST API
 */
export async function verifyToken(token: string): Promise<{ uid: string; email?: string }> {
  try {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken: token }),
      }
    );

    if (!response.ok) {
      const errorData = (await response.json().catch(() => ({}))) as any;
      throw new Error(`Token verification failed: ${errorData.error?.message || response.statusText}`);
    }

    const data = (await response.json()) as any;
    if (!data.users || data.users.length === 0) {
      throw new Error('Invalid token: no user found');
    }

    const user = data.users[0];
    return {
      uid: user.localId,
      email: user.email,
    };
  } catch (error) {
    throw new Error(`Token verification failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Get Claude API key from environment
 */
export function getClaudeApiKey(): string | undefined {
  return process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY;
}

/**
 * Call a Cloud Function with user's ID token
 */
export async function callCloudFunction(
  functionName: string,
  data: any,
  token: string
): Promise<any> {
  // Include Claude API key if available
  const claudeApiKey = getClaudeApiKey();
  if (claudeApiKey) {
    data.claudeApiKey = claudeApiKey;
  }

  const url = `${ASSAY_FUNCTIONS_BASE_URL}/${functionName}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorData: any;
    try {
      errorData = JSON.parse(errorText);
    } catch {
      errorData = { error: { message: errorText } };
    }
    
    throw new Error(
      `Cloud Function ${functionName} failed: ${errorData.error?.message || response.statusText} (${response.status})`
    );
  }

  const result = (await response.json()) as { result?: any; error?: { message?: string; code?: string } };
  
  // Firebase Callable Functions return { result: ... } or { error: ... }
  if (result.error) {
    throw new Error(`Cloud Function error: ${result.error.message || JSON.stringify(result.error)}`);
  }
  
  return result.result;
}

/**
 * Firestore wrapper that calls Cloud Functions instead
 * This maintains the same API so existing code doesn't break
 */
export function getFirestore(token: string) {
  return {
    collection: (collectionName: string) => ({
      where: (field: string, operator: string, value: any) => ({
        where: (field2: string, operator2: string, value2: any) => ({
          get: async () => {
            // This is a simplified wrapper - actual queries go through Cloud Functions
            // For now, return empty - individual tools will call Cloud Functions directly
            return { docs: [] };
          },
        }),
        get: async () => {
          return { docs: [] };
        },
      }),
      doc: (docId: string) => ({
        get: async () => {
          return { exists: false, id: docId, data: () => ({}) };
        },
      }),
      get: async () => {
        return { docs: [] };
      },
    }),
  };
}

// callCloudFunction is already exported above

/**
 * Initialize Firebase (no-op for this approach)
 */
export function initializeFirebase(): void {
  // No initialization needed - we use Cloud Functions
}
