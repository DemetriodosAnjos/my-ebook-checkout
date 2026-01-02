"use client";

import { useState, useEffect } from "react";
import "./Timer.css";

interface TimerDisplayProps {
  targetDate: number;
}

export default function TimerDisplay({ targetDate }: TimerDisplayProps) {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance <= 0) {
        window.location.reload();
        return;
      }

      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // PadStart garante que o cronômetro não fique "pulando" (ex: 09:05)
      const displayMin = String(minutes).padStart(2, "0");
      const displaySec = String(seconds).padStart(2, "0");

      setTimeLeft(`${displayMin}:${displaySec}`);
    };

    // Executa imediatamente para evitar o "Carregando..."
    calculateTime();

    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="timer-container">
      <div className="timer-box">
        <span className="timer-label">O desconto expira em</span>
        <span className="timer-counter">{timeLeft || "00:00"}</span>
      </div>
    </div>
  );
}
