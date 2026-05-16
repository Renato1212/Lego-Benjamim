'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Shield, Clock, BarChart3, Settings, Eye, EyeOff } from 'lucide-react';
import { useAppStore } from '@/lib/store/app';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

const USAGE_DATA = [
  { day: 'Seg', minutes: 25 },
  { day: 'Ter', minutes: 40 },
  { day: 'Qua', minutes: 15 },
  { day: 'Qui', minutes: 35 },
  { day: 'Sex', minutes: 55 },
  { day: 'Sáb', minutes: 70 },
  { day: 'Dom', minutes: 45 },
];

const FEATURE_TOGGLES = [
  { id: 'story', label: 'Modo de História com IA', description: 'Gerar histórias para criações', enabled: true, icon: '📖' },
  { id: 'buddy', label: 'Chat Amigo Construtor', description: 'Assistente de chat com IA para crianças', enabled: true, icon: '🤖' },
  { id: 'share', label: 'Compartilhamento na Galeria', description: 'Compartilhar criações publicamente', enabled: false, icon: '🌐' },
  { id: 'ideas', label: 'Gerador de Ideias de Construção', description: 'Sugestões de construção com IA', enabled: true, icon: '💡' },
];

function PinEntry({ onSuccess }: { onSuccess: () => void }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const { authenticateParent } = useAppStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = authenticateParent(pin);
    if (success) {
      onSuccess();
    } else {
      setError(true);
      setPin('');
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border-2 border-white/80 text-center"
      >
        <motion.div
          className="w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center text-4xl shadow-lg"
          style={{ background: 'linear-gradient(135deg, #1A1A2E, #2D2D4E)' }}
          animate={error ? { x: [-6, 6, -6, 6, 0] } : {}}
          transition={{ duration: 0.4 }}
        >
          🔒
        </motion.div>

        <h1 className="text-3xl font-heading mb-2" style={{ color: '#1A1A2E' }}>Área dos Pais</h1>
        <p className="font-body text-gray-500 text-sm mb-6">
          Digite seu PIN de 4 dígitos para acessar o painel dos pais
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              type={showPin ? 'text' : 'password'}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="• • • •"
              maxLength={4}
              className={`text-center text-3xl tracking-[0.6em] h-14 ${error ? 'border-red-400' : ''}`}
            />
            <button
              type="button"
              onClick={() => setShowPin(!showPin)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              tabIndex={-1}
              aria-label={showPin ? 'Ocultar PIN' : 'Mostrar PIN'}
            >
              {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm font-body font-bold"
              style={{ color: '#D01012' }}
            >
              ❌ PIN incorreto. Tente novamente!
            </motion.p>
          )}

          <Button type="submit" className="w-full h-12" size="lg" disabled={pin.length !== 4}>
            <Shield className="w-5 h-5" />
            Entrar na Área dos Pais
          </Button>
        </form>

        <p className="text-xs font-body text-gray-300 mt-4">
          PIN de demonstração: 1234
        </p>
      </motion.div>
    </div>
  );
}

function ParentDashboard() {
  const { user, creations, badges } = useAppStore();
  const [features, setFeatures] = useState(FEATURE_TOGGLES);

  const toggleFeature = (id: string) => {
    setFeatures((prev) =>
      prev.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f))
    );
  };

  const totalMinutes = USAGE_DATA.reduce((sum, d) => sum + d.minutes, 0);
  const maxMinutes = Math.max(...USAGE_DATA.map((d) => d.minutes));
  const earnedBadges = badges.filter((b) => b.isEarned);
  const xpPercent = (user.xp / user.xpToNextLevel) * 100;

  return (
    <div className="min-h-screen px-4 sm:px-6 py-6 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md"
            style={{ background: 'linear-gradient(135deg, #1A1A2E, #2D2D4E)' }}>
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading" style={{ color: '#1A1A2E' }}>Painel dos Pais</h1>
            <p className="font-body text-gray-500 text-sm">Monitorando a aventura LEGO de {user.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4" style={{ color: '#4D924A' }} />
          <span className="text-xs font-body font-bold hidden sm:inline" style={{ color: '#4D924A' }}>Modo Pais Ativo</span>
        </div>
      </motion.div>

      {/* Kid Profile Overview */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl p-5 mb-5 shadow-lg border-2 border-white/80"
      >
        <h2 className="text-lg font-heading mb-4" style={{ color: '#1A1A2E' }}>👤 Perfil da Criança</h2>
        <div className="flex items-center gap-4 flex-wrap">
          <div
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl flex items-center justify-center text-3xl sm:text-4xl shadow-md"
            style={{ background: 'linear-gradient(135deg, #FFCC00, #FF6B00)' }}
          >
            {user.avatar}
          </div>
          <div className="flex-1">
            <h3 className="text-xl sm:text-2xl font-heading" style={{ color: '#1A1A2E' }}>{user.name}</h3>
            <p className="font-body text-gray-500">Nível {user.level} — {user.levelName}</p>

            <div className="mt-2 max-w-xs">
              <div className="flex justify-between text-xs font-body text-gray-400 mb-1">
                <span>Progresso de XP</span>
                <span>{user.xp.toLocaleString()} / {user.xpToNextLevel.toLocaleString()}</span>
              </div>
              <Progress value={xpPercent} color="#FFCC00" className="h-2" />
            </div>

            <div className="flex gap-4 mt-3 flex-wrap">
              <div className="text-sm font-body">
                <span className="font-bold" style={{ color: '#7B2D8B' }}>{creations.length}</span>
                <span className="text-gray-400 ml-1">criações</span>
              </div>
              <div className="text-sm font-body">
                <span className="font-bold" style={{ color: '#4D924A' }}>{earnedBadges.length}</span>
                <span className="text-gray-400 ml-1">conquistas</span>
              </div>
              <div className="text-sm font-body">
                <span className="font-bold" style={{ color: '#FF6B00' }}>{user.xp.toLocaleString()}</span>
                <span className="text-gray-400 ml-1">XP total</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Esta Semana', value: `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`, icon: '⏰', color: '#006DB7' },
          { label: 'Média/Dia', value: `${Math.floor(totalMinutes / 7)}m`, icon: '📊', color: '#4D924A' },
          { label: 'Criações', value: String(creations.length), icon: '🏗️', color: '#7B2D8B' },
          { label: 'Conquistas', value: String(earnedBadges.length), icon: '🏆', color: '#FF6B00' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.08 }}
            className="bg-white rounded-2xl p-3 sm:p-4 shadow-md border-2 border-white text-center"
            style={{ borderColor: `${stat.color}20` }}
          >
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-lg sm:text-xl font-heading" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-xs font-body text-gray-400 font-semibold">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Usage Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-3xl p-5 mb-5 shadow-lg border-2 border-white/80"
      >
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="w-5 h-5" style={{ color: '#006DB7' }} />
          <h2 className="text-lg font-heading" style={{ color: '#1A1A2E' }}>Tempo de Tela Semanal</h2>
          <span className="ml-auto text-sm font-body text-gray-400">{totalMinutes} min total</span>
        </div>
        <div className="flex items-end justify-between gap-1 sm:gap-2 h-32">
          {USAGE_DATA.map((day, i) => (
            <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
              <motion.div
                className="w-full rounded-t-lg min-h-[4px]"
                style={{ backgroundColor: day.minutes > 60 ? '#FF6B00' : '#006DB7' }}
                initial={{ height: 0 }}
                animate={{ height: `${(day.minutes / maxMinutes) * 100}%` }}
                transition={{ delay: 0.4 + i * 0.05, duration: 0.6, ease: 'easeOut' }}
              />
              <div className="text-center">
                <span className="text-xs font-body text-gray-400 block">{day.day}</span>
                <span className="text-xs font-bold font-body" style={{ color: '#1A1A2E' }}>{day.minutes}m</span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs font-body text-gray-400 mt-3">
          🟠 = Mais de 60 min por dia
        </p>
      </motion.div>

      {/* Recent Creations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-3xl p-5 mb-5 shadow-lg border-2 border-white/80"
      >
        <h2 className="text-lg font-heading mb-4" style={{ color: '#1A1A2E' }}>🏗️ Criações Recentes</h2>
        <div className="space-y-3">
          {creations.map((creation, i) => (
            <motion.div
              key={creation.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.08 }}
              className="flex items-center gap-3 p-3 rounded-2xl"
              style={{ background: '#FFF8E7' }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: '#EED6FF' }}>
                {['🚀', '🏰', '🌈'][i % 3]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-heading text-sm truncate" style={{ color: '#1A1A2E' }}>{creation.name}</p>
                <p className="font-body text-xs text-gray-400">
                  {creation.bricksUsed} peças · {new Date(creation.createdAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <span className="text-xs font-body font-bold flex-shrink-0" style={{ color: '#D01012' }}>
                ❤️ {creation.likes}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Feature Toggles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-3xl p-5 shadow-lg border-2 border-white/80"
      >
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-5 h-5" style={{ color: '#1A1A2E' }} />
          <h2 className="text-lg font-heading" style={{ color: '#1A1A2E' }}>Configurações</h2>
        </div>
        <div className="space-y-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.08 }}
              className="flex items-center justify-between p-4 rounded-2xl"
              style={{ background: '#F8F8F8' }}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{feature.icon}</span>
                <div>
                  <p className="font-body font-bold text-sm" style={{ color: '#1A1A2E' }}>{feature.label}</p>
                  <p className="text-xs font-body text-gray-400">{feature.description}</p>
                </div>
              </div>
              <motion.button
                onClick={() => toggleFeature(feature.id)}
                className="w-12 h-6 rounded-full relative transition-colors flex-shrink-0"
                style={{ backgroundColor: feature.enabled ? '#4D924A' : '#D0D0D0' }}
                whileTap={{ scale: 0.9 }}
                aria-label={`${feature.enabled ? 'Desativar' : 'Ativar'} ${feature.label}`}
              >
                <motion.div
                  className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                  animate={{ left: feature.enabled ? '28px' : '4px' }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </motion.button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default function ParentsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <PinEntry onSuccess={() => setIsAuthenticated(true)} />;
  }

  return <ParentDashboard />;
}
