import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";
import {
  Activity, Banknote, Bot, Brain, Building2, Calculator, Cloud,
  Gauge, GitBranch, LineChart, ShieldCheck, Sparkles, Target,
  TrendingUp, Users, Workflow, AlertTriangle, CheckCircle2, PauseCircle,
  RefreshCw, SlidersHorizontal
} from "lucide-react";
import "./style.css";

const BU = ["Sales", "Finance", "Legal", "HR", "Support", "Product", "Operations", "Risk"];
const money = (n) => n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : `$${Math.round(n / 1000)}k`;
const pct = (n) => `${Math.round(n)}%`;

const workflowsSeed = [
  ["Contract Review Agent", "Legal", "Scale", 80000, 650000, 78, 85, "Medium"],
  ["Customer Email Triage", "Support", "Scale", 120000, 780000, 81, 92, "Low"],
  ["Sales Proposal Assistant", "Sales", "Optimise", 150000, 320000, 55, 71, "Low"],
  ["Invoice Exception Agent", "Finance", "Scale", 90000, 520000, 68, 63, "Medium"],
  ["HR Policy Assistant", "HR", "Scale", 35000, 410000, 89, 76, "Low"],
  ["Meeting Summary Agent", "Operations", "Pause", 210000, 75000, 24, 88, "Low"],
  ["Risk Control Mapping", "Risk", "Monitor", 95000, 180000, 44, 41, "High"],
  ["Product Requirements Copilot", "Product", "Scale", 130000, 540000, 72, 69, "Medium"],
  ["Knowledge Search Agent", "Operations", "Optimise", 170000, 290000, 51, 82, "Medium"],
  ["Recruitment Screening Helper", "HR", "Redesign", 70000, 95000, 38, 29, "High"],
];

const toolSpend = [
  { name: "Relevance AI", value: 420000 },
  { name: "GitHub Copilot", value: 780000 },
  { name: "OpenAI API", value: 360000 },
  { name: "Azure AI", value: 520000 },
  { name: "Claude", value: 210000 },
];

const adoption = BU.map((bu, i) => ({
  bu,
  adoption: [82, 48, 32, 66, 79, 71, 54, 39][i],
  value: [3100000, 760000, 920000, 480000, 1800000, 1200000, 690000, 420000][i],
  maturity: ["Leader","Growing","Opportunity","Growing","Leader","Leader","Growing","Risk"][i],
}));

const monthly = [
  "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"
].map((m, i) => ({
  m,
  spend: 110 + i * 19 + (i % 3) * 20,
  value: 180 + i * 65 + (i % 2) * 30,
  users: 900 + i * 170
}));

function Card({ title, value, sub, icon: Icon, danger }) {
  return <div className="card kpi">
    <div>
      <p className="muted">{title}</p>
      <h2>{value}</h2>
      <span className={danger ? "bad" : "good"}>{sub}</span>
    </div>
    <div className="icon"><Icon size={22}/></div>
  </div>
}

function Recommendation({ type, title, impact, text, icon: Icon }) {
  return <div className="rec">
    <div className={`pill ${type.toLowerCase()}`}>{type}</div>
    <div className="rec-head"><Icon size={20}/><strong>{title}</strong></div>
    <p>{text}</p>
    <b>{impact}</b>
  </div>
}

function Slider({ label, value, min, max, step=1, onChange, suffix="" }) {
  return <label className="slider">
    <div><span>{label}</span><b>{value}{suffix}</b></div>
    <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))}/>
  </label>
}

function App() {
  const [tab, setTab] = useState("Executive");
  const [totalLicenses, setTotalLicenses] = useState(1200);
  const [activeUsers, setActiveUsers] = useState(690);
  const [licenseCost, setLicenseCost] = useState(42);
  const [premiumTasks, setPremiumTasks] = useState(70);
  const [rerouteTasks, setRerouteTasks] = useState(35);
  const [monthlyCalls, setMonthlyCalls] = useState(850000);
  const [premiumCost, setPremiumCost] = useState(0.028);
  const [standardCost, setStandardCost] = useState(0.007);
  const [employees, setEmployees] = useState(160);
  const [hoursSaved, setHoursSaved] = useState(4);
  const [hourlyCost, setHourlyCost] = useState(85);
  const [workflowAdoption, setWorkflowAdoption] = useState(65);
  const [duplicates, setDuplicates] = useState(5);
  const [dupCost, setDupCost] = useState(12000);
  const [consolidation, setConsolidation] = useState(55);
  const [currentAdoption, setCurrentAdoption] = useState(46);
  const [targetAdoption, setTargetAdoption] = useState(68);
  const [eligibleUsers, setEligibleUsers] = useState(4200);
  const [valuePerUser, setValuePerUser] = useState(1900);

  const sim = useMemo(() => {
    const unused = Math.max(0, totalLicenses - activeUsers);
    const licenseWaste = unused * licenseCost * 12;
    const callsMoved = monthlyCalls * (premiumTasks / 100) * (rerouteTasks / 100);
    const modelSaving = callsMoved * (premiumCost - standardCost) * 12;
    const workflowValue = employees * hoursSaved * 52 * hourlyCost * (workflowAdoption / 100);
    const duplicateSaving = duplicates * dupCost * 12 * (consolidation / 100);
    const adoptionGapUsers = eligibleUsers * Math.max(0, targetAdoption - currentAdoption) / 100;
    const adoptionValue = adoptionGapUsers * valuePerUser;
    const totalSaving = licenseWaste + modelSaving + workflowValue + duplicateSaving + adoptionValue;
    return { unused, licenseWaste, modelSaving, workflowValue, duplicateSaving, adoptionGapUsers, adoptionValue, totalSaving };
  }, [totalLicenses, activeUsers, licenseCost, premiumTasks, rerouteTasks, monthlyCalls, premiumCost, standardCost, employees, hoursSaved, hourlyCost, workflowAdoption, duplicates, dupCost, consolidation, currentAdoption, targetAdoption, eligibleUsers, valuePerUser]);

  const workflows = workflowsSeed.map(w => ({
    name: w[0], bu: w[1], status: w[2], cost: w[3], benefit: w[4], roi: w[4]/w[3],
    adoption: w[5], usage: w[6], risk: w[7]
  }));

  const totals = {
    spend: workflows.reduce((a,w)=>a+w.cost,0) + toolSpend.reduce((a,t)=>a+t.value,0),
    benefit: workflows.reduce((a,w)=>a+w.benefit,0) + sim.totalSaving,
    production: workflows.filter(w=>["Scale","Optimise","Monitor"].includes(w.status)).length
  };

  const tabs = ["Executive", "Portfolio", "Cost Control", "Adoption", "Scenario Simulator", "Actions"];

  return <div className="app">
    <aside>
      <div className="brand"><div className="logo">AI</div><div><b>AI Control Plane</b><span>Executive demo</span></div></div>
      {tabs.map(t => <button key={t} className={tab===t ? "active" : ""} onClick={()=>setTab(t)}>{t}</button>)}
      <div className="note">Synthetic data only. No backend. Built for steering decisions, not vendor telemetry.</div>
    </aside>

    <main>
      <header>
        <div>
          <h1>{tab}</h1>
          <p>Control ROI, adoption, cost, governance and workflow scale across an enterprise AI portfolio.</p>
        </div>
        <div className="status"><Sparkles size={16}/> Demo Mode</div>
      </header>

      {tab === "Executive" && <>
        <section className="grid4">
          <Card title="Total AI Value" value={money(totals.benefit)} sub="+34% QoQ" icon={TrendingUp}/>
          <Card title="AI Investment" value={money(totals.spend)} sub={`${(totals.benefit/totals.spend).toFixed(1)}x ROI`} icon={Banknote}/>
          <Card title="Active AI Workforce" value="72%" sub="+8% this month" icon={Users}/>
          <Card title="Workflows Controlled" value="186" sub={`${totals.production} production workflows`} icon={Workflow}/>
        </section>

        <section className="twocol">
          <div className="card chart">
            <h3>Value vs Spend</h3>
            <ResponsiveContainer height={280}>
              <AreaChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="m"/><YAxis/><Tooltip/>
                <Area type="monotone" dataKey="value" name="Value $k" strokeWidth={2} fillOpacity={0.2}/>
                <Area type="monotone" dataKey="spend" name="Spend $k" strokeWidth={2} fillOpacity={0.2}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="card chart">
            <h3>Enterprise AI Maturity</h3>
            <ResponsiveContainer height={280}>
              <RadarChart data={[
                { metric: "ROI", score: 82 }, { metric: "Adoption", score: 72 },
                { metric: "Reuse", score: 61 }, { metric: "Governance", score: 68 },
                { metric: "Cost Control", score: 77 }, { metric: "Scale", score: 58 },
              ]}>
                <PolarGrid/><PolarAngleAxis dataKey="metric"/><PolarRadiusAxis angle={30} domain={[0,100]}/>
                <Radar dataKey="score" fillOpacity={0.25} strokeWidth={2}/>
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </>}

      {tab === "Portfolio" && <section className="card">
        <h3>AI Workflow Portfolio</h3>
        <p className="muted">This is the investment layer: scale, optimise, redesign, monitor or pause.</p>
        <table>
          <thead><tr><th>Workflow</th><th>BU</th><th>Status</th><th>Cost</th><th>Benefit</th><th>ROI</th><th>Adoption</th><th>Risk</th></tr></thead>
          <tbody>{workflows.map(w => <tr key={w.name}>
            <td><b>{w.name}</b></td><td>{w.bu}</td><td><span className={`pill ${w.status.toLowerCase()}`}>{w.status}</span></td>
            <td>{money(w.cost)}</td><td>{money(w.benefit)}</td><td>{w.roi.toFixed(1)}x</td><td>{w.adoption}%</td><td>{w.risk}</td>
          </tr>)}</tbody>
        </table>
      </section>}

      {tab === "Cost Control" && <>
        <section className="grid3">
          <Card title="Unused Licenses" value={sim.unused} sub={`${money(sim.licenseWaste)} annual waste`} icon={AlertTriangle} danger/>
          <Card title="Model Routing Saving" value={money(sim.modelSaving)} sub="annual saving" icon={Brain}/>
          <Card title="Duplicate Workflow Saving" value={money(sim.duplicateSaving)} sub="annual saving" icon={GitBranch}/>
        </section>
        <section className="twocol">
          <div className="card chart"><h3>Spend by AI Tool</h3>
            <ResponsiveContainer height={280}><PieChart><Pie data={toolSpend} dataKey="value" nameKey="name" outerRadius={100} label>
              {toolSpend.map((_, i)=><Cell key={i}/>)}</Pie><Tooltip formatter={(v)=>money(v)}/></PieChart></ResponsiveContainer>
          </div>
          <div className="card">
            <h3>Waste Signals</h3>
            <div className="signal"><AlertTriangle/> 560 inactive licenses detected across AI tools.</div>
            <div className="signal"><RefreshCw/> 5 duplicate workflow patterns found across teams.</div>
            <div className="signal"><Cloud/> 35% of low-risk calls can move to cheaper models.</div>
            <div className="signal"><ShieldCheck/> 3 high-risk workflows require approval gates.</div>
          </div>
        </section>
      </>}

      {tab === "Adoption" && <>
        <section className="card chart">
          <h3>Adoption by Business Unit</h3>
          <ResponsiveContainer height={320}>
            <BarChart data={adoption}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="bu"/><YAxis/><Tooltip/>
              <Bar dataKey="adoption" name="Adoption %"/><Bar dataKey="value" name="Value $" />
            </BarChart>
          </ResponsiveContainer>
        </section>
        <section className="card"><h3>Business Unit Control Table</h3>
          <table><thead><tr><th>BU</th><th>Adoption</th><th>Value</th><th>Maturity</th><th>Steering Action</th></tr></thead>
          <tbody>{adoption.map(a => <tr key={a.bu}><td><b>{a.bu}</b></td><td>{a.adoption}%</td><td>{money(a.value)}</td><td>{a.maturity}</td><td>{a.adoption < 45 ? "Run enablement sprint" : a.value > 1000000 ? "Scale proven workflows" : "Monitor and optimise"}</td></tr>)}</tbody></table>
        </section>
      </>}

      {tab === "Scenario Simulator" && <>
        <section className="grid4">
          <Card title="Projected Annual Impact" value={money(sim.totalSaving)} sub="from current levers" icon={Calculator}/>
          <Card title="License Saving" value={money(sim.licenseWaste)} sub={`${sim.unused} unused licenses`} icon={Users}/>
          <Card title="Workflow Value" value={money(sim.workflowValue)} sub="productivity value" icon={Workflow}/>
          <Card title="Adoption Upside" value={money(sim.adoptionValue)} sub={`${Math.round(sim.adoptionGapUsers)} extra active users`} icon={Target}/>
        </section>

        <section className="simgrid">
          <div className="card">
            <h3><SlidersHorizontal size={18}/> License Optimisation</h3>
            <Slider label="Total licenses" value={totalLicenses} min={100} max={3000} onChange={setTotalLicenses}/>
            <Slider label="Active users" value={activeUsers} min={0} max={3000} onChange={setActiveUsers}/>
            <Slider label="Cost per license / month" value={licenseCost} min={5} max={150} onChange={setLicenseCost} suffix="$"/>
            <div className="output">Annual waste: <b>{money(sim.licenseWaste)}</b></div>
          </div>

          <div className="card">
            <h3><Brain size={18}/> Model Routing</h3>
            <Slider label="Premium model task share" value={premiumTasks} min={0} max={100} onChange={setPremiumTasks} suffix="%"/>
            <Slider label="Tasks moved to cheaper model" value={rerouteTasks} min={0} max={100} onChange={setRerouteTasks} suffix="%"/>
            <Slider label="Monthly AI calls" value={monthlyCalls} min={10000} max={2000000} step={10000} onChange={setMonthlyCalls}/>
            <div className="output">Annual saving: <b>{money(sim.modelSaving)}</b></div>
          </div>

          <div className="card">
            <h3><Workflow size={18}/> Workflow Automation</h3>
            <Slider label="Employees affected" value={employees} min={5} max={1000} onChange={setEmployees}/>
            <Slider label="Hours saved / week" value={hoursSaved} min={1} max={20} onChange={setHoursSaved}/>
            <Slider label="Hourly cost" value={hourlyCost} min={30} max={250} onChange={setHourlyCost} suffix="$"/>
            <Slider label="Adoption rate" value={workflowAdoption} min={0} max={100} onChange={setWorkflowAdoption} suffix="%"/>
            <div className="output">Annual productivity value: <b>{money(sim.workflowValue)}</b></div>
          </div>

          <div className="card">
            <h3><GitBranch size={18}/> Duplicate Workflow Consolidation</h3>
            <Slider label="Similar workflows" value={duplicates} min={1} max={20} onChange={setDuplicates}/>
            <Slider label="Average monthly cost" value={dupCost} min={1000} max={50000} step={1000} onChange={setDupCost} suffix="$"/>
            <Slider label="Consolidation saving" value={consolidation} min={0} max={90} onChange={setConsolidation} suffix="%"/>
            <div className="output">Annual saving: <b>{money(sim.duplicateSaving)}</b></div>
          </div>

          <div className="card wide">
            <h3><Gauge size={18}/> Adoption Uplift</h3>
            <Slider label="Current adoption" value={currentAdoption} min={0} max={100} onChange={setCurrentAdoption} suffix="%"/>
            <Slider label="Target adoption" value={targetAdoption} min={0} max={100} onChange={setTargetAdoption} suffix="%"/>
            <Slider label="Eligible employees" value={eligibleUsers} min={100} max={20000} step={100} onChange={setEligibleUsers}/>
            <Slider label="Annual value per active user" value={valuePerUser} min={100} max={10000} step={100} onChange={setValuePerUser} suffix="$"/>
            <div className="output">Additional annual value: <b>{money(sim.adoptionValue)}</b></div>
          </div>
        </section>
      </>}

      {tab === "Actions" && <section className="recs">
        <Recommendation type="Scale" icon={CheckCircle2} title="Expand Contract Review Agent" impact="+$2.4M projected value" text="Legal workflow shows strong ROI and manageable risk. Scale to adjacent contract-heavy teams."/>
        <Recommendation type="Merge" icon={GitBranch} title="Consolidate duplicate knowledge agents" impact={`${money(sim.duplicateSaving)} annual saving`} text="Multiple teams are funding similar retrieval workflows. Create one enterprise reusable pattern."/>
        <Recommendation type="Optimise" icon={Cloud} title="Route low-risk calls to cheaper models" impact={`${money(sim.modelSaving)} annual saving`} text="Classification, summarisation and extraction tasks do not always need premium model routing."/>
        <Recommendation type="Pause" icon={PauseCircle} title="Pause Meeting Summary Agent" impact="$135k avoidable run-rate" text="High usage, low measured business value. This is vanity adoption, not transformation."/>
        <Recommendation type="Govern" icon={ShieldCheck} title="Add approval gate to high-risk workflows" impact="Risk reduction" text="Payroll, recruitment and risk mapping workflows need human approval and audit history."/>
        <Recommendation type="Train" icon={Users} title="Finance adoption sprint" impact={money(sim.adoptionValue)} text="Finance has high-value use cases but weak adoption. Run targeted enablement and champion model."/>
      </section>}
    </main>
  </div>
}

createRoot(document.getElementById("root")).render(<App />);
