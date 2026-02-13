console.log('login.js loaded');

let isSignUp = true;

function toggleForm() {
  console.log('toggleForm called');
  isSignUp = !isSignUp;
  const formTitle = document.getElementById('form-title');
  const nameField = document.getElementById('name-field');
  const nameInput = document.getElementById('name');
  const submitBtn = document.getElementById('submit-btn');
  const toggleText = document.getElementById('toggle-text');

  if (isSignUp) {
    formTitle.textContent = 'Sign Up';
    nameField.style.display = 'block';
    nameInput.required = true;
    submitBtn.textContent = 'Sign Up';
    toggleText.innerHTML = 'Already have an account? <a href="#" onclick="toggleForm()">Login</a>';
  } else {
    formTitle.textContent = 'Login';
    nameField.style.display = 'none';
    nameInput.required = false;
    nameInput.value = ''; // Clear the value when hiding
    submitBtn.textContent = 'Login';
    toggleText.innerHTML = 'Don\'t have an account? <a href="#" onclick="toggleForm()">Sign Up</a>';
  }
}

window.toggleForm = toggleForm;

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded');
  document.getElementById('auth-form').addEventListener('submit', async function(e) {
    console.log('form submitted');
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const name = document.getElementById('name').value;

    console.log('email:', email, 'password:', password, 'name:', name, 'isSignUp:', isSignUp);

    if (isSignUp) {
      // Sign up logic
      try {
        console.log('attempting sign up');
        const userCredential = await window.auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        console.log('sign up success, user:', user);
        // Save user data to Firestore
        await window.db.collection("users").doc(user.uid).set({
          name: name,
          email: email
        });
        console.log('data saved');
        alert('Sign up successful!');
        window.location.href = 'index.html';
      } catch (error) {
        console.error('sign up error:', error);
        if (error.code === 'auth/email-already-in-use') {
          alert('This email is already registered. Please try logging in instead or use a different email.');
        } else {
          alert('Sign up failed: ' + error.message);
        }
      }
    } else {
      // Login logic
      try {
        console.log('attempting login');
        await window.auth.signInWithEmailAndPassword(email, password);
        console.log('login success');
        alert('Login successful!');
        window.location.href = 'index.html';
      } catch (error) {
        console.error('login error:', error);
        alert('Login failed: ' + error.message);
      }
    }
  });
});
