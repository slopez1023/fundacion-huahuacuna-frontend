/**
 * StatCard - Tarjeta de estadística
 * Componente reutilizable para mostrar métricas del dashboard
 * 
 * @author Fundación Huahuacuna
 * @version 1.0
 */

"use client";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'yellow' | 'green' | 'red';
}

export default function StatCard({ title, value, icon, trend, color = 'blue' }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-blue-200',
    yellow: 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-white shadow-yellow-200',
    green: 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-green-200',
    red: 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-red-200'
  };

  const bgClasses = {
    blue: 'bg-blue-50 border-blue-100',
    yellow: 'bg-yellow-50 border-yellow-100',
    green: 'bg-green-50 border-green-100',
    red: 'bg-red-50 border-red-100'
  };

  return (
    <div className={`${bgClasses[color]} rounded-2xl shadow-sm border p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">{title}</p>
          <p className="text-4xl font-bold text-[#1E3A5F] mb-2">{value}</p>
          
          {trend && (
            <div className="flex items-center gap-1.5 mt-2">
              {trend.isPositive ? (
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                </svg>
              )}
              <span className={`text-sm font-bold ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.value}%
              </span>
              <span className="text-xs text-gray-500">vs. mes anterior</span>
            </div>
          )}
        </div>
        
        <div className={`flex-shrink-0 w-14 h-14 rounded-xl ${colorClasses[color]} flex items-center justify-center shadow-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );
}