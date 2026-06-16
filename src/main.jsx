import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import {
  Banknote, Brain, Calculator, CheckCircle2, Cloud, Code2, Cpu,
  Gauge, GitBranch, Layers, PauseCircle, RefreshCw, Route,
  ShieldCheck, Sparkles, Target, TrendingDown, TrendingUp,
  Users, Workflow
} from "lucide-react";
import "./style.css";

const money = n => n >= 1000000 ? `$${(n / 1000000).toFixed(1)}M` : `$${Math.round(n / 1000)}k`;
const num = n => new Intl.NumberFormat("en-AU").format(Math.round(n));

const providers = {
  AWS: { T4: 0.55, L4: 0.82, A10: 1.45, A100: 3.4, H100: 5.9 },
  Azure: { T4: 0.58, L4: 0.88, A10: 1.52, A100: 3.65, H100: 6.2 },
  Google: { T4: 0.5, L4: 0.78, A10: 1.38, A100: 3.2, H100: 5.6 },
  Nvidia: { T4: 0.62, L4: 0.9, A10: 1.6, A100: 3.8, H100: 6.5 }
};

const gpuPerf = { T4: 1, L4: 1.6, A10: 2.2, A100: 4.5, H100: 7.5 };

const platformFees = {
  "Relevance AI": 18000,
  "GitHub Copilot": 26000,
  "Direct API": 12000
};

const seed = [
  ["Contract Review Agent","Legal","Relevance AI","Azure","A100",850,8,650000,"Medium"],
  ["Customer Email Triage","Support","Relevance AI","AWS","A10",4200,4,780000,"Low"],
  ["Sales Proposal Assistant","Sales","Relevance AI","Azure","A100",1400,6,320000,"Low"],
  ["Invoice Exception Agent","Finance","Relevance AI","Google","A10",1600,5,520000,"Medium"],
  ["HR Policy Assistant","HR","Relevance AI","AWS","L4",2300,2,410000,"Low"],
  ["Procurement Summary Agent","Operations","Relevance AI","Azure","L4",1100,3,230000,"Low"],
  ["Risk Control Mapping","Risk","Relevance AI","Azure","H100",580,10,180000,"High"],
  ["Customer Complaint Classifier","Support","Relevance AI","Google","L4",5200,2,460000,"Medium"],
  ["Revenue Leakage Detector","Finance","Direct API","AWS","A100",760,12,710000,"Medium"],
  ["Vendor Onboarding Assistant","Procurement","Relevance AI","Azure","A10",900,5,260000,"Medium"],
  ["Compliance Evidence Collector","Risk","Relevance AI","Nvidia","A100",480,8,340000,"High"],
  ["Marketing Campaign Brief Agent","Marketing","Relevance AI","Google","L4",1700,3,190000,"Low"],
  ["Executive Report Drafting","Operations","Relevance AI","Azure","A100",700,7,290000,"Medium"],
  ["Internal Knowledge Search","All","Relevance AI","AWS","A10",6800,2,840000,"Medium"],
  ["Renewal Risk Agent","Sales","Relevance AI","Google","A100",620,9,610000,"Medium"],

  ["Code Generation Copilot","Engineering","GitHub Copilot","Azure","A100",9200,2,1450000,"Medium"],
  ["Test Case Generator","Engineering","GitHub Copilot","AWS","A10",6100,2,980000,"Low"],
  ["Pull Request Review Assistant","Engineering","GitHub Copilot","Azure","A100",3300,3,720000,"Medium"],
  ["Bug Triage Assistant","Product","GitHub Copilot","Google","L4",2100,3,360000,"Low"],
  ["Developer Documentation Agent","Product","GitHub Copilot","AWS","L4",2400,2,310000,"Low"],
  ["Incident Analysis Assistant","Platform","Direct API","Nvidia","H100",500,14,530000,"High"],
  ["Data Pipeline Copilot","Data","GitHub Copilot","Azure","A100",1800,6,670000,"Medium"],
  ["Security Code Review","Security","GitHub Copilot","Nvidia","H100",650,12,590000,"High"],
  ["API Migration Assistant","Engineering","GitHub Copilot","Google","A10",1500,5,810000,"Medium"],
  ["Developer Onboarding Agent","R&D","GitHub Copilot","AWS","L4",900,3,250000,"Low"]
];

function cost(w, provider = w.provider, gpu = w.gpu) {
  const gpuCost = w.runs * w.hours * providers[provider][gpu];
  const platform = platformFees[w.channel];
  const support = gpuCost * 0.18;
  return gpuCost + platform + support;
}

function enrich(row, i) {
  const w = {
    id: i + 1,
    name: row[0],
    bu: row[1],
    channel: row[2],
    provider: row[3],
    gpu: row[4],
    runs: row[5],
    hours: row[6],
    value: row[7],
    risk: row[8]
  };
  w.monthlyCost = cost(w);
  w.annualCost = w.monthlyCost * 12;
  w.roi = w.value / w.annualCost;
  return w;
}

function cheapest(w) {
  let best = null;

  Object.keys(providers).forEach(provider => {
    Object.keys(providers[provider]).forEach(gpu => {
      const safe =
        w.risk === "High" ? ["A100","H100"].includes(gpu)
        : w.risk === "Medium" ? ["L4","A10","A100","H100"].includes(gpu)
        : true;

      if (!safe) return;

      const c = cost(w, provider, gpu);
      if (!best || c < best.monthlyCost) {
        best = { provider, gpu, monthlyCost: c, annualCost: c * 12 };
      }
    });
  });

  return best;
}

function action(w) {
  const b = cheapest(w);
  const saving = w.annualCost - b.annualCost;

  if (w.roi < 1) return "Pause";
  if (w.risk === "High") return "Govern";
  if (saving > 100000) return "Move";
  if (["A100","H100"].includes(w.gpu) && w.risk === "Low") return "Downgrade";
  if (w.roi > 3) return "Scale";
  return "Optimise";
}

function Card({ title, value, sub, icon: Icon, danger }) {
  return (
    <div className="card kpi">
      <div>
        <p>{title}</p>
        <h2>{value}</h2>
        <b className={danger ? "danger" : ""}>{sub}</b>
      </div>
      <div className="icon"><Icon size={24}/></div>
    </div>
  );
}

function App() {
  const [tab, setTab] = useState("Dashboard");
  const [selectedId, setSelectedId] = useState(1);
  const [targetProvider, setTargetProvider] = useState("Google");
  const [targetGpu, setTargetGpu] = useState("L4");
  const [licenseCut, setLicenseCut] = useState(18);
  const [adoptionUplift, setAdoptionUplift] = useState(14);
  const [duplicateCut, setDuplicateCut] = useState(35);

  const workflows = useMemo(() => seed.map(enrich), []);
  const selected = workflows.find(w => w.id === Number(selectedId)) || workflows[0];

  const route = useMemo(() => {
    const newMonthly = cost(selected, targetProvider, targetGpu);
    const annualSaving = selected.annualCost - newMonthly * 12;
    const perf = ((gpuPerf[targetGpu] / gpuPerf[selected.gpu]) - 1) * 100;
    const risk =
      selected.risk === "High" && !["A100","H100"].includes(targetGpu)
      ? "High"
      : perf < -40 ? "Medium" : "Low";

    return { newMonthly, annualSaving, perf, risk };
  }, [selected, targetProvider, targetGpu]);

  const totals = useMemo(() => {
    const spend = workflows.reduce((a,w) => a + w.annualCost, 0);
    const value = workflows.reduce((a,w) => a + w.value, 0);
    const saving = workflows.reduce((a,w) => {
      const b = cheapest(w);
      return a + Math.max(0, w.annualCost - b.annualCost);
    }, 0);

    const relevance = workflows.filter(w => w.channel === "Relevance AI").reduce((a,w) => a + w.annualCost, 0);
    const copilot = workflows.filter(w => w.channel === "GitHub Copilot").reduce((a,w) => a + w.annualCost, 0);
    const direct = workflows.filter(w => w.channel === "Direct API").reduce((a,w) => a + w.annualCost, 0);

    const sim =
      saving +
      spend * (licenseCut / 100) * 0.22 +
      value * (adoptionUplift / 100) * 0.18 +
      spend * (duplicateCut / 100) * 0.12;

    return { spend, value, saving, relevance, copilot, direct, sim };
  }, [workflows, licenseCut, adoptionUplift, duplicateCut]);

  const providerSpend = Object.keys(providers).map(p => ({
    name: p,
    spend: workflows.filter(w => w.provider === p).reduce((a,w) => a + w.annualCost, 0)
  }));

  const channelSpend = [
    { name: "Relevance AI", value: totals.relevance },
    { name: "GitHub Copilot", value: totals.copilot },
    { name: "Direct API", value: totals.direct }
  ];

  const buData = [...new Set(workflows.map(w => w.bu))].map(bu => ({
    bu,
    value: workflows.filter(w => w.bu === bu).reduce((a,w) => a + w.value, 0),
    spend: workflows.filter(w => w.bu === bu).reduce((a,w) => a + w.annualCost, 0)
  })).sort((a,b) => b.value - a.value).slice(0, 10);

  const tabs = ["Dashboard", "Portfolio", "Channels", "Cloud Routing", "Simulator", "Actions"];

  return (
    <div className="layout">
      <aside>
        <div className="brand">
          <div className="brandmark">AI</div>
          <div>
            <h2>AI Control Plane</h2>
            <p>Enterprise command layer</p>
          </div>
        </div>

        {tabs.map(t => (
          <button key={t} className={tab === t ? "active" : ""} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}

        <div className="side-note">
          Synthetic demo data. No database. Executive steering layer across AI workflows, cloud and GPU cost.
        </div>
      </aside>

      <main>
        <header>
          <div>
            <h1>{tab}</h1>
            <p>Control ROI, adoption, cloud routing, GPU cost, AI channels and workflow decisions.</p>
          </div>
          <div className="demo-pill"><Sparkles size={16}/> Demo Mode</div>
        </header>

        {tab === "Dashboard" && (
          <>
            <section className="grid4">
              <Card title="Annual AI Value" value={money(totals.value)} sub="synthetic portfolio value" icon={TrendingUp}/>
              <Card title="Annual AI Spend" value={money(totals.spend)} sub={`${(totals.value / totals.spend).toFixed(1)}x ROI`} icon={Banknote}/>
              <Card title="Steerable Saving" value={money(totals.saving)} sub="cloud/GPU routing upside" icon={Route}/>
              <Card title="Controlled Workflows" value={workflows.length} sub="business + engineering" icon={Workflow}/>
            </section>

            <section className="twocol">
              <div className="card chart">
                <h3><Layers size={18}/> Value vs Spend by BU</h3>
                <ResponsiveContainer height={310}>
                  <BarChart data={buData}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="bu"/>
                    <YAxis tickFormatter={v => `$${v/1000000}M`}/>
                    <Tooltip formatter={v => money(v)}/>
                    <Bar dataKey="value" name="Annual Value" fill="#2563eb" />
                    <Bar dataKey="spend" name="Annual Spend" fill="#16a34a" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="card chart">
                <h3><Cloud size={18}/> Cloud Provider Spend</h3>
                <ResponsiveContainer height={310}>
                  <BarChart data={providerSpend}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="name"/>
                    <YAxis tickFormatter={v => `$${v/1000000}M`}/>
                    <Tooltip formatter={v => money(v)}/>
                    <Bar dataKey="spend" name="Annual Spend" fill="#7c3aed" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="card">
              <h3><Target size={18}/> Executive Summary</h3>
              <div className="summary-grid">
                <div><b>{money(totals.relevance)}</b><span>Business AI via Relevance AI</span></div>
                <div><b>{money(totals.copilot)}</b><span>Engineering AI via GitHub Copilot</span></div>
                <div><b>{money(totals.direct)}</b><span>Direct API specialist workflows</span></div>
                <div><b>{money(totals.sim)}</b><span>Total simulated improvement opportunity</span></div>
              </div>
            </section>
          </>
        )}

        {tab === "Portfolio" && (
          <section className="card">
            <h3><Workflow size={18}/> 25 Workflow AI Operating Ledger</h3>
            <p className="muted">Value, channel, provider, GPU, cost, ROI, risk and recommended action.</p>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Workflow</th>
                    <th>BU</th>
                    <th>Channel</th>
                    <th>Provider</th>
                    <th>GPU</th>
                    <th>Runs</th>
                    <th>Annual Cost</th>
                    <th>Annual Value</th>
                    <th>ROI</th>
                    <th>Risk</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {workflows.map(w => (
                    <tr key={w.id}>
                      <td><b>{w.name}</b></td>
                      <td>{w.bu}</td>
                      <td><span className={`tag ${w.channel.includes("GitHub") ? "engineering" : w.channel.includes("Relevance") ? "business" : "direct"}`}>{w.channel}</span></td>
                      <td>{w.provider}</td>
                      <td>{w.gpu}</td>
                      <td>{num(w.runs)}/mo</td>
                      <td>{money(w.annualCost)}</td>
                      <td>{money(w.value)}</td>
                      <td>{w.roi.toFixed(1)}x</td>
                      <td>{w.risk}</td>
                      <td><span className={`pill ${action(w).toLowerCase()}`}>{action(w)}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {tab === "Channels" && (
          <>
            <section className="grid3">
              <Card title="Business AI" value={money(totals.relevance)} sub="Relevance AI workflows" icon={Brain}/>
              <Card title="Engineering AI" value={money(totals.copilot)} sub="GitHub Copilot workflows" icon={Code2}/>
              <Card title="Specialist AI" value={money(totals.direct)} sub="Direct API workflows" icon={Cpu}/>
            </section>

            <section className="twocol">
              <div className="card chart">
                <h3><GitBranch size={18}/> Channel Spend Split</h3>
                <ResponsiveContainer height={310}>
                  <PieChart>
                    <Pie data={channelSpend} dataKey="value" nameKey="name" outerRadius={105} label>
                      {channelSpend.map((_, i) => <Cell key={i}/>)}
                    </Pie>
                    <Tooltip formatter={v => money(v)}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="card">
                <h3><ShieldCheck size={18}/> Channel Control Logic</h3>
                <div className="channel-card business"><b>Relevance AI</b><p>Business functions. Control adoption, duplication, approvals, data sensitivity and workflow reuse.</p></div>
                <div className="channel-card engineering"><b>GitHub Copilot</b><p>Product, R&D and engineering. Control license utilisation, developer productivity, code quality and security.</p></div>
                <div className="channel-card direct"><b>Direct API</b><p>Specialist workloads. Control model routing, GPU cost, provider choice, latency and risk.</p></div>
              </div>
            </section>
          </>
        )}

        {tab === "Cloud Routing" && (
          <>
            <section className="grid4">
              <Card title="Current Monthly Cost" value={money(selected.monthlyCost)} sub={`${selected.provider} ${selected.gpu}`} icon={Cloud}/>
              <Card title="New Monthly Cost" value={money(route.newMonthly)} sub={`${targetProvider} ${targetGpu}`} icon={RefreshCw}/>
              <Card title="Annual Saving" value={money(route.annualSaving)} sub={route.annualSaving >= 0 ? "positive move" : "cost increase"} icon={TrendingDown} danger={route.annualSaving < 0}/>
              <Card title="Performance Impact" value={`${route.perf.toFixed(0)}%`} sub={`${route.risk} routing risk`} icon={Gauge}/>
            </section>

            <section className="twocol">
              <div className="card">
                <h3><Route size={18}/> Workflow Cloud / GPU Routing Simulator</h3>

                <label className="field">
                  <span>Select workflow</span>
                  <select value={selectedId} onChange={e => setSelectedId(e.target.value)}>
                    {workflows.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                  </select>
                </label>

                <div className="current-box">
                  <span>Current route</span>
                  <b>{selected.provider} / {selected.gpu}</b>
                  <small>{selected.channel} · {selected.bu} · {selected.risk} risk</small>
                </div>

                <label className="field">
                  <span>Target provider</span>
                  <select value={targetProvider} onChange={e => setTargetProvider(e.target.value)}>
                    {Object.keys(providers).map(p => <option key={p}>{p}</option>)}
                  </select>
                </label>

                <label className="field">
                  <span>Target GPU</span>
                  <select value={targetGpu} onChange={e => setTargetGpu(e.target.value)}>
                    {Object.keys(providers[targetProvider]).map(g => <option key={g}>{g}</option>)}
                  </select>
                </label>

                <div className="decision">
                  <b>Recommendation:</b>{" "}
                  {route.annualSaving > 100000 && route.risk !== "High"
                    ? "Move workflow to target route."
                    : route.annualSaving > 0
                    ? "Pilot route change first."
                    : "Do not move. Keep current route."}
                </div>
              </div>

              <div className="card">
                <h3><Cpu size={18}/> Synthetic GPU Price Table / Hour</h3>
                <table>
                  <thead>
                    <tr><th>Provider</th><th>T4</th><th>L4</th><th>A10</th><th>A100</th><th>H100</th></tr>
                  </thead>
                  <tbody>
                    {Object.keys(providers).map(p => (
                      <tr key={p}>
                        <td><b>{p}</b></td>
                        {Object.keys(providers[p]).map(g => <td key={g}>${providers[p][g].toFixed(2)}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="muted pad-top">Formula: workflow cost = GPU hours × provider GPU price + platform fee + support load.</p>
              </div>
            </section>
          </>
        )}

        {tab === "Simulator" && (
          <>
            <section className="grid4">
              <Card title="Best Route Savings" value={money(totals.saving)} sub="safe cloud/GPU routing" icon={Route}/>
              <Card title="License Optimisation" value={money(totals.spend * (licenseCut/100) * 0.22)} sub={`${licenseCut}% unused cut`} icon={Users}/>
              <Card title="Adoption Uplift" value={money(totals.value * (adoptionUplift/100) * 0.18)} sub={`${adoptionUplift}% uplift`} icon={Target}/>
              <Card title="Total Impact" value={money(totals.sim)} sub="combined scenario" icon={Calculator}/>
            </section>

            <section className="card">
              <h3>Enterprise Steering Simulator</h3>

              <label className="slider"><div><span>License optimisation target</span><b>{licenseCut}%</b></div><input type="range" min="0" max="50" value={licenseCut} onChange={e => setLicenseCut(Number(e.target.value))}/></label>
              <label className="slider"><div><span>Adoption uplift target</span><b>{adoptionUplift}%</b></div><input type="range" min="0" max="40" value={adoptionUplift} onChange={e => setAdoptionUplift(Number(e.target.value))}/></label>
              <label className="slider"><div><span>Duplicate workflow reduction</span><b>{duplicateCut}%</b></div><input type="range" min="0" max="80" value={duplicateCut} onChange={e => setDuplicateCut(Number(e.target.value))}/></label>

              <div className="big-result">
                <span>Projected annual improvement</span>
                <b>{money(totals.sim)}</b>
                <p>Combines cloud/GPU routing, license cleanup, adoption uplift and duplicate workflow consolidation.</p>
              </div>
            </section>
          </>
        )}

        {tab === "Actions" && (
          <section className="action-grid">
            {workflows.map(w => {
              const b = cheapest(w);
              const saving = w.annualCost - b.annualCost;
              return { ...w, best: b, saving, act: action(w) };
            }).sort((a,b) => b.saving - a.saving).slice(0,12).map(w => (
              <div className="card action" key={w.id}>
                <span className={`pill ${w.act.toLowerCase()}`}>{w.act}</span>
                <h3>{w.name}</h3>
                <p>{w.bu} · {w.channel}</p>
                <div className="route-line">
                  <span>{w.provider} {w.gpu}</span>
                  <b>→</b>
                  <span>{w.best.provider} {w.best.gpu}</span>
                </div>
                <strong>{money(Math.max(0, w.saving))} annual upside</strong>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
