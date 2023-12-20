
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage, send } from "firebase/messaging";

import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

import {
  getDoc,
  doc,
} from "firebase/firestore";


// Your web app's Firebase configuration


const firebaseConfig = {
  apiKey: "AIzaSyAgSVbtmzjYqfiCg94Oqm7EzMR6kEeyEcs",
  authDomain: "delivery-80a18.firebaseapp.com",
  projectId: "delivery-80a18",
  storageBucket: "delivery-80a18.appspot.com",
  messagingSenderId: "259018534537",
  appId: "1:259018534537:web:6f7a89b0139968f0d6a058"
};

//notification key 
const fcmServerKey ="AAAA9tNp-9U:APA91bGjRknS__MsOIdAIDjfPWAYaqNRLWvG9cRgxYnG4MQyHtZ-P0JWjiB33xwLOSX5aRsd9NDO1vUw31VxesiJouzpIhAu-hs7WY1a3qdJnua-yV55rKLnRSBAJvimHS45UXvSbbL6";


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
export const storage = getStorage(app);



export const  sendNotificationsToUser= async (userEmail,title, displayValue)=>  {
  // Get the tokens for the friend
  const tokens = await getUserTokens(userEmail);

  // Iterate over the tokens and send a notification to each friend
  for (const token of tokens) {
    await sendNotifications(fcmServerKey,token, title, displayValue);
  }
}



const  getUserTokens= async(userEmail)=> {
  const docRef = doc(db, "USERDATA", userEmail);
  const docSnap = await getDoc(docRef);
  if(!docSnap.exists()){
    throw new Error("No tokens found for user " + userEmail);
  }

    //setData({ ...docSnap.data() });
    const tokens = docSnap.data().tokens;

    if (!tokens) {
      // The tokens field is empty, throw an error
      throw new Error("No tokens found for user " + userEmail);
    }

  // Return the tokens
        return tokens;

}

const sendNotifications=(fcmServerKey,userFcmToken, title, body)=> {
  // Create a new XMLHttpRequest object
  var xhr = new XMLHttpRequest();

  // Set the request method to POST
  xhr.open("POST", "https://fcm.googleapis.com/fcm/send");

  // Set the request headers
  xhr.setRequestHeader("Authorization", "key=" + fcmServerKey);
  xhr.setRequestHeader("Content-Type", "application/json");

  // Create a JSON object to send as the request body
  var data = {
    to: userFcmToken,
    notification: {
      title: title,
      body: body,
      icon: "icon" // enter icon that exists in drawable only
    }
  };

  // Send the request
  xhr.send(JSON.stringify(data));

  // Handle the response
  xhr.onload = function() {
    if (xhr.status === 200) {
    } else {
      // Error!
      console.Error("Error sending notification: " + xhr.status);
    }
  };
}



export const updateTaskStatus = async (taskId, newStatus, userEmail) => {
  const tasksRef = db.collection("tasksCollection");

  // Update task status
  await tasksRef.doc(taskId).update({ status: newStatus });

  // Notify the user about the status update
  await sendNotificationsToUser(userEmail, "Task Status Updated", `Your task status is now: ${newStatus}`);

  // Show a local notification on the user's device
  showLocalNotification("Task Status Updated", `Your task status is now: ${newStatus}`);
}


// Function to show a local notification on the user's device
const showLocalNotification = async (title, body) => {
  const messaging = getMessaging();

  try {
    const currentToken = await getToken(messaging);

    if (currentToken) {
      // Request permission to show notifications (if not already granted)
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        // Show the notification
        const notification = new Notification(title, { body: body });
      } else {
        console.error("Notification permission denied");
      }
    } else {
      console.error("No registration token available. Request permission to generate one.");
    }
  } catch (error) {
    console.error("Error getting registration token:", error);
  }
}