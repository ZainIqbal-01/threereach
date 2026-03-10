import { User, Bot, Users, Key, Shield, Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const teamMembers = [
  { name: "John Doe", email: "john@acme.com", role: "Admin", avatar: "JD" },
  { name: "Sarah Smith", email: "sarah@acme.com", role: "Editor", avatar: "SS" },
  { name: "Mike Johnson", email: "mike@acme.com", role: "Viewer", avatar: "MJ" },
];

const competitors = [
  { name: "CompetitorA Inc.", domain: "competitora.com", tracked: true },
  { name: "RivalTech", domain: "rivaltech.io", tracked: true },
  { name: "MarketLeader Co.", domain: "marketleader.com", tracked: false },
];

export default function Settings() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-black text-foreground">⚙️ Settings</h1>
        <p className="text-muted-foreground mt-1 font-semibold">Manage your workspace</p>
      </motion.div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-muted p-1 rounded-2xl border-2 border-border">
          <TabsTrigger value="profile" className="gap-2 data-[state=active]:bg-card rounded-xl font-bold">👤 Profile</TabsTrigger>
          <TabsTrigger value="engines" className="gap-2 data-[state=active]:bg-card rounded-xl font-bold">🤖 Engines</TabsTrigger>
          <TabsTrigger value="competitors" className="gap-2 data-[state=active]:bg-card rounded-xl font-bold">🏁 Competitors</TabsTrigger>
          <TabsTrigger value="team" className="gap-2 data-[state=active]:bg-card rounded-xl font-bold">👥 Team</TabsTrigger>
          <TabsTrigger value="api" className="gap-2 data-[state=active]:bg-card rounded-xl font-bold">🔑 API</TabsTrigger>
          <TabsTrigger value="security" className="gap-2 data-[state=active]:bg-card rounded-xl font-bold">🛡️ Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-reach max-w-2xl">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">👤</span>
              <h3 className="text-lg font-black text-foreground">Business Profile</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessName" className="font-bold">Business Name</Label>
                <Input id="businessName" defaultValue="Acme Corp" className="rounded-xl border-2 font-semibold" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="font-bold">Description</Label>
                <textarea id="description" className="flex min-h-[120px] w-full rounded-xl border-2 border-input bg-background px-3 py-2 text-sm font-semibold ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" defaultValue="Acme Corp is a leading fintech company..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="industry" className="font-bold">Industry</Label>
                  <Input id="industry" defaultValue="Financial Technology" className="rounded-xl border-2 font-semibold" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="founded" className="font-bold">Founded</Label>
                  <Input id="founded" defaultValue="2020" className="rounded-xl border-2 font-semibold" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="website" className="font-bold">Website</Label>
                <Input id="website" defaultValue="https://acme.com" className="rounded-xl border-2 font-semibold" />
              </div>
              <Button className="bg-electric hover:bg-electric-hover text-primary-foreground rounded-2xl font-bold btn-fun">Save Changes ✅</Button>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="engines">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-reach max-w-2xl">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">🤖</span>
              <h3 className="text-lg font-black text-foreground">AI Engines</h3>
            </div>
            <div className="space-y-3">
              {[
                { name: "🤖 ChatGPT", desc: "OpenAI's conversational AI", on: true },
                { name: "✨ Gemini", desc: "Google's multimodal AI", on: true },
                { name: "🔍 Perplexity", desc: "AI-powered search engine", on: true },
                { name: "🧠 Claude", desc: "Anthropic's AI assistant", on: false },
              ].map((engine) => (
                <div key={engine.name} className="flex items-center justify-between p-4 rounded-2xl border-2 border-border hover:border-electric/30 transition-colors">
                  <div>
                    <p className="text-sm font-bold text-foreground">{engine.name}</p>
                    <p className="text-xs text-muted-foreground font-semibold">{engine.desc}</p>
                  </div>
                  <Switch defaultChecked={engine.on} />
                </div>
              ))}
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="competitors">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-reach max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏁</span>
                <h3 className="text-lg font-black text-foreground">Competitors</h3>
              </div>
              <Button size="sm" className="gap-1 bg-electric hover:bg-electric-hover text-primary-foreground rounded-xl font-bold">
                <Plus className="h-4 w-4" /> Add
              </Button>
            </div>
            <div className="space-y-3">
              {competitors.map((c, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl border-2 border-border">
                  <div>
                    <p className="text-sm font-bold text-foreground">{c.name}</p>
                    <p className="text-xs text-muted-foreground font-semibold">{c.domain}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch defaultChecked={c.tracked} />
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-danger rounded-xl">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="team">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-reach max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="text-2xl">👥</span>
                <h3 className="text-lg font-black text-foreground">Team</h3>
              </div>
              <Button size="sm" className="gap-1 bg-electric hover:bg-electric-hover text-primary-foreground rounded-xl font-bold">
                <Plus className="h-4 w-4" /> Invite
              </Button>
            </div>
            <div className="space-y-3">
              {teamMembers.map((m, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl border-2 border-border">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-electric text-primary-foreground text-sm font-black">{m.avatar}</div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{m.name}</p>
                      <p className="text-xs text-muted-foreground font-semibold">{m.email}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1.5 rounded-full bg-muted text-xs font-bold text-muted-foreground border-2 border-border">{m.role}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="api">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-reach max-w-2xl">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">🔑</span>
              <h3 className="text-lg font-black text-foreground">API Keys</h3>
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl border-2 border-border bg-muted/30">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-bold text-foreground">Production Key</p>
                  <span className="px-3 py-1 rounded-full bg-success-light text-success text-xs font-bold border-2 border-success/20">Active ✅</span>
                </div>
                <code className="text-xs text-muted-foreground font-mono">tr_live_••••••••••••••••••••4f2a</code>
              </div>
              <Button variant="outline" className="gap-1 rounded-xl border-2 font-bold"><Plus className="h-4 w-4" /> Generate New Key</Button>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="security">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-reach max-w-2xl">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">🛡️</span>
              <h3 className="text-lg font-black text-foreground">Security</h3>
            </div>
            <div className="space-y-3">
              {[
                { name: "Two-Factor Auth", desc: "Extra security layer", on: true },
                { name: "Session Timeout", desc: "Auto-logout after 30min", on: true },
                { name: "Login Notifications", desc: "Email alerts for sign-ins", on: false },
              ].map((s) => (
                <div key={s.name} className="flex items-center justify-between p-4 rounded-2xl border-2 border-border">
                  <div>
                    <p className="text-sm font-bold text-foreground">{s.name}</p>
                    <p className="text-xs text-muted-foreground font-semibold">{s.desc}</p>
                  </div>
                  <Switch defaultChecked={s.on} />
                </div>
              ))}
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
