import { Injectable, NestMiddleware } from '@nestjs/common';
// import { getAuth } from 'firebase/auth';
// import * as admin from 'firebase-admin';
import { firebaseAdmin } from 'src/firebase/firebase-admin.service';
import * as serviceAccount from '../config/firebase-config.json';
import { Request, Response } from 'express';

const firebase_params = {
  type: serviceAccount.type,
  projectId: serviceAccount.project_id,
  privateKeyId: serviceAccount.private_key_id,
  privateKey: serviceAccount.private_key,
  clientEmail: serviceAccount.client_email,
  clientId: serviceAccount.client_id,
  authUri: serviceAccount.auth_uri,
  tokenUri: serviceAccount.token_uri,
  authProviderX509CertUrl: serviceAccount.auth_provider_x509_cert_url,
  clientC509CertUrl: serviceAccount.client_x509_cert_url,
};

@Injectable()
export class PreauthMiddleware implements NestMiddleware {
  // private defaultApp: any;

  // constructor() {
  //   admin.initializeApp({
  //     credential: admin.credential.cert(firebase_params),
  //     storageBucket: 'gs://video-module-59670.appspot.com',
  //   });
  // }

  use(req: Request, res: Response, next: Function) {
    const token = req.headers.authorization;
    if (token != null && token != '' && token != undefined) {
      firebaseAdmin
        .auth()
        .verifyIdToken(token)
        .then((decoded) => {
          const user = {
            email: decoded.email,
          };
          req['user'] = user;
          next();
        })
        .catch((err) => {
          console.error(err, 'error');
          if (err) {
            this.tokenExpired(req.url, res, err.message);
          }
        });
    } else {
      this.accessDenied(req.url, res);
      next();
    }
  }

  private accessDenied(url: string, res: Response) {
    res.status(403).json({
      statusCode: 403,
      timestamp: new Date().toISOString(),
      path: url,
      message: 'access denied',
    });
  }

  private tokenExpired(url: string, res: Response, message: string) {
    res.status(403).json({
      statusCode: 403,
      timestamp: new Date().toISOString(),
      path: url,
      // message:
      //   'Firebase ID token has expired. Get a fresh ID token from your client app and try again',
      message:message,
    });
  }
}
