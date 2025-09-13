// Test script for chat API
const testChatAPI = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          { role: 'user', content: 'What are some eco-friendly practices for students?' }
        ]
      })
    });

    const data = await response.json();
    console.log('Chat API Response:', data);
    
    if (data.result && data.result.choices && data.result.choices[0]) {
      console.log('✅ Chat API is working!');
      console.log('Response:', data.result.choices[0].message.content);
    } else {
      console.log('❌ Chat API response format unexpected');
    }
  } catch (error) {
    console.error('❌ Chat API test failed:', error);
  }
};

// Run test if in browser environment
if (typeof window !== 'undefined') {
  testChatAPI();
}
