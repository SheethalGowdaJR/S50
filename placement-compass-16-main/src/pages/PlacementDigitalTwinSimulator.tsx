import React, { useState, useMemo } from 'react';
import { useCompanies } from '@/hooks/useCompanies';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, CheckCircle2, TrendingUp, AlertTriangle, GraduationCap, Briefcase, Award, Code, Brain } from 'lucide-react';

export default function PlacementDigitalTwinSimulator() {
  const { data: companies = [] } = useCompanies();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');

  const targetCompany = useMemo(() => {
    if (!selectedCompanyId && companies.length > 0) return companies[0];
    return companies.find(c => String(c.company_id) === selectedCompanyId) || companies[0];
  }, [companies, selectedCompanyId]);

  const [baseProfile, setBaseProfile] = useState({
    score10th: 85,
    score12th: 85,
    cgpa: 8.5,
    dsaScore: 70,
    aptitudeScore: 75,
    projects: 2,
    internships: 1,
    certifications: [] as string[]
  });

  const [simulatedProfile, setSimulatedProfile] = useState(baseProfile);

  const handleBaseChange = (field: keyof typeof baseProfile, value: string) => {
    const numValue = Number(value) || 0;
    setBaseProfile(prev => {
      const next = { ...prev, [field]: numValue };
      // Ensure simulation is at least as good as base profile
      setSimulatedProfile(s => {
        const simVal = s[field as keyof typeof s];
        if (typeof simVal === 'number' && typeof numValue === 'number') {
           return { ...s, [field]: numValue > simVal ? numValue : simVal };
        }
        return s;
      });
      return next;
    });
  };

  // Engine Formula Weights
  // 10th = 5%, 12th = 5%, CGPA = 20%, DSA = 30%, Aptitude = 20%, Projects = 10%, Internships = 5%, Certs = 5%
  const calculateProbability = (data: typeof baseProfile) => {
    const s10Weight = (Math.min(data.score10th, 100) / 100) * 5;
    const s12Weight = (Math.min(data.score12th, 100) / 100) * 5;
    const cgpaWeight = (Math.min(data.cgpa, 10) / 10) * 20;
    const dsaWeight = (Math.min(data.dsaScore, 100) / 100) * 30;
    const aptWeight = (Math.min(data.aptitudeScore, 100) / 100) * 20;
    const projWeight = (Math.min(data.projects, 5) / 5) * 10;
    const intWeight = (Math.min(data.internships, 2) / 2) * 5;
    const certWeight = (Math.min(data.certifications.length, 2) / 2) * 5;

    return Math.round(s10Weight + s12Weight + cgpaWeight + dsaWeight + aptWeight + projWeight + intWeight + certWeight);
  };

  const initialProbability = useMemo(() => calculateProbability(baseProfile), [baseProfile]);
  const currentProbability = useMemo(() => calculateProbability(simulatedProfile), [simulatedProfile]);
  const improvement = currentProbability - initialProbability;

  // Recommendations Engine
  const recommendations = useMemo(() => {
    const recs = [];
    if (simulatedProfile.dsaScore < 80) {
      recs.push("Recommend improving DSA. Focus on solving medium/hard problems.");
    }
    if (simulatedProfile.certifications.length === 0) {
      recs.push(`Recommend an industry-recognized Certification to match company requirements.`);
    }
    if (simulatedProfile.projects < 3) {
      recs.push("Recommend building more projects to strengthen your portfolio.");
    }
    if (simulatedProfile.internships === 0) {
      recs.push("Recommend internship experience to gain practical industry exposure.");
    }
    return recs;
  }, [simulatedProfile, targetCompany]);

  const addCertification = () => {
    if (!simulatedProfile.certifications.includes("AWS Certification")) {
      setSimulatedProfile(prev => ({ ...prev, certifications: [...prev.certifications, "AWS Certification"] }));
    }
  };

  const addInternship = () => setSimulatedProfile(prev => ({ ...prev, internships: prev.internships + 1 }));
  const addProject = () => setSimulatedProfile(prev => ({ ...prev, projects: prev.projects + 1 }));

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Placement Digital Twin Simulator</h1>
        <p className="text-muted-foreground mt-2">Input your current academic and skill metrics to simulate your career growth and placement probability.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Column: Profile and Controls */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><GraduationCap className="w-5 h-5" /> Current Student Profile</CardTitle>
              <CardDescription>Enter your existing metrics to build your digital twin</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label>10th Score (%)</Label>
                  <Input type="number" value={baseProfile.score10th || ''} onChange={e => handleBaseChange('score10th', e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>12th Score (%)</Label>
                  <Input type="number" value={baseProfile.score12th || ''} onChange={e => handleBaseChange('score12th', e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>CGPA (out of 10)</Label>
                  <Input type="number" step="0.1" value={baseProfile.cgpa || ''} onChange={e => handleBaseChange('cgpa', e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>DSA Score (%)</Label>
                  <Input type="number" value={baseProfile.dsaScore || ''} onChange={e => handleBaseChange('dsaScore', e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Aptitude Score (%)</Label>
                  <Input type="number" value={baseProfile.aptitudeScore || ''} onChange={e => handleBaseChange('aptitudeScore', e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Projects Count</Label>
                  <Input type="number" value={baseProfile.projects || ''} onChange={e => handleBaseChange('projects', e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Internships Count</Label>
                  <Input type="number" value={baseProfile.internships || ''} onChange={e => handleBaseChange('internships', e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5" /> Scenario Controls</CardTitle>
              <CardDescription>Adjust variables to simulate your placement probability</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium flex items-center gap-2"><Code className="w-4 h-4" /> Increase DSA Score</label>
                    <span className="text-sm font-bold text-primary">{simulatedProfile.dsaScore}%</span>
                  </div>
                  <Slider 
                    value={[simulatedProfile.dsaScore]} 
                    min={baseProfile.dsaScore} 
                    max={100} 
                    step={1} 
                    onValueChange={(val) => setSimulatedProfile(prev => ({ ...prev, dsaScore: val[0] }))}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium flex items-center gap-2"><Brain className="w-4 h-4" /> Increase Aptitude Score</label>
                    <span className="text-sm font-bold text-primary">{simulatedProfile.aptitudeScore}%</span>
                  </div>
                  <Slider 
                    value={[simulatedProfile.aptitudeScore]} 
                    min={baseProfile.aptitudeScore} 
                    max={100} 
                    step={1} 
                    onValueChange={(val) => setSimulatedProfile(prev => ({ ...prev, aptitudeScore: val[0] }))}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-4 border-t">
                <Button variant="outline" onClick={addCertification} disabled={simulatedProfile.certifications.includes("AWS Certification")}>
                  <Award className="w-4 h-4 mr-2" /> Add Certification
                </Button>
                <Button variant="outline" onClick={addInternship}>
                  <Briefcase className="w-4 h-4 mr-2" /> Add Internship ({simulatedProfile.internships})
                </Button>
                <Button variant="outline" onClick={addProject}>
                  <Code className="w-4 h-4 mr-2" /> Add Project ({simulatedProfile.projects})
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Results & Recommendations */}
        <div className="space-y-6">
          <Card className="border-primary/50 shadow-lg bg-gradient-to-br from-card to-primary/5">
            <CardHeader>
              <CardTitle>Simulation Results</CardTitle>
              <CardDescription>
                Target Company: 
                <div className="mt-2">
                  <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a company" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.slice(0, 50).map(c => (
                        <SelectItem key={String(c.company_id)} value={String(c.company_id)}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Current Probability</span>
                  <span className="font-medium">{initialProbability}%</span>
                </div>
                <Progress value={initialProbability} className="h-2 opacity-50" />
              </div>

              <div className="flex justify-center py-2">
                <ArrowRight className="w-6 h-6 text-muted-foreground" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-medium">New Probability</span>
                  <div className="text-right">
                    <span className="text-3xl font-bold text-primary">{currentProbability}%</span>
                    {improvement > 0 && (
                      <Badge variant="secondary" className="ml-2 bg-green-500/10 text-green-600 hover:bg-green-500/20">
                        +{improvement}%
                      </Badge>
                    )}
                  </div>
                </div>
                <Progress value={currentProbability} className="h-3" />
              </div>

              <div className="pt-4 text-xs text-muted-foreground">
                <p className="font-semibold mb-1">Scoring Engine Weights:</p>
                <ul className="grid grid-cols-2 gap-x-2 gap-y-1">
                  <li>10th: 5%</li>
                  <li>12th: 5%</li>
                  <li>CGPA: 20%</li>
                  <li>DSA: 30%</li>
                  <li>Aptitude: 20%</li>
                  <li>Projects: 10%</li>
                  <li>Internships: 5%</li>
                  <li>Certs: 5%</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">AI Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              {recommendations.length > 0 ? (
                <ul className="space-y-3">
                  {recommendations.map((rec, idx) => (
                    <li key={idx} className="flex gap-3 text-sm">
                      <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex items-center gap-3 text-sm text-green-600">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Your profile is fully optimized for {targetCompany?.name || 'this company'}!</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
