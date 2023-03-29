import React, { useState } from 'react';
import Lottie from 'react-lottie';
import * as animationDark from '../../assets/logo-dark-animation.json';
import * as animationLight from '../../assets/logo-light-animation.json';
import { useStore } from '../../store';
import Input from '../../components/Input';

const Login: React.FC = () => {
  const { state, dispatch } = useStore();
  const [password, setPassword] = useState('');

  return (
    <div className="flex flex-col justify-center items-center">
      <Lottie
        options={{
          loop: false,
          autoplay: true,
          animationData:
            state.theme === 'dark' ? animationDark : animationLight,
          rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
          },
        }}
        height={state.display === 'tab' ? 400 : 240}
        width={state.display === 'tab' ? 400 : 240}
      />
      <h1 className="text-2xl md:text-4xl font-bold">Welcome back!</h1>
      <h1 className="text-lg md:text-xl font-light">Enter your password</h1>
      <div className="text-center">
        <Input
          type="password"
          label="Enter your password"
          name="password"
          value={password}
          onChange={setPassword}
        />
      </div>
    </div>
  );
};

export default Login;
