import 'dotenv/config';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import * as path from 'path';
import * as fs from 'fs';

// Initialize Firebase Admin using the local env
const pk = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: pk,
  })
});

const firestore = getFirestore(app);
const auth = getAuth(app);

async function run() {
  console.log("Fetching all users from Firebase Auth...");
  let pageToken;
  let count = 0;
  
  do {
    const listUsersResult: any = await auth.listUsers(1000, pageToken);
    
    for (const user of listUsersResult.users) {
      // If the email is a company email (not a personal gmail/yahoo/etc)
      if (user.email && !user.email.endsWith("@gmail.com") && !user.email.endsWith("@yahoo.com") && !user.email.endsWith("@hotmail.com")) {
        console.log(`Resetting password for: ${user.email}`);
        
        // Update password to a default temporary password
        await auth.updateUser(user.uid, {
          password: "Welcome2026!"
        });
        
        // Force them to change their password on next login
        await firestore.collection("users").doc(user.uid).update({
          mustChangePassword: true
        });
        
        count++;
      }
    }
    
    pageToken = listUsersResult.pageToken;
  } while (pageToken);
  
  console.log(`Successfully reset passwords for ${count} internal accounts.`);
}

run().catch(console.error);
