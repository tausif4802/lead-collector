'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  const [handleInput, setHandleInput] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state

  const handleChange = (e: any) => {
    setHandleInput(e.target.value);
  };

  const appendRow = async () => {
    setLoading(true);
    try {
      await axios({
        method: 'post',
        url: '/api/appendRow',
        headers: { 'Content-Type': 'application/json' },
        data: {
          handle: handleInput,
        },
      });
      toast.success('🦄 Lead Collected!', {
        position: 'bottom-center',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    } catch (error: any) {
      toast.error(error.response.data ? error.response.data : error.message, {
        position: 'bottom-center',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    } finally {
      setHandleInput('');
      setLoading(false); // Set loading back to false when request is complete
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-zinc-200">
      <Card className=" flex flex-col items-center p-16 bg-slate-50">
        <h1 className="text-3xl font-bold p-10">
          Fitness Influencer Lead Collector
        </h1>
        <Input
          placeholder="Enter Influencer Instagram Handle"
          value={handleInput}
          onChange={handleChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter') appendRow();
          }}
        />
        <Button className="m-8" onClick={appendRow} disabled={loading}>
          {loading ? 'Adding...' : 'Add Influencer to Sheet'}
        </Button>
      </Card>
      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </main>
  );
}
