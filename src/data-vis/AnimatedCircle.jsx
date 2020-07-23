import React, { useState } from "react";
import { animated, useSpring } from "react-spring";

const AnimatedCircle = ({ data, isShowing }) => {
  const { title, channel, category } = data;
  const style = useSpring({
    config: {
      duration: 1200,
    },
    r: isShowing ? 6 : 0,
    opacity: isShowing ? 1 : 0,
  });

  return (
    <animated.circle
      {...style}
      cx={100}
      cy={100}
      r={50}
      fill="cornflowerblue"
    />
  );
};

export default AnimatedCircle;
