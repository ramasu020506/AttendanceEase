import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  BarChart3, 
  Download, 
  Printer, 
  Calendar, 
  TrendingUp, 
  CheckCircle2, 
  UserX, 
  AlertTriangle, 
  FileText,
  Radio
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { WEEKLY_ATTENDANCE_TREND } from '../data/mockData';

export const ReportsView: React.FC = () => {
  const { students, classes, attendanceRecords, smsAlerts, selectedDate, settings, addToast } = useApp();
  const [reportRange, setReportRange] = useState<'week' | 'month' | 'term'>('week');

  const classComparisonData = classes.map((c) => ({
    name: c.name.split('(')[0].trim(),
    rate: c.attendanceRateToday,
    students: c.studentCount,
  }));

  const smsCategoryData = [
    { name: 'Absence Alerts', value: smsAlerts.filter((s) => s.category === 'attendance_absence').length || 4, color: '#9B2C2C' },
    { name: 'Late Notices', value: smsAlerts.filter((s) => s.category === 'attendance_late').length || 1, color: '#B7791F' },
    { name: 'General Bulletins', value: smsAlerts.filter((s) => s.category === 'general_announcement').length || 1, color: '#1A1A1A' },
    { name: 'Academic Updates', value: smsAlerts.filter((s) => s.category === 'academic').length || 1, color: '#2D5A27' },
  ];

  const handleExportCSV = () => {
    const headers = 'Student ID,Student Name,Grade,Class,Attendance Status,Date,Guardian Phone\n';
    const rows = attendanceRecords
      .map((r) => {
        const s = students.find((st) => st.id === r.studentId);
        return `"${s?.studentNumber || ''}","${r.studentName}","${s?.grade || ''}","${r.className}","${r.status}","${r.date}","${s?.guardianPhone || ''}"`;
      })
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const safeSchoolName = (settings.schoolName || 'School').replace(/\s+/g, '_');
    link.setAttribute('download', `${safeSchoolName}_Attendance_Report_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      title: 'Export Generated',
      message: 'Downloaded official attendance report CSV.',
      type: 'success',
    });
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#1A1A1A]/15 pb-6">
        <div>
          <div className="text-[9px] uppercase tracking-[0.25em] font-bold text-[#1A1A1A]/50 mb-2">
            Section 05 // Analytics & Audit
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal italic text-[#1A1A1A] leading-tight tracking-tight">
            Attendance & SMS Analytics
          </h2>
          <p className="text-sm text-[#1A1A1A]/70 mt-1.5 max-w-xl">
            Comprehensive audit reports, institutional retention trends, and gateway delivery diagnostics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-[#FFFFFF] border border-[#1A1A1A]/20 hover:bg-[#E8E4DF] text-[#1A1A1A] text-xs font-bold uppercase tracking-wider rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#1A1A1A]" />
            Export CSV
          </button>
          <button
            onClick={handlePrintReport}
            className="px-4 py-2 bg-[#1A1A1A] hover:bg-black text-[#F4F1ED] text-xs font-bold uppercase tracking-wider rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Register
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#FFFFFF] p-6 rounded-xl border border-[#1A1A1A]/12 shadow-xs">
          <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#1A1A1A]/60">Academic Attendance Rate</span>
          <div className="font-serif text-4xl sm:text-5xl font-light text-[#1A1A1A] mt-3">
            95.8%
          </div>
          <p className="text-[11px] text-[#2D5A27] font-medium mt-2">Target &gt;92% (Exceeded)</p>
        </div>

        <div className="bg-[#FFFFFF] p-6 rounded-xl border border-[#1A1A1A]/12 shadow-xs">
          <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#1A1A1A]/60">Cycle Absences</span>
          <div className="font-serif text-4xl sm:text-5xl font-light text-[#9B2C2C] mt-3">
            65 Logs
          </div>
          <p className="text-[11px] text-[#1A1A1A]/60 font-medium mt-2">82% Guardian Verified</p>
        </div>

        <div className="bg-[#FFFFFF] p-6 rounded-xl border border-[#1A1A1A]/12 shadow-xs">
          <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#1A1A1A]/60">SMS Broadcast Volume</span>
          <div className="font-serif text-4xl sm:text-5xl font-light text-[#1A1A1A] mt-3">
            308 Alerts
          </div>
          <p className="text-[11px] text-[#2D5A27] font-medium mt-2">99.4% Gateway Delivery Success</p>
        </div>

        <div className="bg-[#FFFFFF] p-6 rounded-xl border border-[#1A1A1A]/12 shadow-xs">
          <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#1A1A1A]/60">Chronic Absence Rate</span>
          <div className="font-serif text-4xl sm:text-5xl font-light text-[#B7791F] mt-3">
            2.4%
          </div>
          <p className="text-[11px] text-[#1A1A1A]/60 font-medium mt-2">2 Students under audit</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Class Section Breakdown */}
        <div className="bg-[#FFFFFF] p-6 sm:p-7 rounded-xl border border-[#1A1A1A]/12 shadow-xs space-y-4">
          <div>
            <div className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#1A1A1A]/50">
              Distribution
            </div>
            <h3 className="font-serif text-2xl font-normal italic text-[#1A1A1A]">
              Attendance Rate by Homeroom (%)
            </h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="rgba(26, 26, 26, 0.08)" />
                <XAxis dataKey="name" tick={{ fill: '#6B6966', fontSize: 11 }} axisLine={false} tickLine={false} interval={0} angle={-15} textAnchor="end" />
                <YAxis domain={[80, 100]} tick={{ fill: '#6B6966', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid rgba(26,26,26,0.15)', fontSize: '12px' }} />
                <Bar dataKey="rate" name="Attendance %" fill="#1A1A1A" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SMS Broadcast Distribution */}
        <div className="bg-[#FFFFFF] p-6 sm:p-7 rounded-xl border border-[#1A1A1A]/12 shadow-xs space-y-4">
          <div>
            <div className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#1A1A1A]/50">
              Breakdown
            </div>
            <h3 className="font-serif text-2xl font-normal italic text-[#1A1A1A]">
              SMS Dispatch Categories
            </h3>
          </div>
          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={smsCategoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {smsCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid rgba(26,26,26,0.15)', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono-code pt-2 border-t border-[#1A1A1A]/10">
            {smsCategoryData.map((c) => (
              <div key={c.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-xs" style={{ backgroundColor: c.color }} />
                <span className="text-[#1A1A1A]/80">{c.name} ({c.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chronic Absence Log */}
      <div className="bg-[#FFFFFF] rounded-xl border border-[#1A1A1A]/12 shadow-xs p-6 sm:p-7 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#1A1A1A]/10">
          <div>
            <div className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#1A1A1A]/50">
              Action Registry
            </div>
            <h3 className="font-serif text-2xl font-normal italic text-[#1A1A1A] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#9B2C2C]" />
              Intervention Required: At-Risk & Chronic Absentee Roster
            </h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F4F1ED] border-b border-[#1A1A1A]/10 uppercase tracking-[0.2em] text-[#1A1A1A]/60 font-bold text-[9px]">
              <tr>
                <th className="py-3 px-3">Student Name</th>
                <th className="py-3 px-3">ID</th>
                <th className="py-3 px-3">Homeroom</th>
                <th className="py-3 px-3">Absences</th>
                <th className="py-3 px-3">Tardies</th>
                <th className="py-3 px-3">Attendance %</th>
                <th className="py-3 px-3">Guardian Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1A1A]/10">
              {students
                .filter((s) => s.totalAbsent >= 4 || s.attendanceRate < 90)
                .map((s) => (
                  <tr key={s.id} className="hover:bg-[#F4F1ED]/50 transition-colors">
                    <td className="py-3 px-3 font-serif text-sm font-normal italic text-[#1A1A1A]">{s.name}</td>
                    <td className="py-3 px-3 font-mono-code text-[#1A1A1A]/60">{s.studentNumber}</td>
                    <td className="py-3 px-3 font-mono-code">{s.className}</td>
                    <td className="py-3 px-3 font-bold text-[#9B2C2C] font-mono-code">{s.totalAbsent} days</td>
                    <td className="py-3 px-3 text-[#B7791F] font-mono-code">{s.totalLate} days</td>
                    <td className="py-3 px-3 font-bold text-[#9B2C2C] font-mono-code">{s.attendanceRate}%</td>
                    <td className="py-3 px-3 font-mono-code text-[#1A1A1A]">{s.guardianName} ({s.guardianPhone})</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
