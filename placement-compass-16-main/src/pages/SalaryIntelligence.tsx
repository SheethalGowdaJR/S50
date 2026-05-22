import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CheckCircle2, Search, Building2, Briefcase, Calendar, TrendingUp } from 'lucide-react';

import {
  getFilteredData,
  highestPackage,
  averagePackage,
  medianPackage,
  highestBaseSalary,
  topPayingCompany,
  averageBonus,
  salaryGrowthTrend,
  roleWiseCompensation,
  formatCurrency,
  getAllData
} from '@/utils/salaryUtils';

export default function SalaryIntelligence() {
  const allData = getAllData();

  // Filters state
  const [filters, setFilters] = useState({ company: 'all', role: 'all', category: 'all', year: 'all' });
  const [searchQuery, setSearchQuery] = useState('');

  // Dropdown options
  const companies = ['all', ...Array.from(new Set(allData.map(d => d.companyName))).sort()];
  const roles = ['all', ...Array.from(new Set(allData.map(d => d.role))).sort()];
  const categories = ['all', ...Array.from(new Set(allData.map(d => d.category))).sort()];
  const years = ['all', ...Array.from(new Set(allData.map(d => d.year))).sort((a,b)=>Number(b)-Number(a)).map(String)];

  const filteredData = useMemo(() => getFilteredData(filters), [filters]);
  
  // Table sorting & pagination
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  
  const tableData = useMemo(() => {
    let d = [...filteredData];
    if (searchQuery) {
      d = d.filter(item => item.companyName.toLowerCase().includes(searchQuery.toLowerCase()) || item.role.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return d.sort((a,b) => b.totalCTC - a.totalCTC); // Sort by CTC desc
  }, [filteredData, searchQuery]);

  const paginatedData = tableData.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  // Stats
  const kpis = {
    highest: highestPackage(filteredData),
    average: averagePackage(filteredData),
    median: medianPackage(filteredData),
    highestBase: highestBaseSalary(filteredData),
    topCompany: topPayingCompany(filteredData),
    avgBonus: averageBonus(filteredData)
  };

  // AI Insights string generation (rule-based)
  const insights = useMemo(() => {
    const list = [];
    if (kpis.highest > 0) {
      list.push(`The highest recorded package is ${formatCurrency(kpis.highest)} at ${kpis.topCompany}.`);
    }
    const pAvg = averagePackage(allData.filter(d => d.category === 'Product' || d.category === 'E-Commerce' || d.category === 'FinTech'));
    const sAvg = averagePackage(allData.filter(d => d.category === 'Service'));
    if (pAvg > 0 && sAvg > 0) {
      const diff = Math.round(((pAvg - sAvg) / sAvg) * 100);
      list.push(`Product & Specialized companies paid ${diff}% higher on average compared to Service companies.`);
    }
    const trend = salaryGrowthTrend(filteredData);
    if (trend.length >= 2) {
      const first = trend[0].avgCTC;
      const last = trend[trend.length - 1].avgCTC;
      if (last > first) {
        list.push(`Average compensation has grown by ${Math.round(((last-first)/first)*100)}% from ${trend[0].year} to ${trend[trend.length-1].year}.`);
      }
    }
    return list;
  }, [allData, filteredData, kpis]);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
      {/* Hero Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-display font-bold tracking-tight">Salary Package Intelligence</h1>
        <p className="text-muted-foreground text-lg">Analyze placement salary trends, compensation breakdowns, and company-wise offer intelligence.</p>
      </div>

      {/* Filters */}
      <Card className="bg-surface-muted/50 border-brand/10">
        <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground uppercase flex items-center gap-1"><Building2 className="w-3 h-3"/> Company</label>
            <Select value={filters.company} onValueChange={v => {setFilters({...filters, company: v}); setPage(1);}}>
              <SelectTrigger><SelectValue placeholder="All Companies" /></SelectTrigger>
              <SelectContent>{companies.map(c => <SelectItem key={c} value={c}>{c === 'all' ? 'All Companies' : c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground uppercase flex items-center gap-1"><Briefcase className="w-3 h-3"/> Role</label>
            <Select value={filters.role} onValueChange={v => {setFilters({...filters, role: v}); setPage(1);}}>
              <SelectTrigger><SelectValue placeholder="All Roles" /></SelectTrigger>
              <SelectContent>{roles.map(r => <SelectItem key={r} value={r}>{r === 'all' ? 'All Roles' : r}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground uppercase flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Category</label>
            <Select value={filters.category} onValueChange={v => {setFilters({...filters, category: v}); setPage(1);}}>
              <SelectTrigger><SelectValue placeholder="All Categories" /></SelectTrigger>
              <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c === 'all' ? 'All Categories' : c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground uppercase flex items-center gap-1"><Calendar className="w-3 h-3"/> Year</label>
            <Select value={filters.year} onValueChange={v => {setFilters({...filters, year: v}); setPage(1);}}>
              <SelectTrigger><SelectValue placeholder="All Years" /></SelectTrigger>
              <SelectContent>{years.map(y => <SelectItem key={y} value={y}>{y === 'all' ? 'All Years' : y}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="bg-brand text-brand-foreground shadow-md lg:col-span-2">
          <CardContent className="p-4 sm:p-6 flex flex-col justify-center h-full">
            <p className="text-sm font-medium opacity-80 uppercase tracking-wide">Highest Package</p>
            <h3 className="text-3xl lg:text-4xl font-bold mt-1">{formatCurrency(kpis.highest)}</h3>
            <p className="text-sm mt-2 font-medium opacity-90">{kpis.topCompany}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-5 flex flex-col justify-center h-full">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Average Package</p>
            <h3 className="text-2xl font-bold mt-1 text-foreground">{formatCurrency(kpis.average)}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-5 flex flex-col justify-center h-full">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Median Package</p>
            <h3 className="text-2xl font-bold mt-1 text-foreground">{formatCurrency(kpis.median)}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-5 flex flex-col justify-center h-full">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Highest Base</p>
            <h3 className="text-2xl font-bold mt-1 text-foreground">{formatCurrency(kpis.highestBase)}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-5 flex flex-col justify-center h-full">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Avg Bonus/ESOP</p>
            <h3 className="text-2xl font-bold mt-1 text-foreground">{formatCurrency(kpis.avgBonus)}</h3>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      {insights.length > 0 && (
        <Card className="bg-gradient-to-r from-blue-500/10 to-transparent border-blue-500/20">
          <CardContent className="p-4 flex items-start gap-4">
            <div className="bg-blue-500 p-2 rounded-lg text-white mt-1 shrink-0"><TrendingUp className="w-5 h-5"/></div>
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-400">AI Placement Insights</h3>
              <ul className="mt-2 space-y-1">
                {insights.map((insight, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0"/> {insight}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Salary Growth Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer>
                <LineChart data={salaryGrowthTrend(filteredData)}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} tickFormatter={(v) => `₹${v/100000}L`} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))' }} />
                  <Line type="monotone" dataKey="avgCTC" stroke="hsl(var(--brand))" strokeWidth={3} dot={{ fill: 'hsl(var(--brand))', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Paying Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer>
                <BarChart data={roleWiseCompensation(filteredData).slice(0, 5)} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} tickFormatter={(v) => `₹${v/100000}L`} />
                  <YAxis type="category" dataKey="role" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} width={120} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} cursor={{ fill: 'hsl(var(--muted))' }} />
                  <Bar dataKey="avgCTC" fill="hsl(var(--brand))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Offer Table */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
          <div>
            <CardTitle>Verified Offer Records</CardTitle>
            <CardDescription>Detailed breakdown of historical compensation data</CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search companies or roles..." 
              className="pl-9 h-9" 
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setPage(1); }}
            />
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Year</TableHead>
                <TableHead className="text-right">Base</TableHead>
                <TableHead className="text-right">Bonus/ESOP</TableHead>
                <TableHead className="text-right font-bold">Total CTC</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">{row.id}</TableCell>
                  <TableCell className="font-medium">{row.companyName} {row.verified && <CheckCircle2 className="inline w-3 h-3 text-green-500 ml-1" />}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal">{row.role}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{row.year}</TableCell>
                  <TableCell className="text-right">{formatCurrency(row.basePay)}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{formatCurrency(row.variableBonus + row.esopValue)}</TableCell>
                  <TableCell className="text-right font-bold text-brand">{formatCurrency(row.totalCTC)}</TableCell>
                </TableRow>
              ))}
              {paginatedData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">No records found matching your criteria.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between p-4 border-t">
          <div className="text-sm text-muted-foreground">
            Showing {Math.min((page - 1) * rowsPerPage + 1, tableData.length)} to {Math.min(page * rowsPerPage, tableData.length)} of {tableData.length} entries
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(Math.ceil(tableData.length / rowsPerPage), p + 1))} disabled={page >= Math.ceil(tableData.length / rowsPerPage) || tableData.length === 0}>Next</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
