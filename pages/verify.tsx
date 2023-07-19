import React, { useEffect, useState } from 'react';
import jwt from 'jsonwebtoken';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next/types';

type Token = {
  access_token: string;
  scope: string;
  expires_in: number;
  token_type: string;
};

export const getServerSideProps: GetServerSideProps<{
  token: Token;
}> = async () => {
  const res = await fetch(`${process.env.AUTH0_BASE_URL}/api/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const token = await res.json();
  return { props: { token } };
};

export default function Verify({ token }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [isDisabled, setIsDisabled] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [state, setState] = useState('');
  const [userId, setUserId] = useState('');
  const [continueUri, setContinueUri] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const decoded = jwt.decode(urlParams.get('session_token')) as jwt.JwtPayload;

    setState(urlParams.get('state'));
    setUserId(decoded.user_id);
    setContinueUri(decoded.continue_uri);
  }, []);

  const handleSendClick = async () => {
    setIsDisabled(true);
    await fetch('/api/jobs/verification-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `${token.token_type} ${token.access_token}`
      },
      body: JSON.stringify(
        {
          user_id: userId
        },
        null,
        2
      )
    });
  };

  useEffect(() => {
    let interval = null;

    if (isDisabled) {
      interval = setInterval(() => {
        setCountdown(prevCountdown => prevCountdown - 1);
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isDisabled]);

  useEffect(() => {
    if (countdown === 0) {
      setIsDisabled(false);
      setCountdown(60);
    }
  }, [countdown]);

  const handleHereClick = async () => {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token.token_type} ${token.access_token}`
        }
      });
      const user = await res.json();

      if (user.email_verified) {
        window.location.href = `${continueUri}?state=${state}`;
      } else {
        document.getElementById('error-msg').textContent = 'Your email have not been verified yet.';
      }
    } catch (error) {
      document.getElementById('error-msg').textContent = 'Oops, something went wrong please try it again later.';
    }
  };

  return (
    <div className="my-5 text-center">
      <button type="button" className="btn btn-primary" onClick={handleSendClick} disabled={isDisabled}>
        {isDisabled ? `Resend Email Verification (${countdown})` : 'Resend Email Verification'}
      </button>
      <p className="mt-5">
        If you verify the email, click{' '}
        <a href="#" onClick={handleHereClick}>
          here
        </a>{' '}
        to continue.
      </p>
      <p id="error-msg" className="text-danger"></p>
    </div>
  );
}
