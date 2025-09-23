import React from "react";


interface StepperProps {
steps: string[];
current: number; // 1-based
}


export default function Stepper({ steps, current }: StepperProps) {
return (
<ol className="flex items-center w-full gap-2">
{steps.map((label, i) => {
const idx = i + 1;
const done = idx < current;
const active = idx === current;
return (
<li key={label} className="flex items-center flex-1">
<div className={`flex items-center gap-2 ${active ? "text-blue-600" : done ? "text-emerald-600" : "text-slate-400"}`}>
<span className={`w-8 h-8 rounded-full flex items-center justify-center border ${active ? "border-blue-600" : done ? "border-emerald-600" : "border-slate-300"}`}>{idx}</span>
<span className="text-sm font-medium">{label}</span>
</div>
{i < steps.length - 1 && <div className="h-px bg-slate-200 flex-1 mx-2" />}
</li>
);
})}
</ol>
);
}