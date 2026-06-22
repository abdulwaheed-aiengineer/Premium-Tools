import { Check, Clock, XCircle } from 'lucide-react';
import { ORDER_STATUS_STEPS, ORDER_STATUS_MAP } from '../utils/helpers';

export default function OrderStatusTimeline({ status }) {
  const isTerminal = ['rejected', 'cancelled', 'refunded'].includes(status);
  const currentStep = ORDER_STATUS_MAP[status]?.step ?? 0;

  if (isTerminal) {
    const info = ORDER_STATUS_MAP[status];
    return (
      <div
        className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium ${info.color}`}
        data-icod-id="src_components_orderstatustimeline_jsx_bc8f">
        <XCircle size={18} />Order {info.label}
      </div>
    );
  }

  return (
    <div
      className="w-full"
      data-icod-id="src_components_orderstatustimeline_jsx_e0c5">
      <div
        className="flex items-center justify-between relative"
        data-icod-id="src_components_orderstatustimeline_jsx_a052">
        {/* Progress line */}
        <div
          className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 z-0"
          data-icod-id="src_components_orderstatustimeline_jsx_2c8a" />
        <div
          className="absolute top-4 left-0 h-0.5 bg-indigo-500 z-0 transition-all duration-500"
          style={{ width: `${(currentStep / (ORDER_STATUS_STEPS.length - 1)) * 100}%` }}
          data-icod-id="src_components_orderstatustimeline_jsx_2b5f" />

        {ORDER_STATUS_STEPS.map((stepStatus, index) => {
          const info = ORDER_STATUS_MAP[stepStatus];
          const done = index < currentStep;
          const active = index === currentStep;

          return (
            <div
              key={stepStatus}
              className="flex flex-col items-center z-10 flex-1"
              data-icod-id={`src_components_orderstatustimeline_jsx_9630_${stepStatus}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  done
                    ? 'bg-indigo-500 text-white'
                    : active
                    ? 'bg-indigo-600 text-white ring-4 ring-indigo-100'
                    : 'bg-white border-2 border-gray-200 text-gray-400'
                }`}
                data-icod-id={`src_components_orderstatustimeline_jsx_7824_${stepStatus}`}>
                {done ? <Check size={14} /> : active ? <Clock size={14} /> : index + 1}
              </div>
              <p
                className={`text-xs mt-2 text-center leading-tight max-w-[72px] ${active ? 'text-indigo-600 font-semibold' : done ? 'text-gray-600' : 'text-gray-400'}`}
                data-icod-id={`src_components_orderstatustimeline_jsx_1f4c_${stepStatus}`}>
                {info?.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
