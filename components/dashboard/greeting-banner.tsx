"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getDashboardMetadataAction } from "@/app/actions";
import { SunIcon, CloudIcon, RainIcon, MoonIcon } from "./weather-icons";
import { MapPin, RefreshCw, Clock } from "lucide-react";

interface GreetingBannerProps {
  userName: string;
}

export function GreetingBanner({ userName }: GreetingBannerProps) {
  // Estado inicial separado para renderização imediata
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState<Date | null>(null);
  
  // Estado dos dados assíncronos (Clima/Frase)
  const [data, setData] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);

  // 1. Relógio em Tempo Real e Montagem
  useEffect(() => {
    setMounted(true);
    setTime(new Date()); // Define hora inicial no cliente para evitar hydration mismatch

    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 2. Busca de Dados (Assíncrona - Não bloqueia a UI)
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const meta = await getDashboardMetadataAction(latitude, longitude);
            setData(meta);
          } catch (error) {
            console.error("Erro ao buscar dados:", error);
          } finally {
            setLoadingData(false);
          }
        },
        async () => {
          // Permissão negada ou erro: usa fallback (Brasília) sem travar
          handleFallback();
        },
        { timeout: 5000 } // Timeout de 5s para não ficar esperando eternamente
      );
    } else {
      handleFallback();
    }
  }, []);

  const handleFallback = async () => {
    try {
      const meta = await getDashboardMetadataAction(-15.7975, -47.8919);
      setData(meta);
    } finally {
      setLoadingData(false);
    }
  };

  // Lógica de Saudação Instantânea
  const getGreeting = () => {
    if (!time) return "Olá";
    const hour = time.getHours();
    if (hour >= 5 && hour < 12) return "Bom dia";
    if (hour >= 12 && hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  // Formatação de Hora Instantânea
  const timeStr = time ? time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : "--:--:--";

  // Lógica de Tema (Baseada nos dados carregados ou fallback seguro)
  const getWeatherTheme = () => {
    if (!data) return { 
      gradient: "from-zinc-800 to-zinc-900", 
      icon: <SunIcon />, 
      label: "Carregando..." 
    };

    const { conditionCode, isDay } = data.weather;

    if (!isDay) return {
      gradient: "from-slate-900 via-purple-900 to-slate-900",
      icon: <MoonIcon />,
      label: "Noite Clara"
    };

    if (conditionCode === 0 || conditionCode === 1) return {
      gradient: "from-orange-400 via-amber-500 to-orange-600",
      icon: <SunIcon />,
      label: "Ensolarado"
    };
    if (conditionCode >= 2 && conditionCode <= 48) return {
      gradient: "from-blue-300 via-slate-400 to-gray-400",
      icon: <CloudIcon />,
      label: "Nublado"
    };
    if (conditionCode >= 51) return {
      gradient: "from-blue-700 via-indigo-600 to-blue-900",
      icon: <RainIcon />,
      label: "Chuvoso"
    };

    return { gradient: "from-blue-500 to-cyan-500", icon: <SunIcon />, label: "Dia" };
  };

  const theme = getWeatherTheme();

  // Se não montou ainda (SSR), retorna um placeholder simples para evitar layout shift
  if (!mounted) return <div className="w-full h-[280px] rounded-3xl bg-zinc-100 dark:bg-zinc-800" />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-3xl p-8 text-white shadow-2xl bg-gradient-to-br ${theme.gradient} transition-colors duration-1000`}
    >
      {/* Background Noise/Texture */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none" />
      <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Lado Esquerdo: Informações Imediatas */}
        <div className="space-y-4 max-w-2xl text-center md:text-left w-full">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 text-white/80 text-sm font-medium mb-1 font-mono">
              <Clock size={14} />
              <span>{timeStr}</span>
              <span>•</span>
              <span className="uppercase tracking-widest">{getGreeting()}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight truncate">
              Olá, {userName.split(" ")[0]}
            </h1>
          </div>
          
          {/* Área da Frase com Skeleton Personalizado */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 min-h-[100px] flex flex-col justify-center">
            {loadingData ? (
              <div className="space-y-2 animate-pulse">
                <div className="h-4 bg-white/20 rounded w-3/4 mx-auto md:mx-0" />
                <div className="h-4 bg-white/20 rounded w-1/2 mx-auto md:mx-0" />
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p className="text-lg md:text-xl font-serif italic text-white/90 leading-relaxed">
                  "{data?.quote}"
                </p>
                <div className="mt-2 flex items-center gap-2 text-xs text-white/50 justify-center md:justify-start">
                  <RefreshCw size={12} />
                  <span>Gerado por IA</span>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Lado Direito: Widget de Clima */}
        <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 min-w-[180px] w-full md:w-auto">
          {loadingData ? (
            <div className="flex flex-col items-center gap-2 animate-pulse">
              <div className="w-16 h-16 bg-white/20 rounded-full" />
              <div className="w-12 h-8 bg-white/20 rounded" />
              <div className="w-20 h-4 bg-white/20 rounded" />
            </div>
          ) : (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center"
            >
              <div className="mb-2 drop-shadow-lg scale-110">
                {theme.icon}
              </div>
              <div className="text-4xl font-bold">
                {Math.round(data?.weather.temperature)}°
              </div>
              <div className="text-sm font-medium opacity-80 mt-1 text-center whitespace-nowrap">
                {theme.label}
              </div>
              <div className="flex items-center gap-1 mt-3 text-xs opacity-60">
                <MapPin size={10} />
                <span>Local Atual</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}