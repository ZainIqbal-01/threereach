import { useState } from "react";
import { User, Bot, Users, Key, Shield, Plus, Trash2, Save, Copy, Eye, EyeOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StarAgent } from "@/components/StarAgent";
import { toast } from "@/hooks/use-toast";

interface TeamMember { name: string; email: string; role: string; avatar: string; }
interface Competitor { name: string; domain: string; tracked: boolean; }

export default function Settings() {
  const [profile, setProfile] = useState({
    businessName: "Three Reach",
    description: "Three Reach is a leading fintech company providing innovative payment solutions...",
    industry: "Financial Technology",
    founded: "2020",
    website: "https://threereach.com",
  });

  const [engines, setEngines] = useState([
    { name: "ChatGPT", description: "OpenAI's conversational AI", enabled: true },
    { name: "Google Gemini", description: "Google's multimodal AI", enabled: true },
    { name: "Perplexity", description: "AI-powered search engine", enabled: true },
    { name: "Claude", description: "Anthropic's AI assistant", enabled: false },
  ]);

  const [team, setTeam] = useState<TeamMember[]>([
    { name: "John Doe", email: "john@threereach.com", role: "Admin", avatar: "JD" },
    { name: "Sarah Smith", email: "sarah@threereach.com", role: "Editor", avatar: "SS" },
    { name: "Mike Johnson", email: "mike@threereach.com", role: "Viewer", avatar: "MJ" },
  ]);

  const [competitors, setCompetitors] = useState<Competitor[]>([
    { name: "CompetitorA Inc.", domain: "competitora.com", tracked: true },
    { name: "RivalTech", domain: "rivaltech.io", tracked: true },
    { name: "MarketLeader Co.", domain: "marketleader.com", tracked: false },
  ]);

  const [security, setSecurity] = useState({ twoFactor: true, sessionTimeout: true, loginNotifs: false });
  const [showApiKey, setShowApiKey] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [showAddCompetitor, setShowAddCompetitor] = useState(false);
  const [newCompetitor, setNewCompetitor] = useState({ name: "", domain: "" });

  const saveProfile = () => {
    localStorage.setItem("businessProfile", JSON.stringify(profile));
    toast({ title: "✅ Profile saved!", description: "Business profile has been updated" });
  };

  const toggleEngine = (index: number) => {
    setEngines(prev => prev.map((e, i) => i === index ? { ...e, enabled: !e.enabled } : e));
    toast({ title: engines[index].enabled ? "Engine disabled" : "Engine enabled", description: `${engines[index].name} has been ${engines[index].enabled ? "disabled" : "enabled"}` });
  };

  const inviteMember = () => {
    if (!inviteEmail.trim() || !inviteEmail.includes("@")) {
      toast({ title: "Invalid email", variant: "destructive" });
      return;
    }
    const initials = inviteEmail.split("@")[0].slice(0, 2).toUpperCase();
    setTeam(prev => [...prev, { name: inviteEmail.split("@")[0], email: inviteEmail, role: "Viewer", avatar: initials }]);
    setInviteEmail("");
    setShowInvite(false);
    toast({ title: "📧 Invitation sent!", description: `Invite sent to ${inviteEmail}` });
  };

  const removeMember = (index: number) => {
    const member = team[index];
    if (member.role === "Admin") {
      toast({ title: "Cannot remove admin", variant: "destructive" });
      return;
    }
    setTeam(prev => prev.filter((_, i) => i !== index));
    toast({ title: "Member removed", description: `${member.name} has been removed` });
  };

  const addCompetitor = () => {
    if (!newCompetitor.name.trim() || !newCompetitor.domain.trim()) {
      toast({ title: "Fill all fields", variant: "destructive" });
      return;
    }
    setCompetitors(prev => [...prev, { ...newCompetitor, tracked: true }]);
    setNewCompetitor({ name: "", domain: "" });
    setShowAddCompetitor(false);
    toast({ title: "✅ Competitor added!", description: `Now tracking ${newCompetitor.name}` });
  };

  const removeCompetitor = (index: number) => {
    const comp = competitors[index];
    setCompetitors(prev => prev.filter((_, i) => i !== index));
    toast({ title: "Competitor removed", description: `${comp.name} removed from tracking` });
  };

  const generateApiKey = () => {
    const key = `tr_live_${crypto.randomUUID().replace(/-/g, "").slice(0, 32)}`;
    navigator.clipboard.writeText(key);
    toast({ title: "🔑 New API key generated!", description: "Key has been copied to clipboard" });
  };

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex items-center gap-4">
        <StarAgent mood="thinking" size={48} animate={true} />
        <div>
          <h1 className="text-xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your workspace configuration</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-5">
        <TabsList className="bg-secondary p-1 rounded-xl flex-wrap h-auto gap-1">
          <TabsTrigger value="profile" className="gap-1.5 data-[state=active]:bg-card rounded-lg text-xs"><User className="h-3.5 w-3.5" /><span className="hidden sm:inline">Profile</span></TabsTrigger>
          <TabsTrigger value="engines" className="gap-1.5 data-[state=active]:bg-card rounded-lg text-xs"><Bot className="h-3.5 w-3.5" /><span className="hidden sm:inline">Engines</span></TabsTrigger>
          <TabsTrigger value="competitors" className="gap-1.5 data-[state=active]:bg-card rounded-lg text-xs"><Users className="h-3.5 w-3.5" /><span className="hidden sm:inline">Competitors</span></TabsTrigger>
          <TabsTrigger value="team" className="gap-1.5 data-[state=active]:bg-card rounded-lg text-xs"><Users className="h-3.5 w-3.5" /><span className="hidden sm:inline">Team</span></TabsTrigger>
          <TabsTrigger value="api" className="gap-1.5 data-[state=active]:bg-card rounded-lg text-xs"><Key className="h-3.5 w-3.5" /><span className="hidden sm:inline">API</span></TabsTrigger>
          <TabsTrigger value="security" className="gap-1.5 data-[state=active]:bg-card rounded-lg text-xs"><Shield className="h-3.5 w-3.5" /><span className="hidden sm:inline">Security</span></TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="card-reach max-w-2xl">
            <h3 className="text-sm font-semibold text-foreground mb-5">Business Profile</h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Business Name</Label>
                <Input value={profile.businessName} onChange={e => setProfile(p => ({ ...p, businessName: e.target.value }))} className="h-10 rounded-xl text-xs" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Business Description</Label>
                <textarea
                  value={profile.description}
                  onChange={e => setProfile(p => ({ ...p, description: e.target.value }))}
                  className="flex min-h-[100px] w-full rounded-xl border border-input bg-background px-3 py-2 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">Industry</Label>
                  <Input value={profile.industry} onChange={e => setProfile(p => ({ ...p, industry: e.target.value }))} className="h-10 rounded-xl text-xs" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Founded Year</Label>
                  <Input value={profile.founded} onChange={e => setProfile(p => ({ ...p, founded: e.target.value }))} className="h-10 rounded-xl text-xs" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Website</Label>
                <Input value={profile.website} onChange={e => setProfile(p => ({ ...p, website: e.target.value }))} className="h-10 rounded-xl text-xs" />
              </div>
              <Button onClick={saveProfile} className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-10 text-xs gap-1">
                <Save className="h-3.5 w-3.5" /> Save Changes
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="engines">
          <div className="card-reach max-w-2xl">
            <h3 className="text-sm font-semibold text-foreground mb-5">AI Engines Configuration</h3>
            <div className="space-y-3">
              {engines.map((engine, i) => (
                <div key={engine.name} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${engine.enabled ? "border-primary/20 bg-primary/5" : "border-border/60"}`}>
                  <div>
                    <p className="text-xs font-medium text-foreground">{engine.name}</p>
                    <p className="text-[10px] text-muted-foreground">{engine.description}</p>
                  </div>
                  <Switch checked={engine.enabled} onCheckedChange={() => toggleEngine(i)} />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="competitors">
          <div className="card-reach max-w-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold text-foreground">Competitor Tracking</h3>
              <Button size="sm" onClick={() => setShowAddCompetitor(true)} className="gap-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-8 text-xs">
                <Plus className="h-3.5 w-3.5" /> Add Competitor
              </Button>
            </div>
            {showAddCompetitor && (
              <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 mb-4 animate-fade-in">
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <Input placeholder="Company name" value={newCompetitor.name} onChange={e => setNewCompetitor(p => ({ ...p, name: e.target.value }))} className="h-9 rounded-xl text-xs" />
                  <Input placeholder="domain.com" value={newCompetitor.domain} onChange={e => setNewCompetitor(p => ({ ...p, domain: e.target.value }))} className="h-9 rounded-xl text-xs" />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={addCompetitor} className="h-8 rounded-xl text-xs">Add</Button>
                  <Button variant="outline" size="sm" onClick={() => setShowAddCompetitor(false)} className="h-8 rounded-xl text-xs">Cancel</Button>
                </div>
              </div>
            )}
            <div className="space-y-3">
              {competitors.map((comp, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-border/60 hover:border-primary/20 transition-all">
                  <div>
                    <p className="text-xs font-medium text-foreground">{comp.name}</p>
                    <p className="text-[10px] text-muted-foreground">{comp.domain}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch checked={comp.tracked} onCheckedChange={() => {
                      setCompetitors(prev => prev.map((c, j) => j === i ? { ...c, tracked: !c.tracked } : c));
                      toast({ title: comp.tracked ? "Tracking paused" : "Tracking resumed" });
                    }} />
                    <Button variant="ghost" size="icon" onClick={() => removeCompetitor(i)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="team">
          <div className="card-reach max-w-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold text-foreground">Team Members</h3>
              <Button size="sm" onClick={() => setShowInvite(true)} className="gap-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-8 text-xs">
                <Plus className="h-3.5 w-3.5" /> Invite Member
              </Button>
            </div>
            {showInvite && (
              <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 mb-4 animate-fade-in">
                <div className="flex gap-3">
                  <Input placeholder="email@company.com" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && inviteMember()} className="h-9 rounded-xl text-xs flex-1" autoFocus />
                  <Button size="sm" onClick={inviteMember} className="h-9 rounded-xl text-xs">Send Invite</Button>
                  <Button variant="outline" size="sm" onClick={() => setShowInvite(false)} className="h-9 rounded-xl text-xs">Cancel</Button>
                </div>
              </div>
            )}
            <div className="space-y-3">
              {team.map((member, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-border/60 hover:border-primary/20 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground text-xs font-medium">
                      {member.avatar}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground">{member.name}</p>
                      <p className="text-[10px] text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-secondary text-[10px] font-medium text-muted-foreground">{member.role}</span>
                    {member.role !== "Admin" && (
                      <Button variant="ghost" size="icon" onClick={() => removeMember(i)} className="h-7 w-7 text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="api">
          <div className="card-reach max-w-2xl">
            <h3 className="text-sm font-semibold text-foreground mb-5">API Keys</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-border/60 bg-secondary/30">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-foreground">Production Key</p>
                  <span className="px-2 py-0.5 rounded-full bg-success-light text-success text-[10px] font-medium border border-success/20">Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="text-xs text-muted-foreground font-mono flex-1">
                    {showApiKey ? "tr_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4" : "tr_live_••••••••••••••••••••••••4f2a"}
                  </code>
                  <Button variant="ghost" size="icon" onClick={() => setShowApiKey(!showApiKey)} className="h-7 w-7">
                    {showApiKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => {
                    navigator.clipboard.writeText("tr_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4");
                    toast({ title: "Copied!", description: "API key copied to clipboard" });
                  }} className="h-7 w-7">
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <Button variant="outline" onClick={generateApiKey} className="gap-1 rounded-xl text-xs">
                <Plus className="h-3.5 w-3.5" /> Generate New Key
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <div className="card-reach max-w-2xl">
            <h3 className="text-sm font-semibold text-foreground mb-5">Security Settings</h3>
            <div className="space-y-3">
              {[
                { key: "twoFactor" as const, label: "Two-Factor Authentication", desc: "Add an extra layer of security" },
                { key: "sessionTimeout" as const, label: "Session Timeout", desc: "Auto-logout after 30 minutes of inactivity" },
                { key: "loginNotifs" as const, label: "Login Notifications", desc: "Email alerts for new sign-ins" },
              ].map(item => (
                <div key={item.key} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${security[item.key] ? "border-primary/20 bg-primary/5" : "border-border/60"}`}>
                  <div>
                    <p className="text-xs font-medium text-foreground">{item.label}</p>
                    <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch checked={security[item.key]} onCheckedChange={() => {
                    setSecurity(prev => ({ ...prev, [item.key]: !prev[item.key] }));
                    toast({ title: `${item.label} ${security[item.key] ? "disabled" : "enabled"}` });
                  }} />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}