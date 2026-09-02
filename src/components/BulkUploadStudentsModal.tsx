import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  UploadCloud, 
  FileText, 
  Download, 
  Check, 
  AlertCircle, 
  Trash2, 
  Users, 
  Sparkles, 
  FileSpreadsheet,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { Student } from '../types';

interface ParsedStudentRow {
  idTemp: string;
  name: string;
  studentNumber: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  guardianRelationship: string;
  medicalNotes?: string;
  notes?: string;
  isValid: boolean;
  validationError?: string;
}

const SAMPLE_CSV_CONTENT = `Student Name,Student ID,Guardian Name,Guardian Phone,Guardian Email,Relationship,Medical Notes
Julian Robert Vance,DEMO-2026-4412,Marcus Vance,+1 (555) 334-9021,m.vance@demoschool.edu,Father,None
Genevieve Claire Moreau,DEMO-2026-4413,Isabelle Moreau,+1 (555) 445-1289,i.moreau@artscouncil.org,Mother,Penicillin allergy
Aiden Thomas Gallagher,DEMO-2026-4414,Thomas Gallagher,+1 (555) 678-3312,tgallagher@demoschool.edu,Father,Mild asthma
Clara Evelyn Sterling,DEMO-2026-4415,Evelyn Sterling,+1 (555) 901-4456,evelyn.sterling@demoschool.edu,Mother,Carries inhaler
Lucas Samuel Zhao,DEMO-2026-4416,David Zhao,+1 (555) 889-1029,dzhao@techgroup.com,Father,None`;

export const BulkUploadStudentsModal: React.FC = () => {
  const { 
    isBulkUploadModalOpen, 
    setIsBulkUploadModalOpen, 
    bulkUploadTargetClassId, 
    setBulkUploadTargetClassId,
    classes, 
    bulkAddStudents,
    addToast
  } = useApp();

  const [inputMode, setInputMode] = useState<'upload' | 'paste'>('upload');
  const [targetClassId, setTargetClassId] = useState<string>('');
  const [rawText, setRawText] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsedRows, setParsedRows] = useState<ParsedStudentRow[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync target class
  useEffect(() => {
    if (bulkUploadTargetClassId) {
      setTargetClassId(bulkUploadTargetClassId);
    } else if (classes.length > 0 && !targetClassId) {
      setTargetClassId(classes[0].id);
    }
  }, [bulkUploadTargetClassId, classes]);

  if (!isBulkUploadModalOpen) return null;

  const currentClass = classes.find((c) => c.id === targetClassId) || classes[0];

  // Helper to parse CSV or TSV string
  const parseRosterText = (text: string) => {
    if (!text.trim()) {
      setParsedRows([]);
      return;
    }

    const lines = text.trim().split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length === 0) {
      setParsedRows([]);
      return;
    }

    // Determine delimiter (comma, tab, or semicolon)
    const firstLine = lines[0];
    let delimiter = ',';
    if (firstLine.includes('\t')) delimiter = '\t';
    else if (firstLine.includes(';') && !firstLine.includes(',')) delimiter = ';';

    const splitLine = (line: string): string[] => {
      if (delimiter === '\t') {
        return line.split('\t').map((c) => c.trim().replace(/^["']|["']$/g, ''));
      }
      // Regex for CSV split handling quotes
      const regex = /(?:,|\n|^)("(?:(?:"")*[^"]*)*"|[^",\n]*|(?:\n|$))/g;
      const matches: string[] = [];
      let match;
      while ((match = regex.exec(line)) !== null) {
        let val = match[1];
        if (val !== undefined) {
          val = val.trim();
          if (val.startsWith('"') && val.endsWith('"')) {
            val = val.slice(1, -1).replace(/""/g, '"');
          }
          matches.push(val);
        }
        if (regex.lastIndex >= line.length) break;
      }
      return matches.length > 0 ? matches : line.split(delimiter).map((c) => c.trim());
    };

    // Check if first line contains header keywords
    const headerCells = splitLine(firstLine).map((h) => h.toLowerCase().trim());
    const hasHeader = headerCells.some((h) => 
      h.includes('name') || h.includes('student') || h.includes('guardian') || h.includes('parent') || h.includes('phone')
    );

    let nameIdx = 0;
    let idIdx = -1;
    let guardianIdx = 1;
    let phoneIdx = 2;
    let emailIdx = 3;
    let relIdx = 4;
    let medIdx = 5;

    if (hasHeader) {
      nameIdx = headerCells.findIndex((h) => (h.includes('student') && h.includes('name')) || h === 'name' || h === 'scholar');
      if (nameIdx === -1) nameIdx = headerCells.findIndex((h) => h.includes('name'));
      if (nameIdx === -1) nameIdx = 0;

      idIdx = headerCells.findIndex((h) => h.includes('id') || h.includes('number') || h.includes('code'));
      guardianIdx = headerCells.findIndex((h) => h.includes('guardian') || h.includes('parent') || h.includes('contact'));
      if (guardianIdx === -1) guardianIdx = nameIdx + 1;

      phoneIdx = headerCells.findIndex((h) => h.includes('phone') || h.includes('mobile') || h.includes('cell') || h.includes('sms'));
      emailIdx = headerCells.findIndex((h) => h.includes('email') || h.includes('mail'));
      relIdx = headerCells.findIndex((h) => h.includes('relation') || h.includes('kin'));
      medIdx = headerCells.findIndex((h) => h.includes('med') || h.includes('health') || h.includes('note') || h.includes('allerg'));
    }

    const dataLines = hasHeader ? lines.slice(1) : lines;
    const parsed: ParsedStudentRow[] = [];

    dataLines.forEach((line, index) => {
      const cols = splitLine(line);
      if (cols.length === 0 || cols.every((c) => !c.trim())) return;

      const rawName = cols[nameIdx] || cols[0] || '';
      const rawId = idIdx !== -1 && cols[idIdx] ? cols[idIdx] : '';
      const rawGuardian = guardianIdx !== -1 && cols[guardianIdx] ? cols[guardianIdx] : '';
      const rawPhone = phoneIdx !== -1 && cols[phoneIdx] ? cols[phoneIdx] : '';
      const rawEmail = emailIdx !== -1 && cols[emailIdx] ? cols[emailIdx] : '';
      const rawRel = relIdx !== -1 && cols[relIdx] ? cols[relIdx] : 'Guardian';
      const rawNotes = medIdx !== -1 && cols[medIdx] ? cols[medIdx] : '';

      const name = rawName.trim();
      const guardianName = rawGuardian.trim() || (name ? `Guardian of ${name}` : 'Primary Guardian');
      const guardianPhone = rawPhone.trim() || '+1 (555) 012-0000';
      const guardianEmail = rawEmail.trim() || (guardianName ? `${guardianName.toLowerCase().replace(/\s+/g, '.')}@guardian.net` : '');
      const guardianRelationship = rawRel.trim() || 'Parent/Guardian';
      const medicalNotes = rawNotes.trim();

      const isValid = name.length >= 2;
      const validationError = !name ? 'Missing student name' : undefined;

      parsed.push({
        idTemp: `temp-${Date.now()}-${index}`,
        name,
        studentNumber: rawId.trim(),
        guardianName,
        guardianPhone,
        guardianEmail,
        guardianRelationship,
        medicalNotes,
        notes: '',
        isValid,
        validationError,
      });
    });

    setParsedRows(parsed);
  };

  const handleFileUpload = (file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setRawText(text);
      parseRosterText(text);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDownloadTemplate = () => {
    const blob = new Blob([SAMPLE_CSV_CONTENT], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'scholar_roster_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast({
      title: 'Template Downloaded',
      message: 'CSV roster template saved to your downloads folder.',
      type: 'info',
    });
  };

  const handleLoadDemoDataset = () => {
    setRawText(SAMPLE_CSV_CONTENT);
    setFileName('sample_cohort_2026.csv');
    parseRosterText(SAMPLE_CSV_CONTENT);
    addToast({
      title: 'Sample Roster Loaded',
      message: '5 sample scholar records populated into parser.',
      type: 'info',
    });
  };

  const handleDeleteRow = (idTemp: string) => {
    setParsedRows((prev) => prev.filter((r) => r.idTemp !== idTemp));
  };

  const handleEnrollAll = () => {
    const validRows = parsedRows.filter((r) => r.isValid);
    if (validRows.length === 0) {
      addToast({
        title: 'No Valid Scholars',
        message: 'Please provide at least one valid student record to import.',
        type: 'error',
      });
      return;
    }

    if (!targetClassId) {
      addToast({
        title: 'Target Class Required',
        message: 'Please select an academic class for enrollment.',
        type: 'error',
      });
      return;
    }

    const studentsToEnroll = validRows.map((r) => ({
      name: r.name,
      studentNumber: r.studentNumber,
      avatar: '',
      grade: currentClass?.grade || 'Grade 9',
      classId: targetClassId,
      className: currentClass?.name || 'Class',
      guardianName: r.guardianName,
      guardianRelationship: r.guardianRelationship,
      guardianPhone: r.guardianPhone,
      guardianEmail: r.guardianEmail,
      emergencyContact: `${r.guardianName} (${r.guardianRelationship})`,
      emergencyPhone: r.guardianPhone,
      status: 'active' as const,
      medicalNotes: r.medicalNotes,
      notes: r.notes || `Bulk enrolled into ${currentClass?.name || 'class'} on ${new Date().toLocaleDateString()}.`,
    }));

    bulkAddStudents(studentsToEnroll, targetClassId);

    // Reset & close
    setParsedRows([]);
    setRawText('');
    setFileName(null);
    setIsBulkUploadModalOpen(false);
  };

  const validCount = parsedRows.filter((r) => r.isValid).length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
      <div className="bg-[#FFFFFF] w-full max-w-4xl rounded-2xl shadow-2xl border border-[#1A1A1A]/20 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#1A1A1A] text-[#F4F1ED] flex items-center justify-between border-b border-[#1A1A1A]">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-white/10 rounded-lg">
              <UploadCloud className="w-4 h-4 text-[#F4F1ED]" />
            </span>
            <div>
              <div className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#F4F1ED]/60">
                Enrollment Engine // Cohort Ingestion
              </div>
              <h3 className="font-serif text-xl font-normal italic text-[#F4F1ED]">
                Bulk Student Roster Ingestion
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadTemplate}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-[#F4F1ED] text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer border border-white/10"
              title="Download clean CSV template"
            >
              <Download className="w-3.5 h-3.5" />
              Download Template (.CSV)
            </button>

            <button
              onClick={() => setIsBulkUploadModalOpen(false)}
              className="p-1.5 text-[#F4F1ED]/70 hover:text-[#F4F1ED] hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-[#FFFFFF]">
          {/* Step 1: Target Class Selection */}
          <div className="bg-[#F4F1ED] p-4 rounded-xl border border-[#1A1A1A]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/70 mb-1 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#1A1A1A]" /> 1. Select Target Class / Homeroom Section
              </label>
              <p className="text-xs text-[#1A1A1A]/60">
                All parsed student records will be enrolled and rostered into this academic section.
              </p>
            </div>

            <div className="min-w-[280px]">
              <select
                value={targetClassId}
                onChange={(e) => {
                  setTargetClassId(e.target.value);
                  setBulkUploadTargetClassId(e.target.value);
                }}
                className="w-full text-xs p-2.5 bg-[#FFFFFF] border border-[#1A1A1A]/20 rounded-lg font-serif text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] shadow-xs"
              >
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} ({cls.grade}) &bull; {cls.studentCount} enrolled
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Step 2: Input Method (Upload vs Paste) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/70">
                  2. Ingestion Method
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleLoadDemoDataset}
                  className="px-2.5 py-1 bg-[#E8E4DF] hover:bg-[#1A1A1A] hover:text-[#F4F1ED] text-[#1A1A1A] text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center gap-1 border border-[#1A1A1A]/10"
                >
                  <Sparkles className="w-3 h-3" />
                  Load Sample Roster
                </button>

                <div className="inline-flex rounded-lg border border-[#1A1A1A]/15 p-0.5 bg-[#F4F1ED]">
                  <button
                    type="button"
                    onClick={() => setInputMode('upload')}
                    className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-colors cursor-pointer ${
                      inputMode === 'upload'
                        ? 'bg-[#1A1A1A] text-[#F4F1ED]'
                        : 'text-[#1A1A1A]/70 hover:text-[#1A1A1A]'
                    }`}
                  >
                    CSV File
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputMode('paste')}
                    className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-colors cursor-pointer ${
                      inputMode === 'paste'
                        ? 'bg-[#1A1A1A] text-[#F4F1ED]'
                        : 'text-[#1A1A1A]/70 hover:text-[#1A1A1A]'
                    }`}
                  >
                    Copy / Paste
                  </button>
                </div>
              </div>
            </div>

            {inputMode === 'upload' ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
                  isDragging
                    ? 'border-[#1A1A1A] bg-[#E8E4DF]'
                    : 'border-[#1A1A1A]/20 bg-[#F4F1ED]/50 hover:bg-[#F4F1ED] hover:border-[#1A1A1A]/40'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.tsv,.txt"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                />

                <div className="p-3 bg-[#E8E4DF] rounded-full border border-[#1A1A1A]/10 mb-3">
                  <FileSpreadsheet className="w-6 h-6 text-[#1A1A1A]" />
                </div>

                {fileName ? (
                  <div className="space-y-1">
                    <p className="font-serif text-lg font-normal italic text-[#1A1A1A]">
                      {fileName}
                    </p>
                    <p className="text-xs text-[#2D5A27] font-mono-code font-semibold flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> File parsed ({parsedRows.length} scholar records found)
                    </p>
                    <span className="text-[10px] text-[#1A1A1A]/50 underline mt-1 inline-block">
                      Click to choose a different file
                    </span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="font-serif text-base font-normal italic text-[#1A1A1A]">
                      Drag & Drop CSV / TSV file here, or click to browse
                    </p>
                    <p className="text-xs text-[#1A1A1A]/60 font-mono-code">
                      Accepts standard spreadsheets with Student Name, Guardian Phone, Guardian Name
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <textarea
                  value={rawText}
                  onChange={(e) => {
                    setRawText(e.target.value);
                    parseRosterText(e.target.value);
                  }}
                  rows={5}
                  placeholder={`Paste rows from Excel, Google Sheets, or CSV here:\n\nStudent Name,Guardian Name,Guardian Phone,Guardian Email\nJulian Vance,Marcus Vance,+1 (555) 334-9021,m.vance@demoschool.edu\nClara Sterling,Evelyn Sterling,+1 (555) 901-4456,evelyn.sterling@demoschool.edu`}
                  className="w-full p-3 text-xs font-mono-code bg-[#F4F1ED] border border-[#1A1A1A]/15 rounded-xl focus:outline-none focus:bg-white focus:border-[#1A1A1A] leading-relaxed shadow-inner"
                />
              </div>
            )}
          </div>

          {/* Step 3: Live Parsed Roster Preview Table */}
          {parsedRows.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-[#1A1A1A]/10 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/70">
                    3. Roster Validation & Preview
                  </span>
                  <span className="text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full font-bold bg-[#E2ECE1] text-[#1C3D18] border border-[#2D5A27]/20 font-mono-code">
                    {validCount} of {parsedRows.length} Valid
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setParsedRows([]);
                    setRawText('');
                    setFileName(null);
                  }}
                  className="text-[10px] font-bold uppercase tracking-wider text-[#9B2C2C] hover:underline cursor-pointer"
                >
                  Clear Table
                </button>
              </div>

              <div className="border border-[#1A1A1A]/15 rounded-xl overflow-hidden shadow-xs bg-[#FFFFFF]">
                <div className="overflow-x-auto max-h-64">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-[#F4F1ED] border-b border-[#1A1A1A]/12 text-[#1A1A1A]/70 uppercase tracking-wider text-[9px] font-bold sticky top-0 z-10">
                      <tr>
                        <th className="py-2.5 px-3">#</th>
                        <th className="py-2.5 px-3">Scholar Name</th>
                        <th className="py-2.5 px-3">Student ID</th>
                        <th className="py-2.5 px-3">Primary Guardian</th>
                        <th className="py-2.5 px-3">Guardian Phone (SMS)</th>
                        <th className="py-2.5 px-3">Guardian Email</th>
                        <th className="py-2.5 px-3">Relationship</th>
                        <th className="py-2.5 px-3">Medical / Notes</th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1A1A1A]/8">
                      {parsedRows.map((row, idx) => (
                        <tr
                          key={row.idTemp}
                          className={`hover:bg-[#F4F1ED]/50 transition-colors ${
                            !row.isValid ? 'bg-[#FBF0F0]' : ''
                          }`}
                        >
                          <td className="py-2 px-3 font-mono-code text-[#1A1A1A]/50 text-[10px]">
                            {idx + 1}
                          </td>
                          <td className="py-2 px-3 font-medium text-[#1A1A1A] whitespace-nowrap">
                            <span className="font-serif text-sm">{row.name}</span>
                            {!row.isValid && (
                              <span className="block text-[9px] text-[#9B2C2C] font-mono-code">
                                {row.validationError}
                              </span>
                            )}
                          </td>
                          <td className="py-2 px-3 font-mono-code text-[#1A1A1A]/60 text-[11px] whitespace-nowrap">
                            {row.studentNumber || <span className="text-[#1A1A1A]/40 italic">Auto-generated</span>}
                          </td>
                          <td className="py-2 px-3 text-[#1A1A1A]/80 whitespace-nowrap">
                            {row.guardianName}
                          </td>
                          <td className="py-2 px-3 font-mono-code text-[#1A1A1A] font-semibold whitespace-nowrap">
                            {row.guardianPhone}
                          </td>
                          <td className="py-2 px-3 font-mono-code text-[#1A1A1A]/60 text-[11px] whitespace-nowrap">
                            {row.guardianEmail || '-'}
                          </td>
                          <td className="py-2 px-3 text-[#1A1A1A]/70 text-[11px] whitespace-nowrap">
                            {row.guardianRelationship}
                          </td>
                          <td className="py-2 px-3 text-[#1A1A1A]/60 text-[11px] max-w-[150px] truncate font-mono-code">
                            {row.medicalNotes || '-'}
                          </td>
                          <td className="py-2 px-3 text-right whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => handleDeleteRow(row.idTemp)}
                              className="p-1 text-[#1A1A1A]/40 hover:text-[#9B2C2C] rounded transition-colors cursor-pointer"
                              title="Remove row from import"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#F4F1ED] border-t border-[#1A1A1A]/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-[#1A1A1A]/70 font-mono-code text-center sm:text-left">
            Target Section: <strong className="text-[#1A1A1A]">{currentClass?.name}</strong> &bull; {validCount} scholar(s) ready
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setIsBulkUploadModalOpen(false)}
              className="flex-1 sm:flex-initial px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#1A1A1A]/70 hover:bg-[#E8E4DF] rounded-lg transition-colors cursor-pointer text-center"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleEnrollAll}
              disabled={validCount === 0}
              className={`flex-1 sm:flex-initial px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-[#F4F1ED] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer ${
                validCount === 0
                  ? 'bg-[#1A1A1A]/40 cursor-not-allowed'
                  : 'bg-[#1A1A1A] hover:bg-black active:scale-[0.98]'
              }`}
            >
              <Check className="w-4 h-4" />
              Enroll {validCount} Scholars to Class
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
