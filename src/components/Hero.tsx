'use client';
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useUser } from '@clerk/nextjs';

const Hero = () => {
  const { user } = useUser();
  const [joke, setJoke] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const geminiProApiKey = process.env.NEXT_PUBLIC_GEMINI_PRO_API || '';
  const genAI = new GoogleGenerativeAI(geminiProApiKey);

  async function generateJoke() {
    try {
      setLoading(true);
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const prompt = `Generate a joke in two lines about "${inputValue}", and also append at the end, that thanks for using this tool made by Ashutosh Kumar (AKA @ashusnapx).`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text();

      setJoke(text); // Set the generated joke in state
      setError('');
    } catch (error) {
      console.error('Error generating joke:', error);
      setError('Error generating joke. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!inputValue.trim()) {
      setError('Please enter a topic for the joke.');
    } else {
      if (!user?.id) {
        // Redirect to sign-in page
        window.location.href = '/sign-in'; // Replace '/sign-in' with your actual sign-in page URL
      } else {
        generateJoke();
      }
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white'>
      <form
        className='grid grid-cols-1 md:grid-cols-3 gap-3 max-w-[350px] w-full px-4 md:px-0'
        onSubmit={handleSubmit}
      >
        <Input
          placeholder='Enter topic for joke'
          className='col-span-2 max-w-full mb-4 text-black'
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setError('');
          }}
        />
        <Button
          type='submit'
          className='col-span-1 bg-blue-500 hover:bg-blue-600'
        >
          Get Joke
        </Button>
      </form>
      {loading && (
        <div className='mt-4'>
          <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white'></div>
        </div>
      )}
      {error && <div className='mt-4 text-red-500'>{error}</div>}
      {joke && !loading && (
        <div className='mt-4 p-4 md:p-6 max-w-screen-lg w-full bg-white text-gray-900 rounded-md'>
          <ReactMarkdown>{joke}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default Hero;
