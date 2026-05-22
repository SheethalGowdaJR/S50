import React, { useState, useMemo } from 'react';
import { useCompanies } from '@/hooks/useCompanies';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { UploadCloud, CheckCircle2, AlertCircle, FileText, Target, TrendingUp, BookOpen, Briefcase, ChevronRight } from 'lucide-react';

export default function CareerMatchScore() {
  const { data: companies = [] } = useCompanies();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [resumeParsed, setResumeParsed] = useState(false);

  const targetCompany = useMemo(() => {
    if (!selectedCompanyId && companies.length > 0) return companies[0];
    return companies.find(c => String(c.company_id) === selectedCompanyId) || companies[0];
  }, [companies, selectedCompanyId]);

  const handleUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setResumeParsed(true);
    }, 1500);
  };

  // Mock static data for the dashboard (deterministic per requirements)
  const strengthData = [
    { subject: 'DSA', A: 85, fullMark: 100 },
    { subject: 'Aptitude', A: 70, fullMark: 100 },
    { subject: 'System Design', A: 40, fullMark: 100 },
    { subject: 'React', A: 90, fullMark: 100 },
    { subject: 'Communication', A: 80, fullMark: 100 },
  ];

  const companyReqs = targetCompany?.tech_stack ? (Array.isArray(targetCompany.tech_stack) ? targetCompany.tech_stack.slice(0, 5) : [targetCompany.tech_stack]) : ['JavaScript', 'React', 'Node.js', 'SQL'];
  
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-display font-bold tracking-tight">AI Career Match Score</h1>
        <p className="text-muted-foreground text-lg">Evaluate your placement readiness against specific company requirements.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN - Dashboard & Upload */}
        <div className="space-y-8 lg:col-span-1">
          
          {/* Main Score Card */}
          <Card className="bg-gradient-to-br from-brand/10 via-surface to-surface border-brand/20 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Target className="w-32 h-32" />
            </div>
            <CardHeader>
              <CardTitle>Overall Match Score</CardTitle>
              <CardDescription>Based on your latest profile data</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center pb-8">
              <div className="relative flex items-center justify-center w-40 h-40">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="80" cy="80" r="70" fill="transparent" stroke="currentColor" strokeWidth="10" className="text-muted/20" />
                  <circle cx="80" cy="80" r="70" fill="transparent" stroke="currentColor" strokeWidth="10" strokeDasharray="440" strokeDashoffset={440 - (440 * 78) / 100} className="text-brand transition-all duration-1000 ease-out" />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-4xl font-bold">78<span className="text-xl text-muted-foreground">/100</span></span>
                  <span className="text-sm font-medium text-green-600 flex items-center mt-1"><CheckCircle2 className="w-3 h-3 mr-1"/> Good</span>
                </div>
              </div>

              <div className="w-full space-y-4 mt-8">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">ATS Readiness</span>
                    <span className="font-medium">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Interview Readiness</span>
                    <span className="font-medium">65%</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Placement Probability</span>
                    <span className="font-medium">72%</span>
                  </div>
                  <Progress value={72} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resume Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5"/> Resume Analysis</CardTitle>
              <CardDescription>Upload your latest resume to update your score</CardDescription>
            </CardHeader>
            <CardContent>
              {!resumeParsed ? (
                <div 
                  className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={handleUpload}
                >
                  <UploadCloud className={`w-10 h-10 text-muted-foreground mb-4 ${isUploading ? 'animate-bounce' : ''}`} />
                  <p className="font-medium text-sm">Drag and drop or click to upload</p>
                  <p className="text-xs text-muted-foreground mt-1">PDF, DOCX up to 5MB</p>
                  {isUploading && <p className="text-xs text-brand mt-4 font-medium animate-pulse">Analyzing document...</p>}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-green-500/10 text-green-700 rounded-lg border border-green-200">
                    <CheckCircle2 className="w-5 h-5 mr-3 shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium">Resume parsed successfully</p>
                      <p className="text-xs opacity-80">Profile completeness: 92%</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs px-2 py-1 bg-surface-muted rounded-md border">React</span>
                    <span className="text-xs px-2 py-1 bg-surface-muted rounded-md border">Node.js</span>
                    <span className="text-xs px-2 py-1 bg-surface-muted rounded-md border">TypeScript</span>
                    <span className="text-xs px-2 py-1 bg-surface-muted rounded-md border">MongoDB</span>
                  </div>
                  <Button variant="outline" className="w-full text-xs h-8" onClick={() => setResumeParsed(false)}>Update Resume</Button>
                </div>
              )}
            </CardContent>
          </Card>

        </div>

        {/* RIGHT COLUMN - Analytics & Insights */}
        <div className="space-y-8 lg:col-span-2">
          
          <Tabs defaultValue="company-match" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="company-match">Company Match</TabsTrigger>
              <TabsTrigger value="skills-gap">Skills Gap</TabsTrigger>
              <TabsTrigger value="roadmap">Career Roadmap</TabsTrigger>
            </TabsList>

            {/* COMPANY MATCH TAB */}
            <TabsContent value="company-match" className="space-y-6 mt-6">
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle>Company Compatibility</CardTitle>
                      <CardDescription>Select a target company to analyze your fit</CardDescription>
                    </div>
                    <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId}>
                      <SelectTrigger className="w-full sm:w-[250px]">
                        <SelectValue placeholder="Select target company" />
                      </SelectTrigger>
                      <SelectContent>
                        {companies.slice(0, 20).map(c => (
                          <SelectItem key={String(c.company_id)} value={String(c.company_id)}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="w-full md:w-1/3 flex flex-col items-center justify-center space-y-2">
                      <div className="text-5xl font-display font-bold text-brand">82%</div>
                      <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Match Rate</div>
                    </div>
                    <div className="w-full md:w-2/3 space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2 text-green-600 flex items-center"><CheckCircle2 className="w-4 h-4 mr-1"/> Matching Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {companyReqs.slice(0, 2).map((req, i) => (
                            <span key={i} className="text-xs px-2 py-1 bg-green-500/10 text-green-700 border border-green-200 rounded-md">{String(req)}</span>
                          ))}
                          <span className="text-xs px-2 py-1 bg-green-500/10 text-green-700 border border-green-200 rounded-md">Communication</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-2 text-amber-600 flex items-center"><AlertCircle className="w-4 h-4 mr-1"/> Missing / Suggested Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {companyReqs.slice(2, 4).map((req, i) => (
                            <span key={i} className="text-xs px-2 py-1 bg-amber-500/10 text-amber-700 border border-amber-200 rounded-md">{String(req)}</span>
                          ))}
                          <span className="text-xs px-2 py-1 bg-amber-500/10 text-amber-700 border border-amber-200 rounded-md">System Design</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {targetCompany && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-surface-muted/50">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm text-muted-foreground">Hiring Difficulty</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-2xl font-bold">{targetCompany.hiring_velocity === 'Fast' ? 'High' : 'Moderate'}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-surface-muted/50">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm text-muted-foreground">Interview Process</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-2xl font-bold">{targetCompany.nature_of_company?.includes('Product') ? '4-5 Rounds' : '3 Rounds'}</p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            {/* SKILLS GAP TAB */}
            <TabsContent value="skills-gap" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Strength & Gap Analysis</CardTitle>
                  <CardDescription>Visual breakdown of your current technical competencies</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <div className="w-full h-[300px] max-w-md">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={strengthData}>
                        <PolarGrid stroke="hsl(var(--border))" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar name="Student" dataKey="A" stroke="hsl(var(--brand))" fill="hsl(var(--brand))" fillOpacity={0.3} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><BookOpen className="w-5 h-5"/> AI Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="bg-blue-100 text-blue-700 p-2 rounded-lg mt-0.5"><Briefcase className="w-4 h-4" /></div>
                      <div>
                        <p className="font-semibold text-sm">Build a Microservices Project</p>
                        <p className="text-xs text-muted-foreground mt-1">Companies you target frequently require distributed systems knowledge. Add a project demonstrating this to boost your ATS score.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="bg-purple-100 text-purple-700 p-2 rounded-lg mt-0.5"><BookOpen className="w-4 h-4" /></div>
                      <div>
                        <p className="font-semibold text-sm">Practice Graph Algorithms</p>
                        <p className="text-xs text-muted-foreground mt-1">Your DSA score is strong, but interview trends at Product companies emphasize Graph traversal and DP.</p>
                      </div>
                    </li>
                  </ul>
                  <Button className="w-full mt-6" variant="secondary">Generate Custom Learning Path</Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ROADMAP TAB */}
            <TabsContent value="roadmap" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Career Roadmap</CardTitle>
                  <CardDescription>Suggested milestones to reach your target placement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative border-l border-muted-foreground/20 ml-3 space-y-8 py-4">
                    <div className="relative pl-6">
                      <div className="absolute w-3 h-3 bg-brand rounded-full -left-1.5 top-1.5 ring-4 ring-surface" />
                      <h4 className="font-semibold text-sm">Short-Term (Next 30 Days)</h4>
                      <p className="text-xs text-muted-foreground mt-1">Master basic System Design principles and complete 50 LeetCode Mediums.</p>
                    </div>
                    <div className="relative pl-6">
                      <div className="absolute w-3 h-3 bg-muted-foreground/30 rounded-full -left-1.5 top-1.5 ring-4 ring-surface" />
                      <h4 className="font-semibold text-sm text-muted-foreground">Medium-Term (3 Months)</h4>
                      <p className="text-xs text-muted-foreground mt-1">Build and deploy a full-stack project using React and Node.js. Obtain an AWS Cloud Practitioner certification.</p>
                    </div>
                    <div className="relative pl-6">
                      <div className="absolute w-3 h-3 bg-muted-foreground/30 rounded-full -left-1.5 top-1.5 ring-4 ring-surface" />
                      <h4 className="font-semibold text-sm text-muted-foreground">Long-Term (6 Months)</h4>
                      <p className="text-xs text-muted-foreground mt-1">Begin mock interviews, finalize resume with new projects, and start applying to Target Companies.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

          </Tabs>

        </div>
      </div>
    </div>
  );
}
