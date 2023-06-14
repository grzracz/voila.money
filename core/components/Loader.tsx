import React from 'react';
import Lottie from 'react-lottie';
import { useDarkMode } from '../utils/darkMode';
import * as animationDark from '../assets/loader-dark-animation.json';
import * as animationLight from '../assets/loader-light-animation.json';

const Loader = () => {
  const { isDark } = useDarkMode();

  return (
    <div
      key={`animation-loader-${isDark}`}
      className="flex flex-col justify-center items-center p-2 min-h-[360px]"
    >
      <Lottie
        options={{
          loop: true,
          autoplay: true,
          animationData: isDark ? animationDark : animationLight,
          rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
          },
        }}
        height={240}
        width={240}
      />
    </div>
  );
};

export default Loader;
