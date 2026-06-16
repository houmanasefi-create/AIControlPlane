import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

import {
  Banknote,
  Brain,
  Calculator,
  Cloud,
  GitBranch,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Workflow,
  AlertTriangle,
  CheckCircle2,
  PauseCircle,
  SlidersHorizontal
} from "lucide-react";

import "./style.css";

const money = n =>
  n >= 1000000
    ? `$${(n / 1000000).toFixed(1)}M`
    : `$${Math.round(n / 1000)}k`;

const workflows = [
  ["Contract Review Agent","Legal","Scale",80000,650000],
  ["Customer Email Agent","Support","Scale",120000,780000],
  ["Sales Copilot","Sales","Optimise",150000,320000],
  ["Invoice Agent","Finance","Scale",90000,520000],
  ["HR Assistant","HR","Scale",35000,410000],
  ["Meeting Summary","Operations","Pause",210000,75000],
];

function Card({title,value,sub,icon:Icon}) {
 return (
  <div className="card kpi">
    <div>
      <p>{title}</p>
      <h2>{value}</h2>
      <b>{sub}</b>
    </div>
    <Icon/>
  </div>
 )
}

function Slider({label,value,set,max}) {
 return (
 <label>
 {label}: <b>{value}</b>
 <input
 type="range"
 value={value}
 max={max}
 onChange={e=>set(Number(e.target.value))}
 />
 </label>
 )
}

function App(){

const [tab,setTab]=useState("Dashboard");

const [licenses,setLicenses]=useState(1200);
const [users,setUsers]=useState(700);
const [automation,setAutomation]=useState(40);
const [employees,setEmployees]=useState(300);

const saving=useMemo(()=>{
 const licenseSaving=(licenses-users)*40*12;
 const productivity=employees*automation*80*20;
 return licenseSaving+productivity;
},[licenses,users,automation,employees]);

return (
<div className="layout">

<aside>
<h2>AI Control Plane</h2>

{[
"Dashboard",
"Portfolio",
"Cost Control",
"Simulator",
"Actions"
].map(x=>
<button 
className={tab===x?"active":""}
onClick={()=>setTab(x)}>
{x}
</button>
)}

</aside>

<main>

<h1>{tab}</h1>
<p>
Enterprise AI ROI, adoption and cost steering layer
</p>


{tab==="Dashboard" && <>
<div className="grid">

<Card 
title="AI Value"
value={money(8700000)}
sub="34% growth"
icon={TrendingUp}/>

<Card 
title="AI Spend"
value={money(2100000)}
sub="4.1x ROI"
icon={Banknote}/>

<Card 
title="AI Adoption"
value="72%"
sub="4200 users"
icon={Users}/>

<Card
title="Workflows"
value="186"
sub="42 live"
icon={Workflow}/>

</div>


<div className="card">

<h3>Value Growth</h3>

<ResponsiveContainer height={300}>
<AreaChart data={[
{m:"Jan",v:1},
{m:"Feb",v:2},
{m:"Mar",v:4},
{m:"Apr",v:7},
]}>
<XAxis dataKey="m"/>
<YAxis/>
<Tooltip/>
<Area dataKey="v"/>
</AreaChart>
</ResponsiveContainer>

</div>

</>}


{tab==="Portfolio" &&
<div className="card">

<h3>AI Workflow Portfolio</h3>

<table>
<thead>
<tr>
<th>Name</th>
<th>BU</th>
<th>Status</th>
<th>Cost</th>
<th>Value</th>
<th>Decision</th>
</tr>
</thead>

<tbody>
{workflows.map(w=>
<tr>
<td>{w[0]}</td>
<td>{w[1]}</td>
<td>{w[2]}</td>
<td>{money(w[3])}</td>
<td>{money(w[4])}</td>
<td>
{w[4]>w[3]*3?"Scale":"Review"}
</td>
</tr>
)}
</tbody>
</table>

</div>
}


{tab==="Cost Control" &&

<div className="grid">

<Card
title="Unused Licenses"
value={licenses-users}
sub="remove waste"
icon={AlertTriangle}/>

<Card
title="Duplicate Agents"
value="12"
sub="$450k saving"
icon={GitBranch}/>

<Card
title="Model Routing"
value="$620k"
sub="annual saving"
icon={Cloud}/>

</div>

}



{tab==="Simulator" &&

<div className="card">

<h2>
<Calculator/> Scenario Simulator
</h2>

<Slider
label="Total Licenses"
value={licenses}
set={setLicenses}
max={3000}/>

<Slider
label="Active Users"
value={users}
set={setUsers}
max={3000}/>

<Slider
label="Automation %"
value={automation}
set={setAutomation}
max={100}/>

<Slider
label="Employees"
value={employees}
set={setEmployees}
max={5000}/>

<h1>
Projected Impact:
{money(saving)}
</h1>

</div>

}



{tab==="Actions" &&

<div className="cards">

<div className="card">
<CheckCircle2/>
<h3>Scale</h3>
<p>Expand high ROI workflows</p>
</div>

<div className="card">
<PauseCircle/>
<h3>Pause</h3>
<p>Stop low value AI usage</p>
</div>

<div className="card">
<ShieldCheck/>
<h3>Govern</h3>
<p>Review risky workflows</p>
</div>

</div>

}

</main>
</div>
)

}

createRoot(
document.getElementById("root")
).render(<App/>);
