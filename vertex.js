      // Import the functions you need from the SDKs you need
      import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
      import { getVertexAI, getGenerativeModel } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-vertexai-preview.js";
      import { initializeAppCheck, ReCaptchaV3Provider  } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app-check.js";
      // TODO: Add SDKs for Firebase products that you want to use
      // https://firebase.google.com/docs/web/setup#available-libraries
    
      // Your web app's Firebase configuration
      const firebaseConfig = {
        apiKey: "AIzaSyDtKuM3RRvfLvYQQi-ejKzkeQGXc6TfA90",
        authDomain: "sample-firebase-ai-app-a0c7c.firebaseapp.com",
        projectId: "sample-firebase-ai-app-a0c7c",
        storageBucket: "sample-firebase-ai-app-a0c7c.appspot.com",
        messagingSenderId: "799587835059",
        appId: "1:799587835059:web:55eb534012517f40b524c6"
      };
    
      // Initialize Firebase
      const app = initializeApp(firebaseConfig);
// Pass your reCAPTCHA v3 site key (public key) to activate(). Make sure this
// key is the counterpart to the secret key you set in the Firebase console.
const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider('6LdJJFcqAAAAAGCKparMNjIQcV4UsjApZjCnowLV'),

  // Optional argument. If true, the SDK automatically refreshes App Check
  // tokens as needed.
  isTokenAutoRefreshEnabled: true
});


// Initialize the Vertex AI service
const vertexAI = getVertexAI(app);

// Initialize the generative model with a model that supports your use case
// Gemini 1.5 models are versatile and can be used with all API capabilities
const model = getGenerativeModel(vertexAI, { model: "gemini-1.5-flash" });

// Wrap in an async function so you can use await
async function run() {
  // Provide a prompt that contains text
  const prompt = "Tell me Hi"

  // To generate text output, call generateContent with the text input
  const result = await model.generateContent(prompt);

  const response = result.response;
  const text = response.text();
  document.body.innerHTML = "<h1>" + text +"</h1>"
  console.log(text);
}

run();
