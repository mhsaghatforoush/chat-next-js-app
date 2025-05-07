import jwt from 'jsonwebtoken';

interface DecodedToken {
  id: string;
  iat: number;
  exp: number;
}

export async function verifyAuth(token: string): Promise<DecodedToken | null> {
  try {
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'your_jwt_secret_key_here'
    ) as DecodedToken;
    
    return decoded;
  } catch (error) {
    console.error('خطا در تأیید توکن:', error);
    return null;
  }
}