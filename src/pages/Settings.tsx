import { User, Bot, Users, Key, Shield, Plus, Trash2 } from "lucide-react";
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
    <div className="space-y-8 animate-slide-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-navy">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your workspace configuration
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-muted p-1 rounded-lg">
          <TabsTrigger value="profile" className="gap-2 data-[state=active]:bg-background">
            <User className="h-4 w-4" />
            Business Profile
          </TabsTrigger>
          <TabsTrigger value="engines" className="gap-2 data-[state=active]:bg-background">
            <Bot className="h-4 w-4" />
            AI Engines
          </TabsTrigger>
          <TabsTrigger value="competitors" className="gap-2 data-[state=active]:bg-background">
            <Users className="h-4 w-4" />
            Competitors
          </TabsTrigger>
          <TabsTrigger value="team" className="gap-2 data-[state=active]:bg-background">
            <Users className="h-4 w-4" />
            Team
          </TabsTrigger>
          <TabsTrigger value="api" className="gap-2 data-[state=active]:bg-background">
            <Key className="h-4 w-4" />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2 data-[state=active]:bg-background">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Business Profile */}
        <TabsContent value="profile">
          <div className="card-reach max-w-2xl">
            <h3 className="text-lg font-semibold text-navy mb-6">Business Profile</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input id="businessName" defaultValue="Acme Corp" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Business Description</Label>
                <textarea
                  id="description"
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  defaultValue="Acme Corp is a leading fintech company providing innovative payment solutions..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input id="industry" defaultValue="Financial Technology" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="founded">Founded Year</Label>
                  <Input id="founded" defaultValue="2020" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" defaultValue="https://acme.com" />
              </div>
              <Button className="bg-electric hover:bg-electric-hover text-primary-foreground">
                Save Changes
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* AI Engines */}
        <TabsContent value="engines">
          <div className="card-reach max-w-2xl">
            <h3 className="text-lg font-semibold text-navy mb-6">AI Engines Configuration</h3>
            <div className="space-y-4">
              {[
                { name: "ChatGPT", description: "OpenAI's conversational AI", enabled: true },
                { name: "Google Gemini", description: "Google's multimodal AI", enabled: true },
                { name: "Perplexity", description: "AI-powered search engine", enabled: true },
                { name: "Claude", description: "Anthropic's AI assistant", enabled: false },
              ].map((engine) => (
                <div
                  key={engine.name}
                  className="flex items-center justify-between p-4 rounded-lg border border-border"
                >
                  <div>
                    <p className="text-sm font-medium text-navy">{engine.name}</p>
                    <p className="text-xs text-muted-foreground">{engine.description}</p>
                  </div>
                  <Switch defaultChecked={engine.enabled} />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Competitors */}
        <TabsContent value="competitors">
          <div className="card-reach max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-navy">Competitor Tracking</h3>
              <Button size="sm" className="gap-1 bg-electric hover:bg-electric-hover text-primary-foreground">
                <Plus className="h-4 w-4" />
                Add Competitor
              </Button>
            </div>
            <div className="space-y-3">
              {competitors.map((competitor, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-lg border border-border"
                >
                  <div>
                    <p className="text-sm font-medium text-navy">{competitor.name}</p>
                    <p className="text-xs text-muted-foreground">{competitor.domain}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch defaultChecked={competitor.tracked} />
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Team */}
        <TabsContent value="team">
          <div className="card-reach max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-navy">Team Members</h3>
              <Button size="sm" className="gap-1 bg-electric hover:bg-electric-hover text-primary-foreground">
                <Plus className="h-4 w-4" />
                Invite Member
              </Button>
            </div>
            <div className="space-y-3">
              {teamMembers.map((member, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-lg border border-border"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-electric text-primary-foreground text-sm font-medium">
                      {member.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-navy">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-muted text-xs font-medium text-muted-foreground">
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* API Keys */}
        <TabsContent value="api">
          <div className="card-reach max-w-2xl">
            <h3 className="text-lg font-semibold text-navy mb-6">API Keys</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-lg border border-border bg-muted/30">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-navy">Production Key</p>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-xs font-medium">Active</span>
                </div>
                <code className="text-xs text-muted-foreground font-mono">
                  tr_live_••••••••••••••••••••••••4f2a
                </code>
              </div>
              <Button variant="outline" className="gap-1">
                <Plus className="h-4 w-4" />
                Generate New Key
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security">
          <div className="card-reach max-w-2xl">
            <h3 className="text-lg font-semibold text-navy mb-6">Security Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div>
                  <p className="text-sm font-medium text-navy">Two-Factor Authentication</p>
                  <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div>
                  <p className="text-sm font-medium text-navy">Session Timeout</p>
                  <p className="text-xs text-muted-foreground">Auto-logout after 30 minutes of inactivity</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div>
                  <p className="text-sm font-medium text-navy">Login Notifications</p>
                  <p className="text-xs text-muted-foreground">Email alerts for new sign-ins</p>
                </div>
                <Switch />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
