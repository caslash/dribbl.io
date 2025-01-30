import confetti from 'canvas-confetti';

const useConfetti = () => {
  const onConfetti = () => {
    const end = Date.now() + 1 * 1000;
    const colors = ['#1d428a', '#c8102e', '#ffffff'];

    const frame = () => {
      if (Date.now() > end) return;

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors,
      });

      requestAnimationFrame(frame);
    };

    frame();
  };

  return { onConfetti };
};

export default useConfetti;
