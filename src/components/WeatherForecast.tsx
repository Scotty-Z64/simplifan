import { useState } from 'react';
import { Cloud, Sun, CloudRain, Wind, Droplets, CloudLightning, Umbrella, Eye, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface WeatherDay {
  day: string;
  date: string;
  high: number;
  low: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'partly-cloudy';
  humidity: number;
  wind: number;
  rainChance: number;
  advice: string;
}

const mockForecast: WeatherDay[] = [
  { day: 'Today', date: '22 Apr', high: 26, low: 14, condition: 'sunny', humidity: 45, wind: 12, rainChance: 0, advice: 'Perfect weather for outdoor events!' },
  { day: 'Tomorrow', date: '23 Apr', high: 24, low: 15, condition: 'partly-cloudy', humidity: 50, wind: 15, rainChance: 10, advice: 'Great conditions, minimal cloud cover.' },
  { day: 'Thursday', date: '24 Apr', high: 22, low: 13, condition: 'cloudy', humidity: 60, wind: 18, rainChance: 30, advice: 'Consider a tent or indoor backup for outdoor events.' },
  { day: 'Friday', date: '25 Apr', high: 20, low: 12, condition: 'rainy', humidity: 80, wind: 22, rainChance: 75, advice: 'Rain expected. Have covered areas ready or postpone outdoor activities.' },
  { day: 'Saturday', date: '26 Apr', high: 25, low: 14, condition: 'partly-cloudy', humidity: 55, wind: 10, rainChance: 15, advice: 'Good recovery day after rain. Ground may be damp.' },
  { day: 'Sunday', date: '27 Apr', high: 27, low: 16, condition: 'sunny', humidity: 40, wind: 8, rainChance: 5, advice: 'Excellent weekend weather for any event!' },
  { day: 'Monday', date: '28 Apr', high: 28, low: 17, condition: 'sunny', humidity: 35, wind: 10, rainChance: 0, advice: 'Warm day - ensure shade and hydration stations.' },
];

const conditionIcons: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  sunny: { icon: <Sun className="w-8 h-8" />, color: 'text-amber-400', label: 'Sunny' },
  'partly-cloudy': { icon: <Cloud className="w-8 h-8" />, color: 'text-gray-300', label: 'Partly Cloudy' },
  cloudy: { icon: <Cloud className="w-8 h-8" />, color: 'text-gray-400', label: 'Cloudy' },
  rainy: { icon: <CloudRain className="w-8 h-8" />, color: 'text-blue-400', label: 'Rainy' },
  stormy: { icon: <CloudLightning className="w-8 h-8" />, color: 'text-purple-400', label: 'Thunderstorms' },
};

const saCities = [
  'Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Port Elizabeth',
  'Bloemfontein', 'Nelspruit', 'Polokwane', 'Kimberley', 'Rustenburg',
  'East London', 'Pietermaritzburg', 'Soweto', 'Tembisa', 'Umlazi',
  'Katlehong', 'Midrand', 'Sandton', 'Randburg', 'Roodepoort',
  'Germiston', 'Benoni', 'Kempton Park', 'Vereeniging', 'Vanderbijlpark',
  'Soshanguve', 'Mabopane', 'Mamelodi', 'Atteridgeville', 'Alexandra',
  'Gugulethu', 'Khayelitsha', 'Langa', 'Mitchells Plain', 'Athlone',
  'Stellenbosch', 'Paarl', 'Bellville', 'Parow', 'Goodwood',
  'Kraaifontein', 'Brackenfell', 'Durbanville', 'Fish Hoek', 'Simonstown',
  'Umhlanga', 'Ballito', 'Amanzimtoti', 'Pinetown', 'Hillcrest',
  'Kloof', 'Westville', 'Bluff', 'Berea', 'Morningside',
  'Boksburg', 'Brakpan', 'Springs', ' Nigel', 'Heidelberg',
];

export function WeatherForecast() {
  const [city, setCity] = useState('Johannesburg');
  const [cityInput, setCityInput] = useState('');
  const [showCities, setShowCities] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);

  const filteredCities = saCities.filter(c =>
    c.toLowerCase().includes(cityInput.toLowerCase())
  );

  const selectCity = (c: string) => {
    setCity(c);
    setCityInput('');
    setShowCities(false);
  };

  const today = mockForecast[selectedDay];
  const cond = conditionIcons[today.condition];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass rounded-2xl p-6 border border-gray-700/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">
            <Cloud className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Event Weather Forecast</h3>
            <p className="text-sm text-gray-400">Plan around the weather for outdoor events</p>
          </div>
        </div>

        {/* City Selector */}
        <div className="relative">
          <Input
            value={showCities ? cityInput : city}
            onChange={(e) => { setCityInput(e.target.value); setShowCities(true); }}
            onFocus={() => setShowCities(true)}
            placeholder="Search city..."
            className="bg-gray-800/50 border-gray-700 text-white"
          />
          {showCities && cityInput && (
            <div className="absolute z-20 w-full mt-1 max-h-48 overflow-y-auto glass rounded-xl border border-gray-700/50">
              {filteredCities.map(c => (
                <button key={c} onClick={() => selectCity(c)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 first:rounded-t-xl last:rounded-b-xl">
                  {c}
                </button>
              ))}
              {filteredCities.length === 0 && (
                <p className="px-4 py-2 text-sm text-gray-500">No cities found</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Current Day Detail */}
      <div className="glass rounded-2xl p-6 border border-gray-700/50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-400">{today.day}, {today.date}</p>
            <p className="text-lg font-semibold text-white">{city}</p>
          </div>
          <div className={`${cond.color}`}>{cond.icon}</div>
        </div>

        <div className="flex items-end gap-2 mb-4">
          <span className="text-5xl font-bold text-white">{today.high}°</span>
          <span className="text-xl text-gray-400 mb-1">/ {today.low}°C</span>
        </div>

        <p className={`text-sm font-medium ${cond.color} mb-4`}>{cond.label}</p>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-3 bg-gray-800/50 rounded-xl">
            <Droplets className="w-5 h-5 text-blue-400 mx-auto mb-1" />
            <p className="text-sm font-semibold text-white">{today.humidity}%</p>
            <p className="text-[10px] text-gray-500">Humidity</p>
          </div>
          <div className="text-center p-3 bg-gray-800/50 rounded-xl">
            <Wind className="w-5 h-5 text-teal-400 mx-auto mb-1" />
            <p className="text-sm font-semibold text-white">{today.wind} km/h</p>
            <p className="text-[10px] text-gray-500">Wind</p>
          </div>
          <div className="text-center p-3 bg-gray-800/50 rounded-xl">
            <Umbrella className="w-5 h-5 text-purple-400 mx-auto mb-1" />
            <p className="text-sm font-semibold text-white">{today.rainChance}%</p>
            <p className="text-[10px] text-gray-500">Rain</p>
          </div>
        </div>

        {/* Event Advice */}
        <div className={`p-3 rounded-xl flex items-start gap-2 ${
          today.rainChance > 50 ? 'bg-red-500/10 border border-red-500/20' :
          today.rainChance > 20 ? 'bg-amber-500/10 border border-amber-500/20' :
          'bg-emerald-500/10 border border-emerald-500/20'
        }`}>
          {today.rainChance > 50 ? <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" /> :
           today.rainChance > 20 ? <Eye className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" /> :
           <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />}
          <p className={`text-sm ${
            today.rainChance > 50 ? 'text-red-300' :
            today.rainChance > 20 ? 'text-amber-300' :
            'text-emerald-300'
          }`}>{today.advice}</p>
        </div>
      </div>

      {/* 7-Day Forecast */}
      <div>
        <h4 className="text-sm font-semibold text-white mb-3">7-Day Forecast</h4>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {mockForecast.map((day, i) => {
            const c = conditionIcons[day.condition];
            return (
              <button
                key={i}
                onClick={() => setSelectedDay(i)}
                className={`flex-shrink-0 glass rounded-xl p-3 border transition-all w-24 ${
                  selectedDay === i
                    ? 'border-teal-500/50 bg-teal-500/10'
                    : 'border-gray-700/50 hover:border-gray-600'
                }`}>
                <p className="text-[10px] text-gray-500">{day.day}</p>
                <p className="text-xs font-semibold text-white">{day.date}</p>
                <div className={`${c.color} my-2`}>
                  {day.condition === 'sunny' ? <Sun className="w-6 h-6 mx-auto" /> :
                   day.condition === 'rainy' ? <CloudRain className="w-6 h-6 mx-auto" /> :
                   day.condition === 'stormy' ? <CloudLightning className="w-6 h-6 mx-auto" /> :
                   <Cloud className="w-6 h-6 mx-auto" />}
                </div>
                <p className="text-sm font-bold text-white">{day.high}°</p>
                <p className="text-xs text-gray-500">{day.low}°</p>
                {day.rainChance > 0 && (
                  <p className="text-[10px] text-blue-400 mt-1">{day.rainChance}% rain</p>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Check({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
