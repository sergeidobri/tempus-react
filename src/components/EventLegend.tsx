import { EVENT_COLORS } from '../utils/calendar';

export function EventLegend() {
  const categories = [
    { key: 'social' as const, label: 'Личное', color: EVENT_COLORS.social },
    { key: 'work' as const, label: 'Работа', color: EVENT_COLORS.work },
    { key: 'personal' as const, label: 'Другое', color: EVENT_COLORS.personal },
  ];

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-[#FFE3C7]">
      <h4 className="text-sm text-[#4A403A] mb-3">Категории</h4>
      <div className="space-y-2">
        {categories.map((category) => (
          <div key={category.key} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: category.color }}
            />
            <span className="text-sm text-[#4A403A]">{category.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
