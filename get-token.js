// Quick script to get Firebase token from browser console
// Copy and paste this into your browser console on Assay web app

(async () => {
  try {
    const user = firebase.auth().currentUser;
    if (!user) {
      console.error('Not signed in. Please sign in to Assay first.');
      return;
    }
    
    const token = await user.getIdToken();
    console.log('\n=== YOUR FIREBASE TOKEN ===');
    console.log(token);
    console.log('\n=== COPIED TO CLIPBOARD ===');
    
    await navigator.clipboard.writeText(token);
    console.log('Token is ready to paste into Claude Desktop config!\n');
  } catch (error) {
    console.error('Error getting token:', error);
  }
})();
