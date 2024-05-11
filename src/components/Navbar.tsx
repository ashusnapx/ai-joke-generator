'use client';
import { GithubIcon, TwitterIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { Button } from './ui/button';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';

const Navbar = () => {
  const { user } = useUser();
  return (
    <div className='p-5 flex flex-col md:flex-row space-y-4 md:space-y-0 items-center justify-between bg-slate-300'>
      <Link href='/'>
        <div className='text-2xl tracking-tighter'>Joke Generator</div>
        <div>By Ashutosh Kumar</div>
      </Link>
      <div className='flex items-center space-x-6'>
        <Link href='https://github.com/ashusnapx' target='__blank'>
          <GithubIcon />
        </Link>
        <Link href='https://x.com/ashusnapx' target='__blank'>
          <TwitterIcon />
        </Link>
      </div>

      <div className='space-x-2'>
        {!user?.id ? (
          <>
            <Button className='col-span-1 bg-blue-500 hover:bg-blue-600'>
              <Link href='/sign-in'>Sign in</Link>
            </Button>
            <Button className='col-span-1 bg-blue-500 hover:bg-blue-600'>
              <Link href='/sign-up'>Sign up</Link>
            </Button>
          </>
        ) : (
          <>
            <h1>{user.fullName}</h1>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
