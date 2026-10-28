import { env } from '../config/env';
import { BadRequestError } from '../common/errors/app-error';

export interface NaloRawRequest {
  USERID?: string;
  MSISDN: string;
  USERDATA?: string;
  MSGTYPE: boolean | string | number;
  NETWORK?: string;
  SESSIONID?: string;
}

export interface NaloRawResponse {
  USERID: string;
  MSISDN: string;
  USERDATA: string;
  MSG: string;
  MSGTYPE: boolean;
}

export interface InternalUssdRequest {
  provider: 'NALO';
  userId: string;
  msisdn: string;
  userInput: string;
  isInitialRequest: boolean;
  network?: string;
  sessionId?: string;
  eventCodeExtracted?: string;
}

export interface InternalUssdResponse {
  message: string;
  continueSession: boolean;
}

export class NaloAdapter {
  /**
   * Parses and validates incoming NALO USSD request payload
   * According to NALO documentation:
   * - Payload contains: USERID, MSISDN, USERDATA, MSGTYPE
   * - MSISDN is the unique identifier for the user session
   * - Initial screen: MSGTYPE is true
   * - Subsequent screens: MSGTYPE is false
   */
  static parseRequest(body: unknown): InternalUssdRequest {
    if (!body || typeof body !== 'object') {
      throw new BadRequestError('Invalid NALO USSD request payload: expected JSON object');
    }

    const payload = body as Partial<NaloRawRequest>;

    if (!payload.MSISDN) {
      throw new BadRequestError('Missing mandatory MSISDN in NALO payload');
    }

    // Preserve MSISDN as clean string
    const msisdn = String(payload.MSISDN).trim();
    const sessionId = payload.SESSIONID ? String(payload.SESSIONID).trim() : undefined;
    const userId = payload.USERID ? String(payload.USERID).trim() : env.NALO_USER_ID;
    const rawUserData =
      payload.USERDATA !== undefined && payload.USERDATA !== null
        ? String(payload.USERDATA).trim()
        : '';
    const network = payload.NETWORK ? String(payload.NETWORK).trim() : undefined;

    // In NALO protocol:
    // MSGTYPE true from provider indicates initial new session request
    // MSGTYPE false from provider indicates subsequent dial (reply to prompt)
    let isInitialRequest = true;
    if (typeof payload.MSGTYPE === 'boolean') {
      isInitialRequest = payload.MSGTYPE;
    } else if (typeof payload.MSGTYPE === 'string') {
      const lower = payload.MSGTYPE.trim().toLowerCase();
      isInitialRequest = lower === 'true' || lower === '1';
    } else if (typeof payload.MSGTYPE === 'number') {
      isInitialRequest = payload.MSGTYPE === 1;
    }

    // Extract event code from dial string if present on initial dial
    // Supported patterns:
    // *920*969*1001# -> 1001
    // *920*1001#     -> 1001
    // 920*969*1001#  -> 1001
    let eventCodeExtracted: string | undefined;

    if (isInitialRequest && rawUserData) {
      const match = rawUserData.match(/\*920\*969\*(\d{3,10})#?$/);
      if (match && match[1]) {
        eventCodeExtracted = match[1];
      }
    }

    return {
      provider: 'NALO',
      userId,
      msisdn,
      userInput: rawUserData,
      isInitialRequest,
      network,
      sessionId,
      eventCodeExtracted,
    };
  }

  /**
   * Formats internal response into official NALO response contract:
   * {
   *   "USERID": "NALOTest",
   *   "MSISDN": "233XXXXXXXXX",
   *   "USERDATA": "...",
   *   "MSG": "...",
   *   "MSGTYPE": true/false
   * }
   * MSGTYPE true = prompt user for next input (continue session)
   * MSGTYPE false = terminal screen / end session
   */
  static formatResponse(
    request: InternalUssdRequest,
    response: InternalUssdResponse
  ): NaloRawResponse {
    let msg = response.message || '';

    // Enforce NALO maximum message length (default 120 characters)
    if (msg.length > env.NALO_MAX_MESSAGE_LENGTH) {
      msg = msg.slice(0, env.NALO_MAX_MESSAGE_LENGTH - 3) + '...';
    }

    return {
      USERID: request.userId || env.NALO_USER_ID,
      MSISDN: request.msisdn,
      USERDATA: request.userInput || '',
      MSG: msg,
      MSGTYPE: response.continueSession,
    };
  }
}
